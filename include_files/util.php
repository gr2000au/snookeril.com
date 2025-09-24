<?php

class Util {

    public static $today;
    public static $server_directory;
    public static $ip;
    public static $lang_arr;
    public static $special_entrance_for_vip;
    public static $post_from;
    public static $include_user;
//    public static $lang;
//    public static $players_from_app_str;
//    public static $teams_from_app_str;
//    public static $num_of_reds_from_app;

    public static function getArray($obj) {
        if (is_array($obj)) {
            return $obj;
        } else if (is_object($obj)) {
            return array($obj);
        } else {
            return null;
        }
    }

    public static function makePre($varToShow, $title = '') {
        echo '<pre>';
        if ($title != '') {
            echo '<p>' . $title . '</p>';
        }
        print_r($varToShow);
        echo '</pre>';
    }
}
