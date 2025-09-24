<?php
require_once('include_files/init.php');
$token = '';
$user_name = '';
$action = '';
$password = '';
$password_retype = '';
$error = '';
if (isset($_POST['action'])) {
    $action = trim($_POST['action']);
}
if ($action != 'update') {
    if (isset($_GET['token'])) {
        $token = trim($_GET['token']);
    }
    if (isset($_GET['email'])) {
        $user_name = trim($_GET['email']);
    }
}
else {
    $user_record = new stdClass();
    if (isset($_POST['token'])) {
        $token = trim($_POST['token']);
    }
    if (isset($_POST['email'])) {
        $user_name = trim($_POST['email']);
    }
    if (isset($_POST['password_change'])) {
        $password = trim($_POST['password_change']);
    }
    if (isset($_POST['password_change_retype'])) {
        $password_retype = trim($_POST['password_change_retype']);
    }
    if ($password == '') {
        $error = getTextFromConst('PLEASE_FILL_PASSWORD');
    }
    elseif ($password != $password_retype) {
        $error = getTextFromConst('NEED_TO_FILL_SAME_PASSWORD_TWICE');
    }
    elseif (strpos($password, ' ') !== false) {
        $error = getTextFromConst('PASSWORD_NUST_NOT_CONTAIN_SPACES');
    }
    elseif (strlen($password) < 6 || strlen($password) > 12) {
        $error = getTextFromConst('PASSWORD_BETWEEN') . ' 6 ' . getTextFromConst('AND_BETWEEN') . ' 12 ' . getTextFromConst('CHARACTERS');
    }
    else {
        $user_record = getUser($user_name);
    }
}
$reset_record = getResetUser($token, $user_name);
$expDate = '';
if ($reset_record) {
    $expDate = $reset_record['exp_date'];
}
$db_link = Database::getConnection();
$curDate = date("Y-m-d H:i:s");
if ($action == 'update' && !empty($user_record) && $expDate >= $curDate) {
    $db_link->begin_transaction();
    $stmt = $db_link->prepare("
                                update users
                                set password = ?
                                where email = ?
                              ");
    $stmt->bind_param('ss', $password, $user_name);
    $stmt->execute();
    if ($stmt->error) {
        $error = getTextFromConst('ERROR_OCCURED_PLEASE_TRY_AGAIN');
        $stmt->close();
        $db_link->rollback();
    }
    $stmt = $db_link->prepare("
                                delete from reset_users
                                where user_name = ?
                            ");
    $stmt->bind_param('s', $user_name);
    $stmt->execute();
    if ($stmt->error) {
        $error = getTextFromConst('ERROR_OCCURED_PLEASE_TRY_AGAIN');
        $stmt->close();
        $db_link->rollback();
    }
    $stmt->close();
    $db_link->commit();
}
$site_title = $site_title . (strlen(constant('LangGeneralConstants::RESET_PASSWORD_SITE_TITLE')) ? ' | ' . constant('LangGeneralConstants::RESET_PASSWORD_SITE_TITLE') : '');
//$meta_description = constant('LangGeneralConstants::RESET_PASSWORD_META_DESCRIPTION');
require_once('include_files/start_html.php');
$no_sign_in = true;
?>
<div class="container-fluid">
    <div class="container main-container">
        <h2 class="main-title reset-password-title"><?php echo getTextFromConst('RESET_PASSWORD'); ?></h2>
        <div class="row">
            <div class="reset-password col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <?php if (!$reset_record) : ?>
                    <h4 class="sub-title reset-password-error"><?php echo getTextFromConst('ERROR_LINK_TO_RESET_PASSWORD_WRONG'); ?></h4>
                <?php elseif ($expDate < $curDate) : ?>
                    <h4 class="sub-title reset-password-error"><?php echo getTextFromConst('LINK_TO_RESET_PASSWORD_EXPIRED'); ?></h4>
                <?php else : ?>
                    <?php if ($action != 'update') : ?>
                        <form class="" action="reset_password.php" method="post" onsubmit="return checkReset();" name="reset_password">
                            <input type="password" value="" name="password_change" id="password_change" placeholder="<?php echo getTextFromConst('PASSWORD'); ?>" />
                            <input type="password" value="" name="password_change_retype" id="password_change_retype" placeholder="<?php echo getTextFromConst('RETYPE_PASSWORD'); ?>" />
                            <button class="btn btn-change-password" type="submit"><?php echo getTextFromConst('SEND'); ?></button>
                            <input type="hidden" name="action" value="update" />
                            <input type="hidden" name="email" value="<?php echo $user_name;?>" />
                            <input type="hidden" name="token" value="<?php echo $token; ?>" />
                        </form>
                    <?php else : ?>
                        <form class="" action="" method="post" onsubmit="return checkReset();" name="reset_password">
                            <?php if ($error != '') : ?>
                                <h4 class="sub-title reset-password-error"><?php echo $error; ?></h4>
                                <input type="password" value="<?php echo $password;?>" name="password_change" id="password_change" placeholder="<?php echo getTextFromConst('PASSWORD'); ?>" />
                                <input type="password" value="<?php echo $password_retype;?>" name="password_change_retype" id="password_change_retype" placeholder="<?php echo getTextFromConst('RETYPE_PASSWORD'); ?>" />
                                <button class="btn btn-change-password" type="submit"><?php echo getTextFromConst('SEND'); ?></button>
                                <input type="hidden" name="action" value="update" />
                                <input type="hidden" name="email" value="<?php echo $user_name;?>" />
                                <input type="hidden" name="token" value="<?php echo $token; ?>" />
                            <?php else : ?>
                                <h4 class="sub-title reset-password-error"><?php echo getTextFromConst('YOUR_PASSWORD_CHANGED_SUCCESSFULLY'); ?></h4>
                            <?php endif; ?>
                        </form>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
<?php require_once('include_files/end_html.php'); ?>
