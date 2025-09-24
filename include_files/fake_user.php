<?php
if ($user_obj->getUserName() == '' && defined('FAKE_USER') && FAKE_USER != '') {
    $user_obj->setUserName(FAKE_USER);
    $user_obj->setEmail('gr2000au@gmail.com');
    $user_obj->setFullName('גדעון');
    $user_obj->setTeamAName('קבוצה א');
    $user_obj->setTeamBName('קבוצה ב');
}
?>
