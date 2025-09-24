<?php
session_start();
require_once('include_files/util.php');
//$user_name = '';
//if (isset($_POST['user_name'])) {
//    $user_name = $_POST['user_name'];
//}
//if (isset($_SESSION['logged_in']['user']) && $user_name == $_SESSION['logged_in']['user']) {
    unset($_SESSION['logged_in']);
//}
?>
