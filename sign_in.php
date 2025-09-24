<?php
$from_ajax = true;
require_once('include_files/init.php');
$db_link = Database::getConnection();
if ($db_link->connect_error) {
    echo json_encode(array(-1, getTextFromConst('CANNOT_CONNECT_TO_DB')));
    exit();
}
$user_name = '';
$password = '';
if (isset($_POST['user_name'])) {
    $user_name = trim($_POST['user_name']);
}
if (isset($_POST['password'])) {
    $password = trim($_POST['password']);
}
if ($user_name == '') {
    echo json_encode(array(-1, getTextFromConst('PLEASE_FILL_USERNAME')));
    exit();
}
if ($password == '') {
    echo json_encode(array(-1, getTextFromConst('PLEASE_FILL_PASSWORD')));
    exit();
}
$stmt = $db_link->prepare("
                            select *
                            from users u
                            where (u.user_name = ?
                            or u.email = ?)
                            and u.password = ?
                        ");
$stmt->bind_param('sss', $user_name, $user_name, $password);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
if (!$row) {
    echo json_encode(array(-1, getTextFromConst('USERNAME_OR_PASSWORD_WRONG')));
    exit();
}
if ($row['activated'] != 1) {
    echo json_encode(array(-1, getTextFromConst('PLEASE_ACTIVATE_ACCOUNT_FIRST')));
    exit();
}
$_SESSION['logged_in']['user'] = $row['user_name'];
$_SESSION['logged_in']['logged_in_last_used'] = time();
writeToActionLog('user name ' . $user_name . ' signed in from ip ' . Util::$ip, 1, Util::$server_directory . 'log/actions_log_' . Util::$today . '.txt');
if (!defined('DO_NOT_NOTIFY_VISITED') || !constant('DO_NOT_NOTIFY_VISITED') && Util::$ip != '85.65.38.137') {
    $to = NOTIFICATION_EMAIL;
    $subject = 'כניסה למערכת-' . Util::$ip . ', ' . (!empty($ip_dat) ? $ip_dat->geoplugin_countryName : '');
    $message = '<a href="https://whatismyipaddress.com/ip/' . Util::$ip . '">Click here</a>';
    $headers = 'From: ' . EMAIL_SENDER . "\r\n" .
        'Reply-To: ' . EMAIL_REPLY_TO . "\r\n" .
        'X-Mailer: PHP/' . phpversion() . "\r\n" .
        'MIME-Version: 1.0' . "\r\n" .
        'Content-type: text/html; charset=UTF-8';
    mail($to, $subject, $message, $headers);
}
echo json_encode(array(0, ''));
?>
