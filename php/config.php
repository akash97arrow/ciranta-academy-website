<?php
declare(strict_types=1);

$readEnvironment = static function (string $name): string {
	$value = getenv($name);
	return $value === false ? '' : $value;
};

return [
	'smtp_host' => trim($readEnvironment('SMTP_HOST')),
	'smtp_port' => $readEnvironment('SMTP_PORT') ?: '587',
	'smtp_encryption' => strtolower(trim($readEnvironment('SMTP_ENCRYPTION') ?: 'tls')),
	'smtp_username' => $readEnvironment('SMTP_USERNAME'),
	'smtp_password' => $readEnvironment('SMTP_PASSWORD'),
	'from_email' => trim($readEnvironment('CONTACT_FROM_EMAIL')),
	'from_name' => trim($readEnvironment('CONTACT_FROM_NAME') ?: 'Ciranta Academy'),
	'to_email' => trim($readEnvironment('CONTACT_TO_EMAIL')),
];
