<?php
/**
 * Приём заявки с формы и пересылка в Telegram.
 *
 * Лежит рядом со статикой в out/. Токен только здесь, на сервере, — в бандл
 * фронтенда он не попадает. Ничего не сохраняется: базы для утечки нет.
 *
 * Перед выкладкой заполнить BOT_TOKEN и CHAT_ID (см. TODO.md).
 */

declare(strict_types=1);

const BOT_TOKEN = '{TELEGRAM_BOT_TOKEN}';
const CHAT_ID   = '{TELEGRAM_CHAT_ID}';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function fail(int $code, string $msg): never {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail(405, 'method');
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 8000) {
    fail(413, 'size');
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    fail(400, 'json');
}

$clean = static function (?string $v, int $max): string {
    $v = trim((string) $v);
    $v = str_replace(["\r", "\0"], '', $v);
    return mb_substr($v, 0, $max);
};

// honeypot: поле скрыто от человека, заполнить его может только бот
if ($clean($data['company'] ?? '', 100) !== '') {
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

$name    = $clean($data['name'] ?? '', 120);
$contact = $clean($data['contact'] ?? '', 120);
$task    = $clean($data['task'] ?? '', 2000);
$plan    = $clean($data['plan'] ?? '', 60);
$page    = $clean($data['page'] ?? '', 300);

if ($name === '' || $contact === '') {
    fail(422, 'empty');
}

// Согласие проверяется и здесь, а не только в форме: галочку на клиенте
// видно всем, а принимать персональные данные без неё нельзя.
if (($data['consent'] ?? null) !== true) {
    fail(422, 'consent');
}

// простейший заслон от долбёжки: не чаще раза в 10 секунд с одного адреса
$ip   = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$lock = sys_get_temp_dir() . '/lead_' . md5($ip);
if (is_file($lock) && (time() - (int) filemtime($lock)) < 10) {
    fail(429, 'rate');
}
@touch($lock);

$esc = static fn (string $s): string => htmlspecialchars($s, ENT_NOQUOTES | ENT_HTML5, 'UTF-8');

$text = "<b>Заявка с сайта</b>\n\n"
      . "<b>Имя:</b> " . $esc($name) . "\n"
      . "<b>Связь:</b> " . $esc($contact) . "\n"
      . ($plan !== '' ? "<b>Формат:</b> " . $esc($plan) . "\n" : '')
      . ($task !== '' ? "<b>Задача:</b> " . $esc($task) . "\n" : '')
      . "<b>Согласие на обработку ПД:</b> да\n"
      . "\n<i>" . $esc($page) . "</i>";

$ch = curl_init('https://api.telegram.org/bot' . BOT_TOKEN . '/sendMessage');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query([
        'chat_id'    => CHAT_ID,
        'text'       => $text,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true,
    ]),
]);
$res  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

if ($res === false || $code !== 200) {
    fail(502, 'telegram');
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
