<?php
$from_ajax = true;
require_once('include_files/init.php');
$name_about = '';
$email_about = '';
$content_about = '';
if (isset($_POST['name_about'])) {
    $name_about = $_POST['name_about'];
}
if (isset($_POST['email_about'])) {
    $email_about = $_POST['email_about'];
}
if (isset($_POST['content_about'])) {
    $content_about = $_POST['content_about'];
}
$to      = SUPPORT_EMAIL;
$subject = 'פנייה באתר';
$message = 'שם: ' . $name_about . "\r\n" . 'אימייל ' . $email_about . "\r\n" . $content_about;
$headers = 'From: ' . EMAIL_SENDER . "\r\n" .
    'Reply-To: ' . EMAIL_REPLY_TO . "\r\n" .
    'X-Mailer: PHP/' . phpversion() . "\r\n" .
    'MIME-Version: 1.0' . "\r\n" .
    'Content-type: text/html; charset=UTF-8';
if (!mail($to, $subject, $message, $headers)) {
    echo json_encode(array(-1, getTextFromConst('ERROR_OCCURED_PLEASE_TRY_AGAIN')));
    exit();
}
echo json_encode(array(0, ''));
?>
