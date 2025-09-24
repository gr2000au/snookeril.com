<?php require_once(__DIR__  . '/confirm_alert.php'); ?>
<?php require_once(__DIR__  . '/alert_of_modal.php'); ?>
<img src="images/loading.gif" class="downloading-image" id="downloading-image" />
<img src="images/loading.gif" class="downloading-image-of-modal" id="downloading-image-of-modal" />
<?php if (Util::$post_from != 'app' || Util::$include_user) : ?>
    <div class="container-fluid header">
        <div class="container wrapper<?php if ($user_obj->getUserName() == '' && !isset($no_sign_in)) { echo ' not-logged-in'; } ?>">
            <div class="logo pull-right">
                <a href="index.php<?php addParams(true); ?>"><img src="images/logo2-output-onlinejpgtools.png" alt=""></a>
            </div>
            <?php if (!Util::$include_user) : ?>
                <div class="language-div <?php if ($user_obj->getUserName() != '') { echo ' logged-in'; } ?>">
                    <select class="language">
                        <?php foreach (Util::$lang_arr as $lang_key=>$lang_value) : ?>
                            <option value="<?php echo $lang_key; ?>"<?php if ($lang == $lang_key) { echo ' selected'; } ?>><?php echo $lang_value; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            <?php endif; ?>
            <div class="clock" id="clock"></div>
            <div class="welcome<?php if ($user_obj->getUserName() != '') { echo ' logged-in'; } ?>">
                <div class="user-name"><?php echo getTextFromConst('WELCOME'); ?><?php if ($user_obj->getUserName() != '') { echo ' ' . $user_obj->getFullName(); } ?></div>
                <?php if ($user_obj->getUserName() != '') : ?>
                    <a class="btn-exit" title="<?php echo getTextFromConst('OUT_OF_SYSTEM'); ?>"><?php echo getTextFromConst('LOGOUT'); ?></a>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php if ($user_obj->getUserName() == '' && !isset($no_sign_in)) : ?>
        <div class="container-fluid">
            <div class="container login">
                <div class="sign-in-sign-up">
                    <div class="sign-in">
                        <div class="in-or-up">
                            <a class="in-or-up-link up"><?php echo getTextFromConst('SIGN_UP'); ?></a>
                            <span>|</span>
                            <a class="in-or-up-link forgot"><?php echo getTextFromConst('FORGOT_PASSWORD'); ?></a>
                            <span>|</span>
                            <a class="in-or-up-link activation-link"><?php echo getTextFromConst('ACTIVATE_ACCOUNT'); ?></a>
                        </div>
                        <div class="sign-inputs">
                            <input class="input-clear" type="text" value="" name="user_name" id="user-name" placeholder="<?php echo getTextFromConst('USERNAME_OR_EMAIL'); ?>" />
                            <input class="input-clear" type="password" value="" name="password" id="password" placeholder="<?php echo getTextFromConst('PASSWORD'); ?>" />
                            <a class="btn btn-sign-in input-clear"><?php echo getTextFromConst('SIGN_IN_BUTTON'); ?></a>
                        </div>
                    </div>
                    <div class="sign-up">
                        <div class="in-or-up">
                            <a class="in-or-up-link in"><?php echo getTextFromConst('SIGN_IN'); ?></a>
                            <span>|</span>
                            <a class="in-or-up-link forgot"><?php echo getTextFromConst('FORGOT_PASSWORD'); ?></a>
                            <span>|</span>
                            <a class="in-or-up-link activation-link"><?php echo getTextFromConst('ACTIVATE_ACCOUNT'); ?></a>
                        </div>
                        <div class="sign-inputs">
                            <input class="input-clear" type="text" value="" name="user_name_sign" id="user-name-sign" placeholder="<?php echo getTextFromConst('USERNAME'); ?>" />
                            <input type="text" value="" name="email_sign" id="email-sign" placeholder="<?php echo getTextFromConst('EMAIL'); ?>" />
                            <input class="input-clear" type="password" value="" name="password_sign" id="password-sign" placeholder="<?php echo getTextFromConst('PASSWORD'); ?>" />
                            <input type="password" value="" name="password_sign_retype" id="password-sign-retype" placeholder="<?php echo getTextFromConst('RETYPE_PASSWORD'); ?>" />
                            <input class="input-clear" type="text" value="" name="full_nane_sign" id="full-nane-sign" placeholder="<?php echo getTextFromConst('FULLNAME'); ?>" />
                            <a class="btn btn-sign-up"><?php echo getTextFromConst('SIGN_UP_BUTTON'); ?></a>
                        </div>
                    </div>
                    <div class="forgot-password">
                        <div class="in-or-up">
                            <a class="in-or-up-link in"><?php echo getTextFromConst('SIGN_IN'); ?></a>
                            <span>|</span>
                            <a class="in-or-up-link up"><?php echo getTextFromConst('SIGN_UP'); ?></a>
                            <span>|</span>
                            <a class="in-or-up-link activation-link"><?php echo getTextFromConst('ACTIVATE_ACCOUNT'); ?></a>
                        </div>
                        <div class="sign-inputs">
                            <input class="input-clear" type="text" value="" name="user_name_forgot" id="user-name-forgot" placeholder="<?php echo getTextFromConst('USERNAME_OR_EMAIL'); ?>" />
                            <a class="btn btn-forgot-password input-clear"><?php echo getTextFromConst('FORGOT_PASSWORD_BUTTON'); ?></a>
                        </div>
                    </div>
                    <div class="send-activation-link">
                        <div class="in-or-up">
                            <a class="in-or-up-link in"><?php echo getTextFromConst('SIGN_IN'); ?></a>
                            <span>|</span>
                            <a class="in-or-up-link up"><?php echo getTextFromConst('SIGN_UP'); ?></a>
                            <span>|</span>
                            <a class="in-or-up-link forgot"><?php echo getTextFromConst('FORGOT_PASSWORD'); ?></a>
                        </div>
                        <div class="sign-inputs">
                            <input class="input-clear" type="text" value="" name="user_name_activation" id="user-name-activation" placeholder="<?php echo getTextFromConst('USERNAME_OR_EMAIL'); ?>" />
                            <a class="btn btn-send-activation-link input-clear"><?php echo getTextFromConst('SEND_ACTIVATION_LINK'); ?></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>
<?php endif; ?>
