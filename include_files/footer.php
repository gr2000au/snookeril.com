<div class="container-fluid footer">
    <div class="container wrapper<?php if ($user_obj->getUserName() == '' && !isset($no_sign_in)) { echo ' not-logged-in'; } ?>">
        <a id="screen-saver" class="btn-screen-saver screen-saver"><?php echo getTextFromConst('DISABLE_SCREEN_OFF'); ?></a>
<!--        <a href="about--><?php //addParams(true); ?><!--" class="btn-about about">--><?php //echo getTextFromConst('ABOUT'); ?><!--</a>-->
    </div>
</div>
