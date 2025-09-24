<?php
function getTextFromConst($text) {
    if (defined('LangMoreConstants::' . $text)) {
        return constant('LangMoreConstants::' . $text);
    }
    return $text;
}

function getTextFromConstClass($text) {
    global $lang_class;
    if (defined($lang_class . '_LangMoreConstants::' . $text)) {
        return constant(str_replace('-', '_', $lang_class) . '_LangMoreConstants::' . $text);
    }
    return $text;
}

function getValFromVar($text) {
    if (defined('LangGeneralConstants::' . $text)) {
        return constant('LangGeneralConstants::' . $text);
    }
    return $text;
}

function getUser($user_name) {
    $db_link = Database::getConnection();
    $stmt = $db_link->prepare("
                                select *
                                from users u
                                where u.user_name = ?
                                or u.email = ?
                              ");
    $stmt->bind_param('ss', $user_name, $user_name);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_object();
    if ($row) {
        return User::fill($row);
    }
    return false;
}

function getPlayers($user_name) {
    $db_link = Database::getConnection();
    $players = array();
    $query = '
                select p.name, bp.player_id, p.team_id, bp.background_color, p.name_src, bp.color
                from base_players bp
                left join players p
                on (p.player_id = bp.player_id and p.user_name = \'' . $user_name . '\')
                order by p.team_id, p.player_id
            ';
    $result = mysqli_query($db_link, $query);
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $players[$row['player_id']]['name'] = $row['name'];
            $players[$row['player_id']]['background-color'] = $row['background_color'];
            $players[$row['player_id']]['color'] = $row['color'];
            $players[$row['player_id']]['team-key'] = $row['team_id'];
            $players[$row['player_id']]['name-src'] = $row['name_src'];
        }
    }
    return $players;
}

function getResetUser($token, $user_name) {
    $db_link = Database::getConnection();
    $stmt = $db_link->prepare("
                                select *
                                from reset_users ru
                                where ru.user_name = ?
                                and ru.token = ?
                              ");
    $stmt->bind_param('ss', $user_name, $token);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if (!$row) {
        return false;
    }
    return $row;
}

function getUserAgent() {
    $is_mobile = false;
    $is_chrome = false;
    $is_ios = false;
    $is_firefox = false;
    $is_android = false;
    $is_windows = false;
    $is_safari = false;
    if (!empty($_SERVER['HTTP_USER_AGENT'])) {
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        $user_agent_arr = explode(' ', $user_agent);
//        Util::makePre($user_agent_arr);
        if (stripos($user_agent, 'mobile') !== false) {
            $is_mobile = true;
        }
        if (stripos($user_agent, 'chrome') !== false || stripos($user_agent, 'CriOS') !== false) {
            $is_chrome = true;
        }
        if (stripos($user_agent, 'iPhone') !== false || stripos($user_agent, 'iPod') !== false || stripos($user_agent, 'iPad') !== false) {
            $is_ios = true;
        }
        if (stripos($user_agent, 'firefox') !== false || stripos($user_agent, 'FxiOS') !== false) {
            $is_firefox = true;
        }
        if (stripos($user_agent, 'android') !== false) {
            $is_android = true;
        }
        if (stripos($user_agent, 'windows') !== false) {
            $is_windows = true;
        }
        if (stripos($user_agent, 'safari') !== false && stripos($user_agent, 'android') === false && stripos($user_agent, 'chrome') === false && stripos($user_agent, 'CriOS') === false && stripos($user_agent, 'snapchat') === false && stripos($user_agent, 'linux') === false) {
            $is_safari = true;
        }
    }
    return new UserAgent($is_mobile, $is_chrome, $is_ios, $is_firefox, $is_android, $is_windows, $is_safari);
}

function getRemoteAddress() {
    $ip = '';
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    }
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    elseif (!empty($_SERVER["REMOTE_ADDR"])) {
        $ip = $_SERVER["REMOTE_ADDR"];
    }
    elseif (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        $ip = $_SERVER['HTTP_X_REAL_IP'];
    }
    return $ip;
}

function getCountry($ip) {
    if (!preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\z/', $ip) || $ip == '127.0.0.1') {
        return null;
    }
    return $ip_dat = json_decode(file_get_contents('http://www.geoplugin.net/json.gp?ip=' . $ip));
}

function getExecuteFile($uri) {
    $db_link = Database::getConnection();
    $stmt = $db_link->prepare("
                                select *
                                from uris u
                                where u.uri = ?
                              ");
    $stmt->bind_param('s', $uri);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_object();
    if ($row) {
        return $row;
    }
    return '';
}

function getContentOfSubject($subject) {
    $db_link = Database::getConnection();
    $stmt = $db_link->prepare("
                                select *
                                from miscellaneous m
                                where m.subject = ?
                              ");
    $stmt->bind_param('s', $subject);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_object();
    if ($row) {
        return $row;
    }
    $obj = new stsClass();
    $obj->id = '';
    $obj->content_he = '';
    $obj->content_en = '';
    $obj->title_he = '';
    $obj->title_en = '';
    $obj->subject = '';
    return $obj;
}

function writeToActionLog($data, $type_of_print, $file) {
    return;
    ob_start();
    if (file_exists($file)) {
        echo "\r\n";
        if ($type_of_print == 1) {
            echo "\r\n";
        }
    }
    echo date('d-M-Y H:i:s e') . "\r\n";
    if ($type_of_print == 1) {
        echo $data;
    }
    if ($type_of_print == 2) {
        print_r($data);
    }
    $log_data = ob_get_contents();
    ob_end_clean();
    file_put_contents($file, $log_data, FILE_APPEND);
}

function addParams($add_question_mark) {
    if ($add_question_mark) {
        $prefix = '?';
    }
    else {
        $prefix = '&';
    }
    $str = '';
    if (Util::$special_entrance_for_vip != '') {
        $str = $str . $prefix . 'special_entrance_for_vip=' . Util::$special_entrance_for_vip;
        $prefix = '&';
    }
    if (Util::$post_from != '') {
        $str = $str . $prefix . 'postfrom=' . Util::$post_from;
        $prefix = '&';
    }
    if (Util::$include_user != '') {
        $str = $str . $prefix . 'include_user=' . Util::$include_user;
    }
    echo $str;
}
?>
