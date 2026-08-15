import { SITE } from '@/data/site'

/**
 * Счётчик Яндекс.Метрики.
 *
 * Пока SITE.metrikaId === null, на странице нет ни скрипта, ни <noscript> —
 * пустой счётчик хуже отсутствующего: он тянет запрос к mc.yandex.ru и ничего
 * не считает. Поставить номер в site.ts — включатся и скрипт, и цели
 * lead_sent, tg_click, open_site, tg_post, hero_tab, которые уже расставлены
 * по секциям через goal().
 *
 * defer, а не сразу: счётчик не должен конкурировать за сеть с первым экраном.
 * webvisor выключен — он пишет движения мыши и ввод в поля, а через форму идут
 * персональные данные, и политика на сайте такой записи не предусматривает.
 */
export function Metrika() {
  if (SITE.metrikaId === null) return null

  const id = SITE.metrikaId

  return (
    <>
      <script
        defer
        dangerouslySetInnerHTML={{
          __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${id},"init",{defer:true,clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});`,
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
