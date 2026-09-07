/**
 * IndexNow — сказать Яндексу об изменившихся страницах в тот же час,
 * а не через неделю.
 *
 * Зачем это здесь. Обход по sitemap у молодого домена идёт медленно: в августе
 * Яндекс перечитывал файл раз в неделю и брал по странице в сутки, из-за чего
 * 20 адресов из 33 не было в поиске. Ручной «Переобход страниц» в Вебмастере
 * это лечит, но руками и с лимитом 150 адресов в сутки. IndexNow делает то же
 * самое запросом из выкладки: протокол общий, отправка на один эндпоинт
 * расходится по всем участникам — Яндексу и Bing. Google в IndexNow не входит
 * и находит новое сам за день-два, ему заявка и не нужна.
 *
 * Что отправляем. Только то, что действительно изменилось, — иначе смысл
 * протокола теряется и участники начинают резать лимиты. За «изменилось»
 * отвечает lastmod в sitemap: он в этом проекте проставлен руками и намеренно
 * не двигается на каждую сборку (см. src/app/sitemap.ts), то есть уже является
 * честным ответом на вопрос «что переписали». Поэтому базой сравнения служит
 * sitemap, который сейчас лежит на боевом домене, то есть результат прошлой
 * выкладки, а свежий берётся из out/.
 *
 * Ключ и хост не задаются здесь ещё раз: ключ — это содержимое файла
 * public/<ключ>.txt, который проверяет сам IndexNow, хост — public/CNAME.
 * Второго места правды нет, разойтись нечему.
 *
 * Запуск:
 *   node scripts/indexnow.mjs              # посчитать изменения и отправить
 *   node scripts/indexnow.mjs --dry        # посчитать и показать, не отправляя
 *   node scripts/indexnow.mjs --all        # отправить все адреса из sitemap
 *   node scripts/indexnow.mjs <url> <url>  # отправить именно эти
 *   node scripts/indexnow.mjs --plan f.json    # только посчитать, в файл
 *   node scripts/indexnow.mjs --submit f.json  # только отправить из файла
 *
 * Пара --plan/--submit нужна выкладке: считать надо до деплоя, пока на домене
 * ещё старый sitemap, а отправлять — после, когда страницы уже отдаются.
 * Позвать робота на адрес, который ещё 404, хуже, чем не звать вовсе.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'

// Отправка на эндпоинт Яндекса, а не на общий api.indexnow.org: Яндекс здесь
// адресат, ради которого всё и затевалось, а участники протокола обмениваются
// поданными адресами между собой.
const ENDPOINT = 'https://yandex.com/indexnow'

const PUB = path.resolve('public')
const SITEMAP = path.resolve('out/sitemap.xml')

const argv = process.argv.slice(2)
const flag = (name) => argv.includes(name)
const valueOf = (name) => {
  const i = argv.indexOf(name)
  return i === -1 ? null : argv[i + 1]
}

/** Ключ — содержимое единственного шестнадцатеричного .txt в public/. */
async function readKey() {
  const files = await readdir(PUB)
  const keyFiles = files.filter((f) => /^[0-9a-f]{8,128}\.txt$/.test(f))

  if (keyFiles.length === 0) {
    throw new Error(
      'В public/ нет файла ключа IndexNow вида <ключ>.txt.\n' +
        'Создать: node -e "const k=require(\'crypto\').randomBytes(16).toString(\'hex\');' +
        'require(\'fs\').writeFileSync(`public/${k}.txt`,k);console.log(k)"',
    )
  }
  // Двух быть не должно: IndexNow проверяет тот ключ, что в запросе, и лишний
  // файл означает, что старый забыли убрать — молча выбрать один нельзя.
  if (keyFiles.length > 1) {
    throw new Error(`В public/ несколько файлов ключа: ${keyFiles.join(', ')}. Оставьте один.`)
  }

  const file = keyFiles[0]
  const key = (await readFile(path.join(PUB, file), 'utf8')).trim()

  // Имя файла обязано совпадать с содержимым — иначе IndexNow ответит 403.
  if (`${key}.txt` !== file) {
    throw new Error(`Содержимое ${file} не совпадает с именем файла: «${key}».`)
  }
  return key
}

const readHost = async () => (await readFile(path.join(PUB, 'CNAME'), 'utf8')).trim()

/** Разбор sitemap в Map<url, lastmod>. Без внешнего парсера: файл свой. */
function parseSitemap(xml) {
  const map = new Map()
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]
    if (!loc) continue
    map.set(loc, block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? '')
  }
  return map
}

/** Sitemap с боевого домена — снимок прошлой выкладки. null, если не отдался. */
async function liveSitemap(host) {
  try {
    const res = await fetch(`https://${host}/sitemap.xml`, {
      headers: { 'User-Agent': 'indexnow-diff (+https://' + host + ')' },
    })
    if (!res.ok) return null
    return parseSitemap(await res.text())
  } catch {
    return null
  }
}

/**
 * Что изменилось: новые адреса и те, у которых вырос lastmod.
 *
 * Витрины /stati/ и /raboty/ добавляются, когда под ними появилась страница:
 * их собственный lastmod заморожен, а список на них при этом стал другим.
 */
function changed(live, next) {
  const urls = []
  for (const [url, mod] of next) {
    if (!live.has(url)) urls.push(url)
    else if (mod && live.get(url) && mod > live.get(url)) urls.push(url)
  }

  const set = new Set(urls)
  for (const index of ['stati', 'raboty']) {
    const prefix = `/${index}/`
    const hasNew = urls.some((u) => new URL(u).pathname.startsWith(prefix) && new URL(u).pathname !== prefix)
    if (!hasNew) continue
    const indexUrl = [...next.keys()].find((u) => new URL(u).pathname === prefix)
    if (indexUrl && !set.has(indexUrl)) urls.push(indexUrl)
  }

  return urls
}

async function submit(urls, key, host) {
  if (urls.length === 0) {
    console.log('IndexNow: отправлять нечего.')
    return
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList: urls,
    }),
  })

  // 200 — принято, 202 — принято, ключ ещё проверяется. Остальное разбираем:
  // 403 значит, что файл ключа не отдался, 422 — что адреса не с этого хоста.
  if (res.status === 200 || res.status === 202) {
    console.log(`IndexNow: отправлено ${urls.length} адресов, ответ ${res.status}.`)
    for (const u of urls) console.log(`  ${u}`)
    return
  }

  const body = await res.text().catch(() => '')
  throw new Error(`IndexNow ответил ${res.status}. ${body.slice(0, 300)}`)
}

const [key, host] = await Promise.all([readKey(), readHost()])

// --submit: список уже посчитан на шаге до деплоя, просто отправляем.
const submitFile = valueOf('--submit')
if (submitFile) {
  const urls = JSON.parse(await readFile(submitFile, 'utf8'))
  await submit(urls, key, host)
  process.exit(0)
}

const planFile = valueOf('--plan')
const explicit = argv.filter((a) => a.startsWith('http'))
let urls

if (explicit.length) {
  urls = explicit
} else {
  const next = parseSitemap(await readFile(SITEMAP, 'utf8'))

  if (flag('--all')) {
    urls = [...next.keys()]
  } else {
    const live = await liveSitemap(host)
    if (!live) {
      // Сеть могла просто не ответить. Молча отправить все 40 адресов на этом
      // основании нельзя: это ровно то злоупотребление, за которое режут лимит.
      console.log(`IndexNow: не удалось прочитать https://${host}/sitemap.xml — пропускаю.`)
      console.log('Если сайт выкладывается впервые, запустите с --all.')
      // Пустой план, а не отсутствие файла: следующий шаг выкладки его ждёт.
      if (planFile) await writeFile(planFile, '[]')
      process.exit(0)
    }
    urls = changed(live, next)
  }
}

if (planFile) {
  await writeFile(planFile, JSON.stringify(urls, null, 2))
  console.log(`IndexNow: к отправке ${urls.length} адресов → ${planFile}`)
  for (const u of urls) console.log(`  ${u}`)
  process.exit(0)
}

if (flag('--dry')) {
  console.log(`IndexNow: отправить бы ${urls.length} адресов:`)
  for (const u of urls) console.log(`  ${u}`)
  process.exit(0)
}

await submit(urls, key, host)
