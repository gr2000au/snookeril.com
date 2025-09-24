<?php
//$request_uri = $_SERVER['REQUEST_URI'];
//if (strpos($request_uri, '7bd6545aff5d34718ee51f8062a86bc23e') !== false) {
//    $new_uri = str_replace('/7bd6545aff5d34718ee51f8062a86bc23e', '', $request_uri);
//    header("Location: " . $new_uri);
//    exit();
//}
ini_set('display_errors', 1);
require_once(__DIR__  . '/util.php');
Util::$post_from = '';
if (isset($_GET['postfrom'])) {
    Util::$post_from = $_GET['postfrom'];
}
Util::$include_user = false;
if (isset($_GET['include_user'])) {
    Util::$include_user = $_GET['include_user'];
}
if (empty($from_ajax) && empty($from_controller)) {
    ini_set('session.gc_maxlifetime', 25600);
}
if (empty($from_controller)) {
    session_start();
}
require_once(__DIR__  . '/constant.php');
if (empty($from_ajax)) {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}
//Util::makePre($_GET);
require_once(__DIR__  . '/../models/User.php');
require_once(__DIR__  . '/../models/UserAgent.php');
require_once(__DIR__  . '/../models/Database.php');
require_once(__DIR__  . '/functions.php');
$document_root = $_SERVER['DOCUMENT_ROOT'];
$document_root_arr = explode('/', $document_root);
$document_root_last = $document_root_arr[count($document_root_arr) - 1];
Util::$server_directory = 'servers_directory/' . $document_root_last . '/';
require_once(__DIR__  . '/../' . Util::$server_directory . 'configuration.php');
error_reporting(E_ALL);
if (empty($from_ajax)) {
    ini_set('display_errors', defined('DISPLAY_ERRORS') ? DISPLAY_ERRORS : 0);
}
else {
    ini_set('display_errors', 0);
}
ini_set('display_errors', 1);
ini_set('error_log', __DIR__  . '/../' . Util::$server_directory . 'log/php_error_log');
$user_agent = getUserAgent();
//Util::makePre($user_agent, 'user_agent');
//$_SESSION['logged_in']['user'] = 'gr2000au';
//$_SESSION['logged_in']['logged_in_last_used'] = time();
//Util::makePre($_SESSION['logged_in'], 'SESSION[\'logged_in\']');
$logged_in = (isset($_SESSION['logged_in']['user']) && trim($_SESSION['logged_in']['user']) != '') ? $_SESSION['logged_in']['user'] : false;
//$logged_in = 'gr2000au';
if ($logged_in) {
//    $logged_in_last_used = isset($_SESSION['logged_in']['logged_in_last_used']) ? $_SESSION['logged_in']['logged_in_last_used'] : '';
//    if ($logged_in_last_used != '' && time() - $logged_in_last_used <= 30000) {
    $user_obj = getUser($logged_in);
    if ($user_obj) {
        $_SESSION['logged_in']['logged_in_last_used'] = time();
    }
    else {
        unset($_SESSION['logged_in']);
        $user_obj = new User();
    }
}
else {
    unset($_SESSION['logged_in']);
    $user_obj = new User();
}
if (Util::$post_from == 'app' && !Util::$include_user) {
    $user_obj = new User();
}
require_once(__DIR__  . '/fake_user.php');
//Util::makePre($user_obj, 'user_obj');
Util::$today = date('Ymd');
Util::$ip = getRemoteAddress();
//Util::$ip = '85.65.38.137';
//$ip_dat = getCountry(Util::$ip);
$country_code = '';
if (!empty($ip_dat) && strlen(trim($ip_dat->geoplugin_countryCode)) == 2) {
    $country_code = trim($ip_dat->geoplugin_countryCode);
}
$lang_from_app_to_php['he'] = 'he-IL';
$lang_from_app_to_php['en'] = 'en-US';
$lang_from_app_to_php['iw'] = 'he-IL';
$lang = '';
if (Util::$post_from == 'app' && isset($_GET['lang'])) {
    $lang_from_app = $_GET['lang'];
    if (isset($lang_from_app_to_php[$lang_from_app])) {
        $lang_from_app = $lang_from_app_to_php[$lang_from_app];
        if (file_exists(__DIR__  . '/../language/' . $lang_from_app) && is_dir(__DIR__  . '/../language/' . $lang_from_app)) {
            $lang = $lang_from_app;
        }
    }
}
if ($lang == '') {
    if (isset($_SESSION['lang']) && trim($_SESSION['lang']) != '' && file_exists(__DIR__ . '/../language/' . $_SESSION['lang']) && is_dir(__DIR__ . '/../language/' . $_SESSION['lang'])) {
        $lang = $_SESSION['lang'];
    }
    if ($lang == '' && $country_code != '') {
        if ($country_code == 'IL') {
            $lang = 'he-IL';
            $_SESSION['lang'] = $lang;
        }
//    elseif ($country_code == 'GB') {
//        $lang = 'en-GB';
//        $_SESSION['lang'] = $lang;
//    }
        else {
            $lang = 'en-US';
            $_SESSION['lang'] = $lang;
        }
    }
    if ($lang == '') {
        $lang = 'he-IL';
        $_SESSION['lang'] = $lang;
    }
}
else {
    $_SESSION['lang'] = $lang;
}
$lang_class = str_replace('-', '_', $lang);
require_once(__DIR__  . '/../language/' . $lang . '/constants.php');
require_once(__DIR__  . '/../language/he_IL_constants.php');
require_once(__DIR__  . '/../language/en_US_constants.php');
$reflector_general = new ReflectionClass('LangMoreConstants');
$he_IL_reflector_general = new ReflectionClass('he_IL_LangMoreConstants');
$en_US_reflector_general = new ReflectionClass('en_US_LangMoreConstants');
$lang_constants_general = $reflector_general->getConstants();
$he_IL_constants_general = $he_IL_reflector_general->getConstants();
$en_US_constants_general = $en_US_reflector_general->getConstants();
$reflector_more = new ReflectionClass('LangMoreConstants');
$he_IL_reflector_more = new ReflectionClass('he_IL_LangMoreConstants');
$en_US_reflector_more = new ReflectionClass('en_US_LangMoreConstants');
$lang_constants_more = $reflector_more->getConstants();
$he_IL_constants_more = $he_IL_reflector_more->getConstants();
$en_US_constants_more = $en_US_reflector_more->getConstants();
//Util::makePre($lang_constants);
Util::$lang_arr = array(
    'he-IL'     =>  'he'
    , 'en-US'   =>  'en'
//    , 'en-GB'   =>  'en-GB'
);
if ($user_obj->getNumOfReds() == 0) {
    $user_obj->setNumOfReds(10);
}
if ($user_obj->getTeamAName() == '') {
    $user_obj->setTeamAName(getTextFromConst('TEAM_A_NAME'));
}
if ($user_obj->getTeamBName() == '') {
    $user_obj->setTeamBName(getTextFromConst('TEAM_B_NAME'));
}
$css_ltr_time = filemtime(__DIR__  . '/../css/style_ltr.css');
$css_time = filemtime(__DIR__  . '/../css/style.css');
$js_time = filemtime(__DIR__  . '/../js/script.js');
$site_title = constant('LangGeneralConstants::SITE_TITLE');
$meta_description = '';
//Util::makePre(get_defined_constants(), '');
Util::$special_entrance_for_vip = '';
if (isset($_GET['special_entrance_for_vip'])) {
    Util::$special_entrance_for_vip = $_GET['special_entrance_for_vip'];
}
if (Util::$post_from != 'app') {
    if (Util::$special_entrance_for_vip != 'kombinot' && empty($from_ajax)) {
//        include('include_files/website_under_constructions.php');
        exit();
    }
}
if (!empty($ip_dat)) {
    writeToActionLog($ip_dat, 2, Util::$server_directory . 'log/geo_details_' . Util::$today . '.txt');
    $last_visited = isset($_SESSION['last_visited']) ? $_SESSION['last_visited'] : '';
    if (($last_visited == '' || (time() - $last_visited > 350))
        && Util::$ip != '85.65.38.137'
        && $ip_dat && $ip_dat->geoplugin_city == 'Holon'
        && (!defined('DO_NOT_NOTIFY_VISITED') || !constant('DO_NOT_NOTIFY_VISITED'))
    ) {
        $to = NOTIFICATION_EMAIL;
        $subject = 'כניסה לאתר-' . Util::$ip . (!empty($ip_dat) ? ', ' . $ip_dat->geoplugin_countryName . ', ' . $ip_dat->geoplugin_city : '');
        $message = '<a href="https://whatismyipaddress.com/ip/' . Util::$ip . '">Click here</a>';
        $headers = 'From: ' . EMAIL_SENDER . "\r\n" .
            'Reply-To: ' . EMAIL_REPLY_TO . "\r\n" .
            'X-Mailer: PHP/' . phpversion() . "\r\n" .
            'MIME-Version: 1.0' . "\r\n" .
            'Content-type: text/html; charset=UTF-8';
        mail($to, $subject, $message, $headers);
        $_SESSION['last_visited'] = time();
    }
}
?>
