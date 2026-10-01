<?php
declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$respond = static function (int $status, bool $success, string $message, array $errors = []): void {
	http_response_code($status);
	$response = ['success' => $success, 'message' => $message];
	if ($errors !== []) {
		$response['errors'] = $errors;
	}

	echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
	exit;
};

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
	header('Allow: POST');
	$respond(405, false, 'This endpoint accepts POST requests only.');
}

$contentLength = filter_var($_SERVER['CONTENT_LENGTH'] ?? '0', FILTER_VALIDATE_INT);
if ($contentLength === false || $contentLength > 16000) {
	$respond(413, false, 'This request is too large. Please shorten your message and try again.');
}

$honeypot = $_POST['website'] ?? '';
if (!is_string($honeypot)) {
	$respond(400, false, 'Unable to process this request. Please review the form and try again.');
}
if (trim($honeypot) !== '') {
	$respond(400, false, 'Unable to process this request. Please review the form and try again.');
}

$limits = [
	'firstname' => 160,
	'lastname' => 160,
	'phone' => 10,
	'email' => 254,
	'message' => 5000,
];
$values = [];
$errors = [];

foreach ($limits as $field => $maxLength) {
	$input = $_POST[$field] ?? null;
	if (!is_string($input)) {
		$errors[$field] = 'This field is required.';
		continue;
	}

	$value = trim($input);
	if ($value === '') {
		$errors[$field] = 'This field is required.';
		continue;
	}
	if (strlen($value) > $maxLength) {
		$errors[$field] = 'This field is too long.';
		continue;
	}
	if (preg_match('//u', $value) !== 1) {
		$errors[$field] = 'This field contains invalid text.';
		continue;
	}

	$controlPattern = $field === 'message'
		? '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/'
		: '/[\x00-\x1F\x7F]/';
	if (preg_match($controlPattern, $value) === 1) {
		$errors[$field] = 'This field contains unsupported characters.';
		continue;
	}

	$values[$field] = $value;
}

if (!isset($errors['firstname']) && preg_match("/^[\p{L}\p{M}][\p{L}\p{M} '-]*$/u", $values['firstname']) !== 1) {
	$errors['firstname'] = 'Enter a valid first name.';
}
if (!isset($errors['lastname']) && preg_match("/^[\p{L}\p{M}][\p{L}\p{M} '-]*$/u", $values['lastname']) !== 1) {
	$errors['lastname'] = 'Enter a valid last name.';
}
if (!isset($errors['phone']) && preg_match('/^[0-9]{10}$/', $values['phone']) !== 1) {
	$errors['phone'] = 'Enter a 10-digit phone number.';
}
if (!isset($errors['email']) && filter_var($values['email'], FILTER_VALIDATE_EMAIL) === false) {
	$errors['email'] = 'Enter a valid email address.';
}

if ($errors !== []) {
	$respond(422, false, 'Please correct the highlighted fields and try again.', $errors);
}

$values['message'] = str_replace(["\r\n", "\r"], "\n", $values['message']);

$config = require __DIR__ . '/config.php';
$port = filter_var($config['smtp_port'], FILTER_VALIDATE_INT, [
	'options' => ['min_range' => 1, 'max_range' => 65535],
]);
$encryption = $config['smtp_encryption'];
$requiredSettings = [
	'SMTP_HOST' => $config['smtp_host'],
	'SMTP_USERNAME' => $config['smtp_username'],
	'SMTP_PASSWORD' => $config['smtp_password'],
	'CONTACT_FROM_EMAIL' => $config['from_email'],
	'CONTACT_TO_EMAIL' => $config['to_email'],
];
$missingSettings = array_keys(array_filter($requiredSettings, static fn (string $value): bool => $value === ''));

if (
	$missingSettings !== [] ||
	$port === false ||
	!in_array($encryption, ['tls', 'ssl'], true) ||
	filter_var($config['from_email'], FILTER_VALIDATE_EMAIL) === false ||
	filter_var($config['to_email'], FILTER_VALIDATE_EMAIL) === false ||
	strlen($config['from_name']) > 120 ||
	preg_match('/[\x00-\x1F\x7F]/', $config['from_name']) === 1
) {
	error_log('[contact] SMTP configuration is incomplete or invalid.');
	$respond(503, false, 'The contact service is temporarily unavailable. Please try again later.');
}

$autoloadPath = dirname(__DIR__) . '/vendor/autoload.php';
if (!is_file($autoloadPath)) {
	error_log('[contact] PHPMailer autoloader is unavailable.');
	$respond(503, false, 'The contact service is temporarily unavailable. Please try again later.');
}

require_once $autoloadPath;

if (!class_exists(\PHPMailer\PHPMailer\PHPMailer::class)) {
	error_log('[contact] PHPMailer class is unavailable after autoload.');
	$respond(503, false, 'The contact service is temporarily unavailable. Please try again later.');
}

try {
	$mailer = new \PHPMailer\PHPMailer\PHPMailer(true);
	$mailer->isSMTP();
	$mailer->Host = $config['smtp_host'];
	$mailer->SMTPAuth = true;
	$mailer->Username = $config['smtp_username'];
	$mailer->Password = $config['smtp_password'];
	$mailer->SMTPSecure = $encryption === 'ssl'
		? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
		: \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
	$mailer->Port = $port;
	$mailer->Timeout = 12;
	$mailer->SMTPDebug = 0;
	$mailer->CharSet = \PHPMailer\PHPMailer\PHPMailer::CHARSET_UTF8;
	$mailer->isHTML(false);
	$mailer->setFrom($config['from_email'], $config['from_name']);
	$mailer->addAddress($config['to_email']);
	$mailer->addReplyTo($values['email'], $values['firstname'] . ' ' . $values['lastname']);
	$mailer->Subject = 'New Ciranta Academy contact enquiry';
	$mailer->Body = implode("\n", [
		'Name: ' . $values['firstname'] . ' ' . $values['lastname'],
		'Phone: ' . $values['phone'],
		'Email: ' . $values['email'],
		'',
		'Message:',
		$values['message'],
	]);
	$mailer->send();
} catch (\Throwable $exception) {
	error_log('[contact] SMTP delivery failed (' . get_class($exception) . ').');
	$respond(502, false, 'We could not send your message. Please try again later.');
}

$respond(200, true, 'Thank you. Your message has been sent successfully.');
