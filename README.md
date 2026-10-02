# Contact form setup

The contact endpoint requires PHP 8.1 or newer, Composer, the PHP OpenSSL extension, and an SMTP account authorized to send mail. From the project root, install the mailer dependency:

```powershell
composer install
```

Set the following environment variables in the PHP hosting environment or secret manager. `.env.example` contains placeholders only; this project does not load `.env` files automatically. Do not commit credentials.

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port, commonly `587` for STARTTLS or `465` for implicit TLS |
| `SMTP_ENCRYPTION` | `tls` for STARTTLS or `ssl` for implicit TLS |
| `SMTP_USERNAME` | SMTP account username |
| `SMTP_PASSWORD` | SMTP account password or provider-issued app password |
| `CONTACT_FROM_EMAIL` | Verified sender address belonging to the SMTP account/domain |
| `CONTACT_FROM_NAME` | Sender display name |
| `CONTACT_TO_EMAIL` | Recipient mailbox for contact enquiries |

The form posts to `php/contact.php`. Run the site using a PHP-enabled web server; Five Server does not execute PHP. For local development, use a PHP server from the project root:

```powershell
php -S 127.0.0.1:8000 -t .
```

The endpoint reports success only after PHPMailer receives SMTP acceptance. That does not guarantee inbox delivery; verify delivery using an authorized test mailbox.
