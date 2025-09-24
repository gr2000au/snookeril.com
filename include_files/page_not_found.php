<?php
$site_title = $site_title . ' | ' . constant('LangGeneralConstants::PAGE_NOT_FOUND_SITE_TITLE');
require_once(__DIR__  . '/start_html.php');
?>
<div class="container-fluid">
    <div class="container main-container">
        <h2 class="main-title page-not-found-title"><?php echo getTextFromConst('PAGE_NOT_FOUND'); ?></h2>
    </div>
</div>
<?php require_once(__DIR__  . '/end_html.php'); ?>
