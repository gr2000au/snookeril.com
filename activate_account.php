<?php
require_once('include_files/init.php');
$user_name = '';
$email = '';
$error = '';
if (isset($_GET['username'])) {
    $user_name = $_GET['username'];
}
if (isset($_GET['email'])) {
    $email = $_GET['email'];
}
$db_link = Database::getConnection();
$stmt = $db_link->prepare("
                            select *
                            from users u
                            where u.user_name = ?
                            and u.email = ?
                        ");
$stmt->bind_param('ss', $user_name, $email);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
if (!$row) {
    $error = getTextFromConst('USER_NOT_FOUND');
}
if ($row['activated'] == 1) {
    $error = getTextFromConst('ACCOUNT_ALREADY_ACTIVATED');
}
else {
    $db_link->begin_transaction();
    $stmt = $db_link->prepare("
                                update users
                                set activated = 1
                                where user_name = ?
                                and email = ?
                              ");
    $stmt->bind_param('ss', $user_name, $email);
    $stmt->execute();
    if ($stmt->error) {
        $error = getTextFromConst('ERROR_OCCURED_PLEASE_TRY_AGAIN');
        $stmt->close();
        $db_link->rollback();
    }
    $stmt->close();
    $db_link->commit();
}
$site_title = $site_title . (strlen(constant('LangGeneralConstants::ACCOUNT_ACTIVATION_SITE_TITLE')) ? ' | ' . constant('LangGeneralConstants::ACCOUNT_ACTIVATION_SITE_TITLE') : '');
//$meta_description = constant('LangGeneralConstants::ACTIVATE_ACCOUNT_META_DESCRIPTION');
require_once('include_files/start_html.php');
?>
<div class="container-fluid">
    <div class="container main-container">
        <h2 class="main-title reset-password-title"><?php echo getTextFromConst('ACCOUNT_ACTIVATION'); ?></h2>
        <div class="row">
            <div class="reset-password col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <?php if ($error) : ?>
                    <h4 class="sub-title reset-password-error"><?php echo $error; ?></h4>
                <?php else : ?>
                    <h4 class="sub-title reset-password-error"><?php echo getTextFromConst('ACCOUNT_ACTIVATED_SUCCESSFULLY'); ?></h4>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
<?php require_once('include_files/end_html.php'); ?>
