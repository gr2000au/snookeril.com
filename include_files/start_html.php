<!DOCTYPE html>
<html>
<head>
    <title><?php echo $site_title; ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta charset="UTF-8">
    <meta name="description" content="<?php echo $meta_description; ?>">
    <meta name="robots" content="noindex, nofollow" />
    <link rel="shortcut icon" type="image/png" href="images/favicon.png" />
    <link rel="stylesheet" href="bootstrap-4.1.3-dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="css/jquery-ui.css" />
    <link rel="stylesheet" href="font-awesome-4.7.0/css/font-awesome.min.css" />
    <link rel="stylesheet" href="css/style.css?ver=<?php echo $css_time; ?>" />
    <?php if (constant('LangGeneralConstants::DIRECTION') == 'ltr') : ?>
        <link rel="stylesheet" href="css/style_ltr.css?ver=<?php echo $css_ltr_time; ?>" />
    <?php endif; ?>
    <script type="text/javascript" src="js/jquery-3.4.1.min.js"></script>
    <script src="bootstrap-4.1.3-dist/js/bootstrap.min.js" type="text/javascript"></script>
    <script src="js/jquery-ui.js" type="text/javascript"></script>
    <script type="text/javascript" src="js/NoSleep.min.js"></script>
    <script type="text/javascript" src="js/script.js?ver=<?php echo $js_time; ?>"></script>
    <?php require_once(__DIR__  . '/lang_constants_to_js.php'); ?>
    <script>
        var lang = '<?php echo $lang; ?>';
        var prev_lang = '';
        var session_id = '<?php echo session_id(); ?>';
        var user_name_logged = '<?php echo $user_obj->getUserName(); ?>';
        var modal_is_open = false;
        var wakeLockEnabled = false;
        var alert_answer = false;
        var alert_interval = '';
    </script>
</head>
<body class="<?php echo constant($lang_class . '_LangGeneralConstants::DIRECTION') != '' ? constant($lang_class . '_LangGeneralConstants::DIRECTION') . ' ' : ''; ?><?php echo constant($lang_class . '_LangGeneralConstants::FONTS_LANGUAGE'); ?><?php if ($user_agent->getIsMobile()) { echo ' mobile'; } ?><?php if ($user_agent->getIsChrome()) { echo ' chrome'; } ?><?php if ($user_agent->getIsIos()) { echo ' ios'; } ?><?php if ($user_agent->getIsFirefox()) { echo ' firefox'; } ?><?php if ($user_agent->getIsAndroid()) { echo ' android'; } ?><?php if ($user_agent->getIsWindows()) { echo ' windows'; } ?><?php if ($user_agent->getIsSafari()) { echo ' safari'; } ?>">
<?php require_once(__DIR__  . '/header.php'); ?>
<audio id="after" onended="playPlayerSound()" class="audio-after">
    <source id="player-name-audio-source" src="audio/next.mp3" />
</audio>
<?php for ($number = 1; $number <= 154; $number++) : ?>
    <audio id="score-<?php echo $number; ?>" class="audio-score">
        <source id="score-audio-source-<?php echo $number; ?>" src="audio/number_<?php echo $number; ?>.mp3" />
    </audio>
<?php endfor; ?>
