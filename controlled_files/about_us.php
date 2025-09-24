<?php
$site_title = $site_title . (strlen(constant('LangGeneralConstants::ABOUT_SITE_TITLE')) ? ' | ' . constant('LangGeneralConstants::ABOUT_SITE_TITLE') : '');
//$meta_description = constant('LangGeneralConstants::ABOUT_META_DESCRIPTION');
require_once(__DIR__  . '/../include_files/start_html.php');
?>
<div class="container-fluid">
    <div class="container main-container">
        <h2 class="main-title about-title"><?php echo $execute_file_obj->{'title_' . LangGeneralConstants::FONTS_LANGUAGE}; ?></h2>
        <div class="row">
            <div class="uri-main col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div class="content-of-page about-content">
                    <?php echo $execute_file_obj->{'content_' . LangGeneralConstants::FONTS_LANGUAGE}; ?>
                </div>
                <h4 class="about-form"><?php echo getTextFromConst('ANY_QUESTION_MAY_CONTACT_AND_WE_WILL_ANSWER_SHORTLY'); ?></h4>
                <div class="about-inputs">
                    <input class="input-clear" type="text" value="" name="name_about" id="name-about" placeholder="<?php echo getTextFromConst('FULLNAME'); ?>" />
                    <input class="input-clear" type="text" value="" name="email_about" id="email-about" placeholder="<?php echo getTextFromConst('EMAIL'); ?>" />
                    <textarea class="input-clear" name="content_about" id="content-about" placeholder="<?php echo getTextFromConst('DESCRIPTION_OF_CONTACT'); ?>"></textarea>
                    <a class="btn btn-send-about input-clear"><?php echo getTextFromConst('SEND'); ?></a>
                </div>
            </div>
        </div>
    </div>
</div>
<?php require_once(__DIR__  . '/../include_files/end_html.php'); ?>
