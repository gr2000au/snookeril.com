<?php
//use PHPMailer\PHPMailer\PHPMailer;
//use PHPMailer\PHPMailer\Exception;
//require 'PHPMailer/src/Exception.php';
//require 'PHPMailer/src/PHPMailer.php';
//require 'PHPMailer/src/SMTP.php';
//$mail = new PHPMailer();
//$mail->setFrom('mail@snookerim.com', 'Snookerim');
//$mail->addAddress('gr2000au@gmail.com', 'Emperor');
//$mail->Subject = 'רישום לאתר סנוקרים';
//$mail->Body = 'הרשמה בוצעה בהצלחה';
//if (!$mail->send())
//{
//    /* PHPMailer error. */
//    echo $mail->ErrorInfo;
//}
$to      = 'gr2000au@gmail.com';
$subject = 'test';
$message = '<div>test</div><img src="https://snookerim.com/get_mail.php?receipient=' . $to . '" style="display: none;" />';
$headers = 'From: snookerim<mail@snookerim.com>' . "\r\n" .
    'Reply-To: noreply@snookerim.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion() . "\r\n" .
    'MIME-Version: 1.0' . "\r\n" .
    'Content-type: text/html; charset=UTF-8';
if (!mail($to, $subject, $message, $headers)) {
    echo 'failed';
}
?>
