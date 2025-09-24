$(document).ready(function() {
    var noSleep = new NoSleep();
    $('.screen-saver').click(function() {
        if (!wakeLockEnabled) {
            noSleep.enable();
            wakeLockEnabled = true;
            $('.screen-saver').html(getTextFromVarClass('ENABLE_SCREEN_OFF'));
            $('.screen-saver').addClass('active');
            return;
        }
        noSleep.disable();
        wakeLockEnabled = false;
        $('.screen-saver').html(getTextFromVar('DISABLE_SCREEN_OFF'));
        $('.screen-saver').removeClass('active');
    });
    startTime();
    $('.datepicker').datepicker({
        autoSize: false,
        dateFormat: 'dd/mm/yy',
        nextText: '',
        prevText: ''
    });

    $('.fault').click(function() {
        if (!match.frame_on) {
            return;
        }
        if (!$('#current-player').hasClass('show')) {
            return;
        }
        if (match.fault) {
            $(this).removeClass('active');
            match.fault = false;
            updateBalls();
            updateLocalStorage();
            return;
        }
        $(this).addClass('active');
        match.fault = true;
        $('.remove-x').removeClass('active');
        match.all_balls_can_pot = false;
        $('.btn-ball.red').addClass('no-entry-fault');
        $('.btn-ball.yellow').addClass('no-entry-fault');
        $('.btn-ball.green').addClass('no-entry-fault');
        $('.btn-ball').each(function() {
            if (!$(this).hasClass('red')) {
                $(this).removeClass('no-entry-only-red');
            }
        });
        $('.btn-ball').each(function () {
            //if (!$(this).hasClass('red')) {
                $(this).removeClass('no-entry-last-six-colors');
            //}
        });
        updateLocalStorage();
    });

    $('.made-snooker').click(function() {
        if (!match.frame_on) {
            return;
        }
        if (!$('#current-player').hasClass('show')) {
            return;
        }
        var team_key = $('#current-player-circle').attr('data-team-key');
        var opposite_team_key = getOppositeTeamKey(team_key);
        var team_player_key = match.prev_team_player_arr[opposite_team_key];
        if (team_player_key != '') {
            var player_key = match.team_players_order_arr[opposite_team_key][team_player_key]['data-player-key'];
        }
        else {
            var player_key = '';
        }
        var current_player_key = $('#current-player-circle').attr('data-player-key');
        if (team_player_key == '' && match.add_score_arr['data-player-key'] == '') {
            return;
        }
        if (match.made_snooker) {
            $(this).removeClass('active');
            match.made_snooker = false;
            if (match.add_score_arr['data-player-key'] != current_player_key) {
                match.players[player_key]['snooker-made']--;
            }
            updateLocalStorage();
            return;
        }
        $(this).addClass('active');
        match.made_snooker = true;
        if (match.add_score_arr['data-player-key'] != current_player_key) {
            match.players[player_key]['snooker-made']++;
        }
        updateLocalStorage();
    });

    $('.num-of-reds-base').click(function() {
        $('.input-num-of-reds-base').val(parseInt($('.num-of-reds-base').html()));
        $('.alert-of-modal-backdrop').css('display', 'block');
        $('#define-teams .modal-content').append($('.alert-of-modal-backdrop'));
        $('.update-num-of-reds-base-div.of-modal').css('display', 'block');
        $('.input-num-of-reds-base').focus().select();
    });

    $('.update-frame-num-of-reds-base').click(function() {
        if ($('.input-num-of-reds-base').val() == '') {
            alert_answer = false;
            $('.update-num-of-reds-base-div.of-modal').css('display', 'none');
            makeModalAlert(getTextFromVar('MUST_FILL_NUMBER'), '$(\'.update-num-of-reds-base-div.of-modal\')', '#define-teams');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.input-num-of-reds-base\')'); }, 200);
            return;
        }
        if (isNaN($('.input-num-of-reds-base').val())) {
            alert_answer = false;
            $('.update-num-of-reds-base-div.of-modal').css('display', 'none');
            makeModalAlert(getTextFromVar('ONLY_DIGITS'), '$(\'.update-num-of-reds-base-div.of-modal\')', '#define-teams');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.input-num-of-reds-base\')'); }, 200);
            return;
        }
        $('.num-of-reds-base').html(parseInt($('.input-num-of-reds-base').val()));
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.update-num-of-reds-base-div.of-modal').css('display', 'none');
    });

    $('.cancel-update-num-of-reds-base').click(function() {
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.update-num-of-reds-base-div.of-modal').css('display', 'none');
    });

    $('.reds-left').click(function() {
        $('.input-reds').val(match.reds_left);
        $('.alert-of-modal-backdrop').css('display', 'block');
        $('#frame-board-modal .modal-content').append($('.alert-of-modal-backdrop'));
        $('.update-reds-div.of-modal').css('display', 'block');
        $('.input-reds').focus().select();
    });

    $('.update-frame-reds').click(function() {
        if ($('.input-reds').val() == '') {
            alert_answer = false;
            $('.update-reds-div.of-modal').css('display', 'none');
            makeModalAlert(getTextFromVar('MUST_FILL_NUMBER'), '$(\'.update-reds-div.of-modal\')', '#frame-board-modal');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.input-reds\')'); }, 200);
            return;
        }
        if (isNaN($('.input-reds').val())) {
            alert_answer = false;
            $('.update-reds-div.of-modal').css('display', 'none');
            makeModalAlert(getTextFromVar('ONLY_DIGITS'), '$(\'.update-reds-div.of-modal\')', '#frame-board-modal');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.input-reds\')'); }, 200);
            return;
        }
        match.reds_left = parseInt($('.input-reds').val());
        $('.reds-left').html(match.reds_left);
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.update-reds-div.of-modal').css('display', 'none');
    });

    $('.cancel-update-reds').click(function() {
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.update-reds-div.of-modal').css('display', 'none');
    });

    $('.num-of-reds').click(function() {
        $('.input-num-of-reds').val(parseInt($('.num-of-reds').html()));
        $('.alert-of-modal-backdrop').css('display', 'block');
        $('#new-teams .modal-content').append($('.alert-of-modal-backdrop'));
        $('.update-num-of-reds-div.of-modal').css('display', 'block');
        $('.input-num-of-reds').focus().select();
    });

    $('.update-frame-num-of-reds').click(function() {
        if ($('.input-num-of-reds').val() == '') {
            alert_answer = false;
            $('.update-num-of-reds-div.of-modal').css('display', 'none');
            makeModalAlert(getTextFromVar('MUST_FILL_NUMBER'), '$(\'.update-num-of-reds-div.of-modal\')', '#new-teams');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.input-num-of-reds\')'); }, 200);
            return;
        }
        if (isNaN($('.input-num-of-reds').val())) {
            alert_answer = false;
            $('.update-num-of-reds-div.of-modal').css('display', 'none');
            makeModalAlert(getTextFromVar('ONLY_DIGITS'), '$(\'.update-num-of-reds-div.of-modal\')', '#new-teams');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.input-num-of-reds\')'); }, 200);
            return;
        }
        $('.num-of-reds').html(parseInt($('.input-num-of-reds').val()));
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.update-num-of-reds-div.of-modal').css('display', 'none');
    });

    $('.cancel-update-num-of-reds').click(function() {
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.update-num-of-reds-div.of-modal').css('display', 'none');
    });

    //$(document).on('focus', '.datepicker', function () {
    //    $(this).datepicker({
    //        autoSize: false,
    //        dateFormat: 'dd/mm/yy',
    //        nextText: '',
    //        prevText: ''
    //    });
    //});

    $('.btn-restore').click(function() {
        $('#confirm-dialog .content-of-confirm').html(getTextFromVar('DO_YOU_WANT_TO_RESTORE_FRAME_FROM_LAST_STATE'));
        $('#confirm-dialog .content-of-confirm').attr('data-function', 'restoreMatch');
        if ($('.main-container').find($('.dialog-of-confirm')).length == 0) {
            $('.main-container').append($('.dialog-of-confirm'));
        }
        $('#confirm-dialog').dialog('open');
        $('.main-container').append($('.ui-widget-overlay'));
    });

    $('.btn-exit').click(function() {
        $.ajax({
            url: 'logout.php'
            , method: 'post'
            , data: {
            }
            , dataType: 'text'
        })
            .done(function(data) {
                location.reload();
            });
    });

    $('.btn-sign-in').click(function() {
        var user_name = $('#user-name').val();
        var password = $('#password').val();
        if (user_name.trim() == '') {
            alert_answer = false;
            makeAlert(getTextFromVar('PLEASE_FILL_USERNAME'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#user-name\')'); }, 200);
            return false;
        }
        if (password.trim() == '') {
            alert_answer = false;
            makeAlert(getTextFromVar('PLEASE_FILL_PASSWORD'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#password\')'); }, 200);
            return false;
        }
        $('#downloading-image').css('display', 'inline');
        $.ajax({
            url: 'sign_in.php'
            , method: 'post'
            , data: {
                user_name: user_name
                , password: password
            }
            , dataType: 'json'
        })
            .done(function(data) {
                $('#downloading-image').css('display', 'none');
                if (data[0] != 0) {
                    alert(data[1]);
                    return;
                }
                alert(getTextFromVar('LOGIN_SUCCESSFULLY'));
                location.reload();
            });
    });

    $('.btn-sign-up').click(function() {
        var user_name = $('#user-name-sign').val();
        var email = $('#email-sign').val();
        var password = $('#password-sign').val();
        var password_retype = $('#password-sign-retype').val();
        var full_name = $('#full-nane-sign').val();
        if (user_name.trim() == '') {
            alert_answer = false;
            makeAlert(getTextFromVar('PLEASE_FILL_USERNAME'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#user-name-sign\')'); }, 200);
            return false;
        }
        if (email.trim() == '') {
            alert_answer = false;
            makeAlert(getTextFromVar('PLEASE_FILL_EMAIL'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#email-sign\')'); }, 200);
            return false;
        }
        if (password.trim() == '') {
            alert_answer = false;
            makeAlert(getTextFromVar('PLEASE_FILL_PASSWORD'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#password-sign\')'); }, 200);
            return false;
        }
        if (full_name.trim() == '') {
            alert_answer = false;
            makeAlert(getTextFromVar('PLEASE_FILL_YOUR_NAME'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#full-nane-sign\')'); }, 200);
            return false;
        }
        if (password.trim() != password_retype.trim()) {
            alert_answer = false;
            makeAlert(getTextFromVar('NEED_TO_FILL_SAME_PASSWORD_TWICE'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#password-sign\')'); }, 200);
            return false;
        }
        if (user_name.trim().indexOf(' ') != -1) {
            alert_answer = false;
            makeAlert(getTextFromVar('USERNAME_NUST_NOT_CONTAIN_SPACES'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#user-name-sign\')'); }, 200);
            return false;
        }
        if (email.trim().indexOf(' ') != -1) {
            alert_answer = false;
            makeAlert(getTextFromVar('EMAIL_NUST_NOT_CONTAIN_SPACES'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#email-sign\')'); }, 200);
            return false;
        }
        if (password.trim().indexOf(' ') != -1) {
            alert_answer = false;
            makeAlert(getTextFromVar('PASSWORD_NUST_NOT_CONTAIN_SPACES'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#password-sign\')'); }, 200);
            return false;
        }
        if (user_name.length < 8 || user_name.length > 12) {
            alert_answer = false;
            makeAlert(getTextFromVar('USERNAME_BETWEEN') + ' 8 ' + getTextFromVar('AND_BETWEEN') + ' 12 ' + getTextFromVar('CHARACTERS'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#user-name-sign\')'); }, 200);
            return false;
        }
        if (password.length < 6 || password.length > 12) {
            alert_answer = false;
            makeAlert(getTextFromVar('PASSWORD_BETWEEN') + ' 6 ' + getTextFromVar('AND_BETWEEN') + ' 12 ' + getTextFromVar('CHARACTERS'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#password-sign\')'); }, 200);
            return false;
        }
        $('#downloading-image').css('display', 'inline');
        $.ajax({
            url: 'sign_up.php'
            , method: 'post'
            , data: {
                user_name: user_name
                , email: email
                , password: password
                , password_retype: password_retype
                , full_name: full_name
            }
            , dataType: 'json'
        })
            .done(function(data) {
                $('#downloading-image').css('display', 'none');
                if (data[0] != 0) {
                    alert(data[1]);
                    return;
                }
                if (data[0] == 0) {
                    alert(getTextFromVar('SIGN_UP_SUCCESSFULLY_EMAIL_SENT_FOR_ACCOUNT_ACTIVATING'));
                }
            });
    });

    $('.btn-forgot-password').click(function() {
        var user_name = $('#user-name-forgot').val();
        if (user_name.trim() == '') {
            alert_answer = false;
            makeAlert(getTextFromVar('PLEASE_FILL_USERNAME'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#user-name-forgot\')'); }, 200);
            return false;
        }
        $('#confirm-dialog .content-of-confirm').html(getTextFromVar('SEND_EMAIL_FOR_PASSWORD_RESET_TO') + user_name + '?');
        $('#confirm-dialog .content-of-confirm').attr('data-function', 'forgotPassword');
        if ($('.main-container').find($('.dialog-of-confirm')).length == 0) {
            $('.main-container').append($('.dialog-of-confirm'));
        }
        $('#confirm-dialog').dialog('open');
        $('.main-container').append($('.ui-widget-overlay'));
    });

    $('.btn-send-activation-link').click(function() {
        var user_name = $('#user-name-activation').val();
        if (user_name.trim() == '') {
            alert_answer = false;
            makeAlert(getTextFromVar('PLEASE_FILL_USERNAME'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#user-name-activation\')'); }, 200);
            return false;
        }
        $('#confirm-dialog .content-of-confirm').html(getTextFromVar('SEND_EMAIL_FOR_ACCOUNT_ACTIVATION_TO') + user_name + '?');
        $('#confirm-dialog .content-of-confirm').attr('data-function', 'ActivateAccount');
        if ($('.main-container').find($('.dialog-of-confirm')).length == 0) {
            $('.main-container').append($('.dialog-of-confirm'));
        }
        $('#confirm-dialog').dialog('open');
        $('.main-container').append($('.ui-widget-overlay'));
    });

    $('.btn-send-about').click(function() {
        var name_about = $('#name-about').val();
        var email_about = $('#email-about').val();
        var content_about = $('#content-about').val();
        if (name_about.trim() == '') {
            alert_answer = false;
            makeAlert(getTextFromVar('PLEASE_FILL_YOUR_NAME'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#name-about\')'); }, 200);
            return false;
        }
        if (email_about.trim() == '') {
            alert_answer = false;
            makeAlert(getTextFromVar('PLEASE_FILL_EMAIL'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#email-about\')'); }, 200);
            return false;
        }
        if (content_about.trim() == '') {
            alert_answer = false;
            makeAlert(getTextFromVar('PLEASE_FILL_DESCRIPTION_OF_CONTACT'), '');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'#content-about\')'); }, 200);
            return false;
        }
        $('#downloading-image').css('display', 'inline');
        $.ajax({
            url: 'about_form.php'
            , method: 'post'
            , data: {
                name_about: name_about
                , email_about: email_about
                , content_about: content_about
            }
            , dataType: 'json'
        })
            .done(function(data) {
                $('#downloading-image').css('display', 'none');
                if (data[0] != 0) {
                    alert_answer = false;
                    makeAlert(data[1], '');
                    alert_interval = setInterval(function() { checkAlertAnswer(''); }, 200);
                    //alert(data[1]);
                    return;
                }
                if (data[0] == 0) {
                    $('#alert-confirm-dialog .content-of-confirm').html(getTextFromVar('YOUR_INQUIRY_RECEIVED_WE_WILL_TRY_ANSWER_SHORTLY'));
                    $('#alert-confirm-dialog .content-of-confirm').attr('data-function', '');
                    if ($('.main-container').find($('.alert-dialog-of-confirm')).length == 0) {
                        $('.main-container').append($('.alert-dialog-of-confirm'));
                    }
                    $('#alert-confirm-dialog').dialog('open');
                    $('.main-container').append($('.ui-widget-overlay'));
                    //alert(getTextFromVar('YOUR_INQUIRY_RECEIVED_WE_WILL_TRY_ANSWER_SHORTLY'));
                    //alert_answer = false;
                    //makeAlert(getTextFromVar('YOUR_INQUIRY_RECEIVED_WE_WILL_TRY_ANSWER_SHORTLY'), '');
                    //alert_interval = setInterval(function() { checkAlertAnswer(''); }, 200);
                }
            });
    });

    $('#test').click(function() {
        $('#confirm-dialog .content-of-confirm').html(getTextFromVar('QUESTION'));
        $('#confirm-dialog .content-of-confirm').attr('data-function', 'testFunction');
        if ($('.main-container').find($('.dialog-of-confirm')).length == 0) {
            $('.main-container').append($('.dialog-of-confirm'));
        }
        $('#confirm-dialog').dialog('open');
        $('.main-container').append($('.ui-widget-overlay'));
    });

    $('.start-new-frame').click(function() {
        $.ajax({
            url: 'extend_login_time.php'
            , method: 'post'
            , data: {

            }
            , dataType: 'json'
        })
            .done(function(data) {

            });
        if (Object.keys(match.teams['A']['player-key']).length < 1
            || Object.keys(match.teams['B']['player-key']).length < 1) {
            alert_answer = false;
            makeAlert(getTextFromVar('IMPOSSIBLE_AT_LEAST_ONE_EACH_TEAM'), '');
            alert_interval = setInterval(function() { checkAlertAnswer(''); }, 200);
            return false;
        }
        if (Math.abs(Object.keys(match.teams['A']['player-key']).length - Object.keys(match.teams['B']['player-key']).length) > 1) {
            alert_answer = false;
            makeAlert(getTextFromVar('ALLOW_MAXIMUM_ONE_PLAYER_BETWEEN_TEAMS'), '');
            alert_interval = setInterval(function() { checkAlertAnswer(''); }, 200);
            return false;
        }
        if (match.order_set) {
            $('#confirm-dialog .content-of-confirm').html(getTextFromVar('KEEP_SAME_ORDER_QUESTION'));
            $('#confirm-dialog .content-of-confirm').attr('data-function', 'startNewFrame');
            if ($('#frame-board-modal .modal-content').find($('.dialog-of-confirm')).length == 0) {
                $('#frame-board-modal .modal-content').append($('.dialog-of-confirm'));
            }
            $('#confirm-dialog').dialog('open');
            $('#frame-board-modal .modal-content').append($('.ui-widget-overlay'));
        }
        else {
            startNewFrame(false);
        }
        updateLocalStorage();
    });

    $('.modal').on('shown.bs.modal', function() {
        modal_is_open = true;
        window.history.pushState('', null, './');
    });

    $('.modal').on('hidden.bs.modal', function() {
        modal_is_open = false;
        window.history.back();
    });

    $(document).on('click', '.btn-team-player.order', function() {
        if (!match.frame_on) {
            return;
        }
        match.red_potted = false;
        if (match.reds_left > 0) {
            match.only_red = true;
        }
        match.only_color = false;
        $('.remove-x').removeClass('active');
        match.all_balls_can_pot = false;
        if (match.reds_left == 0 && !match.last_six_colors_2 && !match.last_six_colors_3 && !match.last_six_colors_4 && !match.last_six_colors_5 && !match.last_six_colors_6 && !match.last_six_colors_7) {
            match.last_six_colors_2 = true;
        }
        $('.fault').removeClass('active');
        $('.made-snooker').removeClass('active');
        match.fault = false;
        match.made_snooker = false;
        var team_key = $(this).attr('data-team-key');
        var team_player_key = $(this).attr('data-team-player-key');
        var opposite_team_key = getOppositeTeamKey(team_key);
        var background_color = $(this).attr('data-background-color');
        var color = $(this).attr('data-color');
        var player_name = $(this).text();
        var player_key = $(this).attr('data-player-key');
        if (!match.first_player_of_frame_order_set_teams_equal) {
            if (!match.order_set) {
                $(this).removeClass('order');
                $(this).prop('disabled', true);
                $(this).addClass('disabled');
            }
            else {
                $('.btn-team-player[data-team-key="' + team_key + '"]').each(function() {
                    $(this).removeClass('order');
                    $(this).prop('disabled', true);
                    $(this).addClass('disabled');
                });
            }
        }
        else {
            $('.btn-team-player').each(function() {
                $(this).removeClass('order');
                $(this).prop('disabled', true);
                $(this).addClass('disabled');
            });
        }
        match.current_player['team_player_key'] = team_player_key;
        match.current_player['background_color'] = background_color;
        match.current_player['color'] = color;
        match.current_player['team_key'] = team_key;
        match.current_player['player_key'] = player_key;
        $('#current-player-circle').attr('data-team-player-key', team_player_key);
        $('#current-player-circle').attr('data-background-color', background_color);
        $('#current-player-circle').attr('data-color', color);
        $('#current-player-circle').attr('data-team-key', team_key);
        $('#current-player-circle').attr('data-player-key', player_key);
        $('.score-' + team_key).addClass('current-team');
        $('.score-' + opposite_team_key).removeClass('current-team');
        if (match.first_team_player[team_key] == '') {
            match.first_team_player[team_key] = team_player_key;
        }
        if (match.prev_team_player_arr[opposite_team_key] != '') {
            if (match.teams_equal) {
                match.inter_teams_players_order_arr[opposite_team_key][match.prev_team_player_arr[opposite_team_key]] = team_player_key;
            }
            if (match.prev_team_player_arr[team_key] != '') {
                match.team_players_order_arr[team_key][match.prev_team_player_arr[team_key]]['data-next'] = team_player_key;
                match.next_players_count_arr[team_key]++;
            }
        }
        if (!match.order_set) {
            if (match.teams_players_count_arr[team_key] - match.next_players_count_arr[team_key] == 2) {
                match.team_players_order_arr[team_key][team_player_key]['data-next'] = '';
                $.each(match.team_players_order_arr[team_key], function (team_player_key2, player_value) {
                    if (typeof(match.team_players_order_arr[team_key][team_player_key2]['data-next']) == 'undefined') {
                        match.last_team_player[team_key] = team_player_key2;
                        match.team_players_order_arr[team_key][team_player_key]['data-next'] = team_player_key2;
                        match.team_players_order_arr[team_key][team_player_key2]['data-next'] = match.first_team_player[team_key];
                        $('.btn-team-player[data-team-key="' + team_key + '"][data-team-player-key="' + team_player_key2 + '"]').removeClass('order');
                        $('.btn-team-player[data-team-key="' + team_key + '"][data-team-player-key="' + team_player_key2 + '"]').prop('disabled', true);
                        $('.btn-team-player[data-team-key="' + team_key + '"][data-team-player-key="' + team_player_key2 + '"]').addClass('disabled');
                        match.next_players_count_arr[team_key]++;
                        match.next_players_count_arr[team_key]++;
                        if (!match.teams_equal) {

                        }
                        return false;
                    }
                });
                if (match.teams_players_count_arr[opposite_team_key] == match.next_players_count_arr[opposite_team_key]) {
                    if (match.teams_equal) {
                        match.inter_teams_players_order_arr[team_key][team_player_key] = match.last_team_player[opposite_team_key];
                        match.inter_teams_players_order_arr[opposite_team_key][match.last_team_player[opposite_team_key]] = match.last_team_player[team_key];
                        match.inter_teams_players_order_arr[team_key][match.last_team_player[team_key]] = match.first_team_player[opposite_team_key];
                    }
                    match.order_set = true;
                }
            }
        }
        match.prev_team_player_arr[team_key] = team_player_key;
        match.current_player['player_name'] = player_name;
        $('#current-player-name').text(player_name);
        $('.start-title').removeClass('show');
        $('#start').removeClass('show');
        $('.next-title').removeClass('show');
        match.current_player['show'] = true;
        $('#current-player').addClass('show');
        $('.btn-played').addClass('visible');
        updateBalls();
        //var player_sound = document.getElementById('player-name');
        //$('#player-name-audio-source').attr('src', '8d82b5_The_Number_5_Sound_Effect.mp3');
        //player_sound.load();
        //player_sound.play();
        $('.all-players .all-players-team').each(function() {
            $(this).removeClass('invisible');
        });
        updateLocalStorage();
    });

    $(document).on('click', '#btn-played', function() {
        if (!match.frame_on) {
            return;
        }
        var team_key = $('#current-player-circle').attr('data-team-key');
        var team_player_key = $('#current-player-circle').attr('data-team-player-key');
        var opposite_team_key = getOppositeTeamKey(team_key);
        var player_key = $('#current-player-circle').attr('data-player-key');
        if (match.prev_team_player_arr[opposite_team_key] != '' && typeof(match.team_players_order_arr[opposite_team_key][match.prev_team_player_arr[opposite_team_key]]['data-next']) != 'undefined' || match.first_player_of_frame_order_set_teams_equal) {
            match.prev_team_player_arr[team_key] = team_player_key;
            if (match.first_player_of_frame_order_set_teams_equal) {
                team_player_key = match.inter_teams_players_order_arr[team_key][team_player_key];
            }
            else {
                team_player_key = match.team_players_order_arr[opposite_team_key][match.prev_team_player_arr[opposite_team_key]]['data-next'];
                match.prev_team_player_arr[opposite_team_key] = team_player_key;
            }
            var background_color = match.team_players_order_arr[opposite_team_key][team_player_key]['data-background-color'];
            var color = match.team_players_order_arr[opposite_team_key][team_player_key]['data-color'];
            var player_name = match.team_players_order_arr[opposite_team_key][team_player_key]['data-player-name'];
            player_key = match.team_players_order_arr[opposite_team_key][team_player_key]['data-player-key'];
            match.current_player['team_player_key'] = team_player_key;
            match.current_player['background_color'] = background_color;
            match.current_player['color'] = color;
            match.current_player['team_key'] = opposite_team_key;
            match.current_player['player_key'] = player_key;
            match.current_player['player_name'] = player_name;
            $('#current-player-circle').attr('data-team-player-key', team_player_key);
            $('#current-player-circle').attr('data-background-color', background_color);
            $('#current-player-circle').attr('data-color', color);
            $('#current-player-circle').attr('data-team-key', opposite_team_key);
            $('#current-player-circle').attr('data-player-key', player_key);
            $('#current-player-name').text(player_name);
            $('.score-' + opposite_team_key).addClass('current-team');
            $('.score-' + team_key).removeClass('current-team');
            match.first_player_of_frame_order_set_teams_equal = false;
            //var player_sound = document.getElementById('player-name');
            match.next_team_player = match.team_players_order_arr[team_key][match.prev_team_player_arr[team_key]]['data-next'];
            match.next_team_player = match.team_players_order_arr[team_key][match.next_team_player]['data-player-key'];
            match.red_potted = false;
            if (match.reds_left == 0) {
                if(!match.last_six_colors) {
                    match.last_six_colors = true;
                    match.last_six_colors_2 = true;
                }
            }
            $('.fault').removeClass('active');
            $('.made-snooker').removeClass('active');
            match.fault = false;
            if (match.reds_left > 0) {
                match.only_red = true;
            }
            $('.remove-x').removeClass('active');
            match.all_balls_can_pot = false;
            match.only_color = false;
            if (match.made_snooker) {
                match.players[player_key]['snooker-success']++;
                match.made_snooker = false;
            }
            updateBalls();
            //var player_name_audio_source = match.team_players_order_arr[team_key][match.next_team_player]['name-src'];
            //$('#player-name-audio-source').attr('src', player_name_audio_source);
            var after_sound = document.getElementById('after');
            //after_sound.load();
            var player_sound = document.getElementById('player-name-' + match.next_team_player);
            if (player_sound) {
                after_sound.play();
            }
            //player_sound.load();
            //player_sound.play();
            checkSnookerNeeded();
            updateLocalStorage();
            return;
        }
        var player_name = $('#current-player-name').text();
        $('.next-title span').text(player_name);
        match.current_player['show'] = false;
        $('#current-player').removeClass('show');
        $('.btn-played').removeClass('visible');
        $('#start').addClass('show');
        $('.next-title').addClass('show');
        $('.all-players .all-players-team-' + team_key).addClass('invisible');
        checkSnookerNeeded();
        updateLocalStorage();
    });

    $(document).on('click', '.btn-ball', function() {
        if (!match.frame_on) {
            return;
        }
        var team_key = $('#current-player-circle').attr('data-team-key');
        var team_player_key = $('#current-player-circle').attr('data-team-player-key');
        var player_key = $('#current-player-circle').attr('data-player-key');
        if (team_key == '') {
            return;
        }
        var score = $(this).attr('data-score');
        if ($(this).hasClass('no-entry-fault')) {
            return;
        }
        if ($(this).hasClass('no-entry-red')) {
            if (match.reds_left > 0) {
                $('.btn-ball.red').removeClass('no-entry-red');
            }
            return;
        }
        if ($(this).hasClass('no-entry-only-red')) {
            return;
        }
        if ($(this).hasClass('no-entry-last-six-colors')) {
            return;
        }
        match.add_score_arr['amount'] = score;
        if (score > 1 && match.reds_left == 0) {
            if (!match.last_six_colors) {
                match.last_six_colors = true;
                match.last_six_colors_2 = true;
            }
            else {
                if (!match.fault) {
                    if (match.last_six_colors_2) {
                        match.last_six_colors_2 = false;
                        match.last_six_colors_3 = true;
                    }
                    else if (match.last_six_colors_3) {
                        match.last_six_colors_3 = false;
                        match.last_six_colors_4 = true;
                    }
                    else if (match.last_six_colors_4) {
                        match.last_six_colors_4 = false;
                        match.last_six_colors_5 = true;
                    }
                    else if (match.last_six_colors_5) {
                        match.last_six_colors_5 = false;
                        match.last_six_colors_6 = true;
                    }
                    else {
                        if (match.last_six_colors_6) {
                            match.last_six_colors_6 = false;
                            match.last_six_colors_7 = true;
                        }
                    }
                }
            }
        }
        if (!match.fault) {
            match.add_score_arr['data-player-key'] = player_key;
            match.add_score_arr['data-player-key-fault'] = '';
            match.frame_score_arr[team_key] = parseInt(match.add_score_arr['amount']) + parseInt(match.frame_score_arr[team_key]);
            match.add_score_arr['team'] = team_key;
            match.players[player_key]['score'] += parseInt(match.add_score_arr['amount']);
            match.players[player_key]['score-' + score]++;
            if (match.made_snooker) {
                match.add_score_arr['data-player-key-snooker-success'] = player_key;
                match.players[player_key]['snooker-success']++;
                match.made_snooker = false;
                $('.made-snooker').removeClass('active');
            }
            $('.score-' + team_key).html(match.frame_score_arr[team_key]);
            $('.score-' + team_key).addClass('updated').delay(1000).queue(function () {
                $(this).removeClass('updated').dequeue();
            });
            playScoreSound(match.frame_score_arr[team_key]);
        }
        else {
            match.add_score_arr['data-player-key'] = '';
            match.add_score_arr['data-player-key-fault'] = player_key;
            match.frame_score_arr[getOppositeTeamKey(team_key)] = parseInt(match.add_score_arr['amount']) + parseInt(match.frame_score_arr[getOppositeTeamKey(team_key)]);
            match.add_score_arr['team'] = getOppositeTeamKey(team_key);
            $('.score-' + getOppositeTeamKey(team_key)).html(match.frame_score_arr[getOppositeTeamKey(team_key)]);
            match.players[player_key]['score-minus'] += parseInt(match.add_score_arr['amount']);
            if (match.made_snooker) {
                match.add_score_arr['data-player-key-snooker-failed'] = player_key;
                match.players[player_key]['snooker-failed']++;
                match.made_snooker = false;
                $('.made-snooker').removeClass('active');
            }
            $('.score-' + getOppositeTeamKey(team_key)).addClass('updated').delay(1000).queue(function () {
                $(this).removeClass('updated').dequeue();
            });
            $('.fault').removeClass('active');
            playScoreSound(match.frame_score_arr[getOppositeTeamKey(team_key)]);
            match.fault = false;
        }
        $(this).addClass('picked').delay(1000).queue(function() {
            $(this).removeClass('picked').dequeue();
        });
        if (score == 1) {
            if (match.reds_left > 0) {
                match.reds_left--;
            }
            match.red_potted = true;
            $('.reds-left').html(match.reds_left);
            match.only_red = false;
            match.only_color = true;
        }
        else {
            match.red_potted = false;
            if (match.reds_left > 0) {
                match.only_red = true;
                match.only_color = false;
            }
        }
        $('.btn-undo').prop('disabled', false);
        $('.btn-undo').removeClass('disabled');
        $('.remove-x').removeClass('active');
        match.all_balls_can_pot = false;
        updateBalls();
        checkSnookerNeeded();
        updateLocalStorage();
    });

    $('.score').click(function() {
        var team_key = $(this).attr('data-team-key');
        $('.input-score').val(match.frame_score_arr[team_key]);
        $('.input-score').attr('data-team-key', team_key);
        $('#frame-board-modal .modal-content').append($('.alert-of-modal-backdrop'));
        $('.alert-of-modal-backdrop').css('display', 'block');
        $('.update-score-div.of-modal').css('display', 'block');
        $('.input-score').focus().select();
        $('.update-frame-score').css('display', 'inline');
        $('.update-total-score').css('display', 'none');
    });

    $('.update-frame-score').click(function() {
        if ($('.input-score').val() == '') {
            alert_answer = false;
            $('.update-score-div.of-modal').css('display', 'none');
            makeModalAlert(getTextFromVar('MUST_FILL_NUMBER'), '$(\'.update-score-div.of-modal\')', '#frame-board-modal');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.input-score\')'); }, 200);
            return;
        }
        if (isNaN($('.input-score').val())) {
            alert_answer = false;
            $('.update-score-div.of-modal').css('display', 'none');
            makeModalAlert(getTextFromVar('ONLY_DIGITS'), '$(\'.update-score-div.of-modal\')', '#frame-board-modal');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.input-score\')'); }, 200);
            return;
        }
        var team_key = $('.input-score').attr('data-team-key');
        match.frame_score_arr[team_key] = parseInt($('.input-score').val());
        $('.score.score-' + team_key).html(match.frame_score_arr[team_key]);
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.update-score-div.of-modal').css('display', 'none');
        updateLocalStorage();
    });

    $('.total-score').click(function() {
        var team_key = $(this).attr('data-team-key');
        $('.input-score').val(match.total_score_arr[team_key]);
        $('.input-score').attr('data-team-key', team_key);
        $('#frame-board-modal .modal-content').append($('.alert-of-modal-backdrop'));
        $('.alert-of-modal-backdrop').css('display', 'block');
        $('.update-score-div.of-modal').css('display', 'block');
        $('.input-score').focus().select();
        $('.update-frame-score').css('display', 'none');
        $('.update-total-score').css('display', 'inline');
    });

    $('.update-total-score').click(function() {
        if ($('.input-score').val() == '') {
            alert_answer = false;
            $('.update-score-div.of-modal').css('display', 'none');
            makeModalAlert(getTextFromVar('MUST_FILL_NUMBER'), '$(\'.update-score-div.of-modal\')', '#frame-board-modal');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.input-score\')'); }, 200);
            return;
        }
        if (isNaN($('.input-score').val())) {
            alert_answer = false;
            makeModalAlert(getTextFromVar('ONLY_DIGITS'), '$(\'.update-score-div.of-modal\')', '#frame-board-modal');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.input-score\')'); }, 200);
            return;
        }
        var team_key = $('.input-score').attr('data-team-key');
        match.total_score_arr[team_key] = parseInt($('.input-score').val());
        $('.total-score.total-score-' + team_key).html(match.total_score_arr[team_key]);
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.update-score-div.of-modal').css('display', 'none');
        updateLocalStorage();
    });

    $('.cancel-update-score').click(function() {
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.update-score-div.of-modal').css('display', 'none');
    });

    $('.btn-stats').click(function() {
        var btn_pot_arr = {
            1   :   'red'
            , 2 :   'yellow'
            , 3 :   'green'
            , 4 :   'brown'
            , 5 :   'blue'
            , 6 :   'pink'
            , 7 :   'black'
        };
        var html = '<table>';
        var player_count = 0;
        html += '<thead><tr><th>&nbsp;</th><th>' + getTextFromVar('POINTS') + '</th><th>' + getTextFromVar('FOULS') + '</th><th>' + getTextFromVar('SNOOKERS') + '</th><th>' + getTextFromVar('SNOOKERS_SUCCESS') + '</th><th>' + getTextFromVar('SNOOKERS_FAILED') + '</th></tr></thead>';
        $.each(match.teams, function(team_index, team_value) {
            $.each(match.teams[team_index]['player-key'], function(team_player_key, player_key) {
                player_count++;
                var player_name = match.players[player_key]['name'];
                var score_plus = match.players[player_key]['score'];
                var score_minus = match.players[player_key]['score-minus'];
                var snooker_made = match.players[player_key]['snooker-made'];
                var snooker_success = match.players[player_key]['snooker-success'];
                var snooker_failed = match.players[player_key]['snooker-failed'];
                html += '<tr class="scores-for-player' + (player_count % 2 == 0 ? ' even' : '') + '" data-player-key="' + player_key + '"><td>' + player_name + '</td><td class="score-plus">' + score_plus + '</td><td class="score-minus">' + score_minus + '</td><td class="snooker-made">' + snooker_made + '</td><td class="snooker-success">' + snooker_success + '</td><td class="snooker-failed">' + snooker_failed + '</td></tr></div>';
                html += '<tr class="ball-potted' + (player_count % 2 == 0 ? ' even' : '') + '" data-player-key="' + player_key + '"><td colspan="6">';
                var balls = '';
                var potted = false;
                for (var score = 1; score <= 7; score++) {
                    if (match.players[player_key]['score-' + score] > 0) {
                        balls += '<button class="btn btn-pot ' + btn_pot_arr[score] + '">' + match.players[player_key]['score-' + score] + '</button>';
                        potted = true;
                    }
                    else {
                        balls += '<button class="btn btn-pot none">&nbsp;</button>';
                    }
                }
                if (!potted) {
                    html += '<span>' + getTextFromVar('DID_NOT_POT') + '</span>';
                }
                else {
                    html += balls;
                }
                html += '</td></tr>';
            });
            html += '<tr class="total-sum"><td>' + getTextFromVar('TOTAL') + '</td><td>' + match.frame_score_arr[team_index] + '</td><td colspan="4"></td></tr></div>';
            //html += '<tr class="separate"><td colspan="6">&nbsp;</td></tr>';
        });
        html += '</table>';
        $('.frame-stats-body').html(html);
        $('#frame-board-modal .modal-content').append($('.alert-of-modal-backdrop'));
        //$('.btn-stats').removeClass('visible');
        $('.alert-of-modal-backdrop').css('display', 'block');
        $('.frame-stats-div.of-modal').css('display', 'block');
    });

    $('.cancel-frame-stats').click(function() {
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.frame-stats-div.of-modal').css('display', 'none');
        //$('.btn-stats').addClass('visible');
    });

    $('.btn-mute-player-name').click(function() {
        if ($(this).hasClass('muted')) {
            $(this).removeClass('muted');
            $('audio.audio-after').prop('muted', false);
            $('audio.audio-player-name').each(function() {
                $(this).prop('muted', false);
            });
            return;
        }
        $('audio.audio-after').prop('muted', true);
        $(this).addClass('muted');
        $('audio.audio-player-name').each(function() {
            $(this).prop('muted', true);
        });
    });

    $('.btn-mute-score').click(function() {
        if ($(this).hasClass('muted')) {
            $(this).removeClass('muted');
            $('audio.audio-score').each(function() {
                $(this).prop('muted', false);
            });
            return;
        }
        $(this).addClass('muted');
        $('audio.audio-score').each(function() {
            $(this).prop('muted', true);
        });
    });

    $('.cancel-frame-snooker').click(function() {
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.frame-snooker-div.of-modal').css('display', 'none');
    });

    $('.alert-div.of-modal .popup-footer .btn').click(function () {
        var alert_modal = $(this).attr('data-alert_div');
        var div_to_display = $(this).attr('data-div-source');
        $(alert_modal + ' .alert-div.of-modal').css('display', 'none');
        if ($(alert_modal + ' .alert-of-modal-backdrop').hasClass('modal-on-modal')) {
            $(alert_modal + ' .alert-of-modal-backdrop').removeClass('modal-on-modal');
            $(eval(div_to_display)).css('display', 'block');
        }
        else {
            $(alert_modal + ' .alert-of-modal-backdrop').css('display', 'none');
        }
        alert_answer = true;
    });

    $('.alert-div.general .popup-footer .btn').click(function () {
        var div_to_display = $(this).attr('data-div-source');
        $('.alert-div.general').css('display', 'none');
        if ($('.alert-backdrop').hasClass('modal-on-modal')) {
            $('.alert-backdrop').removeClass('modal-on-modal');
            $(eval(div_to_display)).css('display', 'block');
        }
        else {
            $('.alert-backdrop').css('display', 'none');
        }
        alert_answer = true;
    });

    $('#btn-undo').click(function() {
        if (!match.frame_on) {
            return;
        }
        if (match.add_score_arr['amount'] == '' || match.add_score_arr['team'] == '') {
            return;
        }
        if (match.add_score_arr['amount'] == 1) {
            $('.btn-ball.red').removeClass('no-entry-red');
            if (!match.only_red) {
                $('.btn-ball').each(function() {
                    if (!$(this).hasClass('red')) {
                        $(this).addClass('no-entry-only-red');
                    }
                });
            }
        }
        else {
            if (match.add_score_arr['data-player-key'] == match.current_player['player_key']) {
                $('.btn-ball.red').addClass('no-entry-red');
                $('.btn-ball').each(function() {
                    if (!$(this).hasClass('red')) {
                        $(this).removeClass('no-entry-only-red');
                    }
                });
            }
            if (match.last_six_colors) {
                if (match.last_six_colors_2) {
                    match.last_six_colors = false;
                    match.last_six_colors_2 = false;
                    $('.btn-ball').each(function () {
                        if (!$(this).hasClass('red')) {
                            $(this).removeClass('no-entry-last-six-colors');
                        }
                    });
                }
                else {
                    if (match.add_score_arr['data-player-key'] != '') {
                        $('.btn-ball').each(function () {
                            if (!$(this).hasClass('red')) {
                                $(this).addClass('no-entry-last-six-colors');
                            }
                        });
                        if (match.last_six_colors_3) {
                            match.last_six_colors_3 = false;
                            match.last_six_colors_2 = true;
                            $('.btn-ball.yellow').removeClass('no-entry-last-six-colors');
                        }
                        else if (match.last_six_colors_4) {
                            match.last_six_colors_4 = false;
                            match.last_six_colors_3 = true;
                            $('.btn-ball.green').removeClass('no-entry-last-six-colors');
                        }
                        else if (match.last_six_colors_5) {
                            match.last_six_colors_5 = false;
                            match.last_six_colors_4 = true;
                            $('.btn-ball.brown').removeClass('no-entry-last-six-colors');
                        }
                        else if (match.last_six_colors_6) {
                            match.last_six_colors_6 = false;
                            match.last_six_colors_5 = true;
                            $('.btn-ball.blue').removeClass('no-entry-last-six-colors');
                        }
                        else {
                            match.last_six_colors_7 = false;
                            match.last_six_colors_6 = true;
                            $('.btn-ball.pink').removeClass('no-entry-last-six-colors');
                        }
                    }
                }
            }
        }
        match.frame_score_arr[match.add_score_arr['team']] = parseInt(match.frame_score_arr[match.add_score_arr['team']]) - parseInt(match.add_score_arr['amount']);
        if (match.add_score_arr['data-player-key'] != '') {
            match.players[match.add_score_arr['data-player-key']]['score'] = parseInt(match.players[match.add_score_arr['data-player-key']]['score']) - parseInt(match.add_score_arr['amount']);
            match.players[match.add_score_arr['data-player-key']]['score-' + parseInt(match.add_score_arr['amount'])]--;
            if (match.add_score_arr['data-player-key-snooker-success'] != '') {
                match.players[match.add_score_arr['data-player-key-snooker-success']]['snooker-success']--;
                if ($('.btn-played').hasClass('visible') && $('#current-player-circle').attr('data-player-key') == match.add_score_arr['data-player-key-snooker-success']) {
                    match.made_snooker = true;
                    $('.made-snooker').addClass('active');
                }
                match.add_score_arr['data-player-key-snooker-success'] = '';
            }
        }
        else {
            match.players[match.add_score_arr['data-player-key-fault']]['score-minus'] -= parseInt(match.add_score_arr['amount']);
            if (match.add_score_arr['data-player-key-snooker-failed'] != '') {
                match.players[match.add_score_arr['data-player-key-snooker-failed']]['snooker-failed']--;
                if ($('.btn-played').hasClass('visible') && $('#current-player-circle').attr('data-player-key') == match.add_score_arr['data-player-key-snooker-failed']) {
                    match.made_snooker = true;
                    $('.made-snooker').addClass('active');
                }
                match.add_score_arr['data-player-key-snooker-failed'] = '';
            }
        }
        $('.score-' + match.add_score_arr['team']).html(match.frame_score_arr[match.add_score_arr['team']]);
        if (match.add_score_arr['amount'] == 1) {
            match.reds_left++;
            $('.reds-left').html(match.reds_left);
        }
        match.add_score_arr['amount'] = '';
        $('.score-' + match.add_score_arr['team']).addClass('updated').delay(1000).queue(function() {
            $(this).removeClass('updated').dequeue();
        });
        match.red_potted = false;
        $('.remove-x').removeClass('active');
        match.all_balls_can_pot = false;
        $('.fault').removeClass('active');
        match.fault = false;
        $('.made-snooker').removeClass('active');
        match.made_snooker = false;
        $('.btn-ball.red').removeClass('no-entry-fault');
        $('.btn-ball.yellow').removeClass('no-entry-fault');
        $('.btn-ball.green').removeClass('no-entry-fault');
        $('.btn-undo').prop('disabled', true);
        $('.btn-undo').addClass('disabled');
        checkSnookerNeeded();
        updateLocalStorage();
    });

    $('#btn-end-frame').click(function() {
        if (match.frame_score_arr['A'] == match.frame_score_arr['B']) {
            makeModalAlert(getTextFromVar('IMPOSSIBLE_SCORE_IS_TIE'), '', '#frame-board-modal');
            return;
        }
        $('#confirm-dialog .content-of-confirm').html(getTextFromVar('END_FRAME_IS_SCORE_UPDATED'));
        $('#confirm-dialog .content-of-confirm').attr('data-function', 'endFrame');
        if ($('#frame-board-modal .modal-content').find($('.dialog-of-confirm')).length == 0) {
            $('#frame-board-modal .modal-content').append($('.dialog-of-confirm'));
        }
        $('#confirm-dialog').dialog('open');
        $('#frame-board-modal .modal-content').append($('.ui-widget-overlay'));
    });

    $('#btn-cancel-frame').click(function() {
        $('#confirm-dialog .content-of-confirm').html(getTextFromVar('CANCEL_FRAME_QUESTION'));
        $('#confirm-dialog .content-of-confirm').attr('data-function', 'cancelFrame');
        if ($('#frame-board-modal .modal-content').find($('.dialog-of-confirm')).length == 0) {
            $('#frame-board-modal .modal-content').append($('.dialog-of-confirm'));
        }
        $('#confirm-dialog').dialog('open');
        $('#frame-board-modal .modal-content').append($('.ui-widget-overlay'));
    });

    $('.btn-new-teams').click(function() {
        match.teams_copy = JSON.parse(JSON.stringify(match.teams));
        match.players_copy = JSON.parse(JSON.stringify(match.players));
        var all_team_players = new Array();
        $.each(match.teams_copy, function(team_index, team_value) {
            $('#current-all-players .all-players-team-' + team_index + ' .team-player.head.team-player-current').html(match.teams_copy[team_index]['name']);
            $('#current-all-players .all-players-team-' + team_index).find('.team-player-div').remove();
            var html = '';
            $.each(match.teams_copy[team_index]['player-key'], function(team_player_key, player_key) {
                html += '<div class="team-player-div">';
                html += '<button class="current-team-player" data-background-color="' + match.players[player_key]['background-color'] + '" data-color="' + match.players[player_key]['color'] + '" data-player-key="' + player_key + '">' + match.players[player_key]['name'] + '</button>';
                html += '<span class="btn-player-delete" data-team-player-key="' + team_player_key + '" data-player-key="' + player_key + '" data-team-key="' + team_index + '">&nbsp;</span>';
                html += '</div>';
                all_team_players[player_key] = '';
            });
            html += '</div>';
            $('#current-all-players .all-players-team-' + team_index).append(html);
        });
        $('.num-of-reds').html(match.num_of_reds);
        $('.choose-team').prop('checked', false);
        $('.btn-steady-player').each(function() {
            var player_key = $(this).attr('data-player-key');
            $(this).removeClass('picked');
            if (typeof(all_team_players[player_key]) != 'undefined') {
                $('.btn-steady-player[data-player-key="' + player_key + '"]').html('&nbsp;');
                $('.btn-steady-player[data-player-key="' + player_key + '"]').removeClass('add');
                $('.btn-steady-player[data-player-key="' + player_key + '"]').prop('disabled', true);
                $('.btn-steady-player[data-player-key="' + player_key + '"]').addClass('disabled');
            }
            else {
                $('.btn-steady-player[data-player-key="' + player_key + '"]').html(getTextFromVar('AVAILABLE'));
                $('.btn-steady-player[data-player-key="' + player_key + '"]').addClass('add');
                $('.btn-steady-player[data-player-key="' + player_key + '"]').prop('disabled', false);
                $('.btn-steady-player[data-player-key="' + player_key + '"]').removeClass('disabled');
            }
        });
        $('.new-player-div').css('visibility', 'hidden');
        $('.players-voice-div').css('display', 'none');
    });

    $(document).on('click', '.btn-steady-player.add', function() {
        if ($(this).hasClass('picked')) {
            $('.new-player-div').css('visibility', 'hidden');
            $(this).removeClass('picked');
            return;
        }
        var player_key = $(this).attr('data-player-key');
        var player_name = match.players[player_key]['name'];
        var background_color = match.players[player_key]['background-color'];
        var color = match.players[player_key]['color'];
        $('#added-player').attr('data-player-key', player_key);
        $('#added-player').attr('data-background-color', background_color);
        $('#added-player').attr('data-color', color);
        $('.new-player').val(player_name);
        $('.new-player-div').css('visibility', 'visible');
        $('.btn-steady-player').each(function() {
            $(this).removeClass('picked');
        });
        $(this).addClass('picked');
        if (!$(this).hasClass('spare-player')) {
            $('.new-player').attr('readonly', true);
        }
        else {
            $('.new-player').removeAttr('readonly');
        }
        $('.new-player').focus().select();
    });

    $('#btn-add-player').click(function() {
        if ($('.new-player').val() == '') {
            alert_answer = false;
            makeModalAlert(getTextFromVar('MUST_FILL_PLAYER_NAME'), '', '#new-teams');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.new-player\')'); }, 200);
            return;
        }
        if (!$('.choose-team:checked').val()) {
            alert_answer = false;
            makeModalAlert(getTextFromVar('PLEASE_CHOOSE_TEAM'), '', '#new-teams');
            alert_interval = setInterval(function() { checkAlertAnswer(''); }, 200);
            return;
        }
        var player_key = $('#added-player').attr('data-player-key');
        var background_color = $('#added-player').attr('data-background-color');
        var color = $('#added-player').attr('data-color');
        var player_name = $('.new-player').val();
        var team_index = $('.choose-team:checked').val();
        var team_player_key = '';
        $.each (match.teams_copy[team_index]['player-key'], function(team_player_key1, player_key) {
            team_player_key = team_player_key1;
        });
        team_player_key++;
        match.teams_copy[team_index]['player-key'][team_player_key] = parseInt(player_key);
        var html = '';
        html += '<div class="team-player-div">';
        html += '<button class="current-team-player" data-team-player-key="' + team_player_key + '" data-background-color="' + background_color + '" data-color="' + color + '" data-player-key="' + player_key + '">' + player_name + '</button>';
        html += '<span class="btn-player-delete" data-team-player-key="' + team_player_key + '" data-player-key="' + player_key + '" data-team-key="' + team_index + '">&nbsp;</span>';
        html += '</div>';
        $('#current-all-players .all-players-team-' + team_index).append(html);
        $('.choose-team').prop('checked', false);
        $('.new-player-div').css('visibility', 'hidden');
        $('.btn-steady-player[data-player-key="' + player_key + '"]').removeClass('picked');
        $('.btn-steady-player[data-player-key="' + player_key + '"]').removeClass('add');
        $('.btn-steady-player[data-player-key="' + player_key + '"]').prop('disabled', true);
        $('.btn-steady-player[data-player-key="' + player_key + '"]').addClass('disabled');
        match.players_copy[player_key]['name'] = player_name;
    });

    $('.btn-cancel-add-player').click(function() {
        var player_key = $('#added-player').attr('data-player-key');
        $('.choose-team').prop('checked', false);
        $('.new-player-div').css('visibility', 'hidden');
        $('.btn-steady-player[data-player-key="' + player_key + '"]').removeClass('picked');
    });

    $(document).on('click', '.btn-player-delete', function() {
        var team_player_key = $(this).attr('data-team-player-key');
        var player_key = $(this).attr('data-player-key');
        var team_index = $(this).attr('data-team-key');
        var data_variables_arr = new Array(team_player_key, player_key, team_index);
        var player_name = $(this).parent().find('.current-team-player').html();
        $('#confirm-dialog .content-of-confirm').html(getTextFromVar('REMOVE_QUESTION') + player_name + '?');
        $('.ui-dialog .ui-dialog-buttonpane button:first-child').html(getTextFromVar('REMOVE'));
        $('.ui-dialog .ui-dialog-buttonpane button:nth-child(2)').html(getTextFromVar('NO'));
        $('#confirm-dialog .content-of-confirm').attr('data-variables', JSON.stringify(data_variables_arr));
        $('#confirm-dialog .content-of-confirm').attr('data-function', 'deletePlayer');
        if ($('#new-teams .modal-content').find($('.dialog-of-confirm')).length == 0) {
            $('#new-teams .modal-content').append($('.dialog-of-confirm'));
        }
        $('#confirm-dialog').dialog('open');
        $('#new-teams .modal-content').append($('.ui-widget-overlay'));
    });

    $(document).on('click', '.team-player.head.team-player-current', function() {
        var team_index = $(this).attr('data-team-key');
        var team_name = $(this).html();
        $('.team-name[data-team-key="' + team_index + '"]').val(team_name);
        $(this).css('display', 'none');
        $('.team-player.head.team-player-current-change[data-team-key="' + team_index + '"]').css('display', 'block');
        $('.team-name[data-team-key="' + team_index + '"]').focus().select();
    });

    $(document).on('click', '.current-team-player', function() {
        if ($(this).hasClass('picked')) {
            $('.players-voice-div').css('display', 'none');
            $(this).removeClass('picked');
            return;
        }
        var player_key = $(this).attr('data-player-key');
        var name_src = match.players_copy[player_key]['name-src'];
        $('.players-voice option[value="' + name_src + '"]').prop('selected', true);
        $('#picked-player').attr('data-player-key', player_key);
        $('.players-voice-div').css('display', 'block');
        $('.current-team-player').each(function() {
            $(this).removeClass('picked');
        });
        $(this).addClass('picked');
    });

    $('.btn-cancel-save-player-voice').click(function() {
        var player_key = $('#picked-player').attr('data-player-key');
        $('.players-voice-div').css('display', 'none');
        $('.current-team-player[data-player-key="' + player_key + '"]').removeClass('picked');
    });

    $('#save-player-voice').click(function() {
        var name_src = $('.players-voice').val();
        var player_key = $('#picked-player').attr('data-player-key');
        match.players_copy[player_key]['name-src'] = name_src;
        $('.players-voice-div').css('display', 'none');
        $('.current-team-player[data-player-key="' + player_key + '"]').removeClass('picked');
    });

    $(document).on('click', '.btn-cancel-change-team-name', function() {
        var team_index = $(this).attr('data-team-key');
        $('.team-player.head.team-player-current[data-team-key="' + team_index + '"]').css('display', 'block');
        $('.team-player.head.team-player-current-change[data-team-key="' + team_index + '"]').css('display', 'none');
    });

    $(document).on('click', '.btn-change-team-name', function() {
        var team_index = $(this).attr('data-team-key');
        var team_name = $('.team-name[data-team-key="' + team_index + '"]').val();
        if (team_name.trim() == '') {
            alert_answer = false;
            makeModalAlert(getTextFromVar('MUST_FILL_TEAM_NAME'), '', '#new-teams');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.team-name[data-team-key="' + team_index + '"]\')'); }, 200);
            return;
        }
        $('.team-player.head.team-player-current[data-team-key="' + team_index + '"]').html(team_name);
        $('.team-player.head.team-player-current-change[data-team-key="' + team_index + '"]').css('display', 'none');
        $('.team-player.head.team-player-current[data-team-key="' + team_index + '"]').css('display', 'block');
        match.teams_copy[team_index]['name'] = team_name;
    });

    $('.cancel-new-teams').click(function() {
        $temp_current_players_arr = new Object();
        $.each(match.teams, function(team_index, team_value) {
            $.each(match.teams[team_index]['player-key'], function(team_player_key, player_key) {
                $temp_current_players_arr[player_key] = '';
            });
            $('.btn-steady-player').each(function() {
                if ($temp_current_players_arr[$(this).attr('data-player-key')] != 'undefined') {
                    $(this).addClass('add');
                    $(this).prop('disabled', false);
                    $(this).removeClass('disabled');
                    return;
                }
                $(this).removeClass('add');
                $(this).prop('disabled', true);
                $(this).addClass('disabled');
            });
        });
    });

    $('.apply-new-teams').click(function() {
        var teams_sort = new Array();
        var teams_copy_sort = new Array();
        teams_sort['A'] = new Array();
        teams_sort['B'] = new Array();
        teams_copy_sort['A'] = new Array();
        teams_copy_sort['B'] = new Array();
        $.each(match.teams, function(team_index, team_value) {
            var count = 0;
            $.each(match.teams[team_index]['player-key'], function(team_player_key, player_key) {
                teams_sort[team_index][count] = match.players_copy[player_key]['name'];
                count++;
            });
        });
        $.each(match.teams_copy, function(team_index, team_value) {
            var count = 0;
            $.each(match.teams_copy[team_index]['player-key'], function(team_player_key, player_key) {
                teams_copy_sort[team_index][count] = match.players_copy[player_key]['name'];
                count++;
            });
        });
        teams_sort['A'].sort();
        teams_sort['B'].sort();
        teams_copy_sort['A'].sort();
        teams_copy_sort['B'].sort();
        match.teams = JSON.parse(JSON.stringify(match.teams_copy));
        match.players = JSON.parse(JSON.stringify(match.players_copy));
        match.num_of_reds = parseInt($('.num-of-reds').html());
        $('#new-teams').modal('hide');
        if (JSON.stringify(teams_sort['A']) != JSON.stringify(teams_copy_sort['A']) || JSON.stringify(teams_sort['B']) != JSON.stringify(teams_copy_sort['B'])) {
            match.new_teams = true;
            match.order_set = false;
        }
        $.each(match.teams, function(team_index, team_value) {
            $('.teams #temp-team-' + team_index).html('');
            var html = '';
            html += '<div class="team-player head">' + match.teams[team_index]['name'] + '</div>';
            $.each(match.teams[team_index]['player-key'], function(team_player_key, player_key) {
                html += '<div class="team-player">' + match.players[player_key]['name'] + '</div>';
            });
            $('.teams #temp-team-' + team_index).html(html);
            $('.btn-score-update[data-team-key="' + team_index + '"]').html(match.teams[team_index]['name']);
        });
        match.temp_teams = true;
        $('.temp-teams').css('visibility', 'visible');
        if (Object.keys(match.teams['A']['player-key']).length == 0 && Object.keys(match.teams['B']['player-key']).length == 0) {
            //$('.no-players-div').removeClass('hide');
        }
        else {
            //$('.no-players-div').addClass('hide');
        }
        $.each(match.players, function(player_key, player_value) {
            if (match.players[player_key]['name-src'] != '') {
                var player_sound = document.getElementById('player-name-' + player_key);
                if (!player_sound) {
                    player_sound = document.createElement('AUDIO');
                    player_sound.setAttribute('id','player-name-' + player_key);
                }
                player_sound.setAttribute('src','audio/player_names/' + match.players[player_key]['name-src'] + '.mp3');
                document.body.appendChild(player_sound);
            }
            else {
                $('#player-name-' + player_key).remove();
            }
        });
        updateLocalStorage();
        Android.SaveTeamsToPreferences(JSON.stringify(match.teams), JSON.stringify(match.players), match.num_of_reds);
    });

    $('.btn-define-teams').click(function() {
        match.teams_copy = JSON.parse(JSON.stringify(match.teams_base));
        match.players_copy = JSON.parse(JSON.stringify(match.players_base));
        var all_team_players = new Array();
        $.each(match.teams_copy, function(team_index, team_value) {
            $('#current-all-players-base .all-players-team-' + team_index + ' .team-player.head.team-player-current-base').html(match.teams_copy[team_index]['name']);
            $('#current-all-players-base .all-players-team-' + team_index).find('.team-player-div').remove();
            var html = '';
            $.each(match.teams_copy[team_index]['player-key'], function(team_player_key, player_key) {
                html += '<div class="team-player-div">';
                html += '<button class="current-team-player-base" data-background-color="' + match.players_copy[player_key]['background-color'] + '" data-color="' + match.players_copy[player_key]['color'] + '">' + match.players_copy[player_key]['name'] + '</button>';
                html += '<span class="btn-player-delete-base" data-team-player-key="' + team_player_key + '" data-player-key="' + player_key + '" data-team-key="' + team_index + '">&nbsp;</span>';
                html += '</div>';
                all_team_players[player_key] = '';
            });
            html += '</div>';
            $('#current-all-players-base .all-players-team-' + team_index).append(html);
        });
        $('.num-of-reds-base').html(match.num_of_reds_base);
        $('.choose-team-base').prop('checked', false);
        $('.btn-steady-player-base').each(function() {
            var player_key = $(this).attr('data-player-key');
            $(this).removeClass('picked');
            if (typeof(all_team_players[player_key]) != 'undefined') {
                $('.btn-steady-player-base[data-player-key="' + player_key + '"]').html('&nbsp;');
                $('.btn-steady-player-base[data-player-key="' + player_key + '"]').removeClass('add');
                $('.btn-steady-player-base[data-player-key="' + player_key + '"]').prop('disabled', true);
                $('.btn-steady-player-base[data-player-key="' + player_key + '"]').addClass('disabled');
            }
            else {
                $('.btn-steady-player-base[data-player-key="' + player_key + '"]').html(getTextFromVar('AVAILABLE'));
                $('.btn-steady-player-base[data-player-key="' + player_key + '"]').addClass('add');
                $('.btn-steady-player-base[data-player-key="' + player_key + '"]').prop('disabled', false);
                $('.btn-steady-player-base[data-player-key="' + player_key + '"]').removeClass('disabled');
            }
        });
        $('.new-player-base-div').css('visibility', 'hidden');
    });

    $(document).on('click', '.btn-steady-player-base.add', function() {
        if ($(this).hasClass('picked')) {
            $('.new-player-base-div').css('visibility', 'hidden');
            $(this).removeClass('picked');
            return;
        }
        var player_key = $(this).attr('data-player-key');
        var player_name = match.players[player_key]['name'];
        var background_color = match.players[player_key]['background-color'];
        var color = match.players[player_key]['color'];
        $('#added-player-base').attr('data-player-key', player_key);
        $('#added-player-base').attr('data-background-color', background_color);
        $('#added-player-base').attr('data-color', color);
        $('.new-player-base').val(player_name);
        $('.new-player-base-div').css('visibility', 'visible');
        $('.btn-steady-player-base').each(function() {
            $(this).removeClass('picked');
        });
        $(this).addClass('picked');
        if (!$(this).hasClass('spare-player')) {
            $('.new-player-base').attr('readonly', true);
        }
        else {
            $('.new-player-base').removeAttr('readonly');
        }
        $('.new-player-base').focus().select();
    });

    $('#btn-add-player-base').click(function() {
        if ($('.new-player-base').val() == '') {
            alert_answer = false;
            makeModalAlert(getTextFromVar('MUST_FILL_PLAYER_NAME'), '', '#define-teams');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.new-player-base\')'); }, 200);
            return;
        }
        if (!$('.choose-team-base:checked').val()) {
            alert_answer = false;
            makeModalAlert(getTextFromVar('PLEASE_CHOOSE_TEAM'), '', '#define-teams');
            alert_interval = setInterval(function() { checkAlertAnswer(''); }, 200);
            return;
        }
        var player_key = $('#added-player-base').attr('data-player-key');
        var background_color = $('#added-player-base').attr('data-background-color');
        var color = $('#added-player-base').attr('data-color');
        var player_name = $('.new-player-base').val();
        var team_index = $('.choose-team-base:checked').val();
        var team_player_key = '';
        $.each (match.teams_copy[team_index]['player-key'], function(team_player_key1, player_key) {
            team_player_key = team_player_key1;
        });
        team_player_key++;
        match.teams_copy[team_index]['player-key'][team_player_key] = parseInt(player_key);
        var html = '';
        html += '<div class="team-player-div">';
        html += '<button class="current-team-player-base" data-team-player-key="' + team_player_key + '" data-background-color="' + background_color + '" data-color="' + color + '" data-player-key="' + player_key + '">' + player_name + '</button>';
        html += '<span class="btn-player-delete-base" data-team-player-key="' + team_player_key + '" data-player-key="' + player_key + '" data-team-key="' + team_index + '">&nbsp;</span>';
        html += '</div>';
        $('#current-all-players-base .all-players-team-' + team_index).append(html);
        $('.choose-team-base').prop('checked', false);
        $('.new-player-base-div').css('visibility', 'hidden');
        $('.btn-steady-player-base[data-player-key="' + player_key + '"]').html('&nbsp;');
        $('.btn-steady-player-base[data-player-key="' + player_key + '"]').removeClass('picked');
        $('.btn-steady-player-base[data-player-key="' + player_key + '"]').removeClass('add');
        $('.btn-steady-player-base[data-player-key="' + player_key + '"]').prop('disabled', true);
        $('.btn-steady-player-base[data-player-key="' + player_key + '"]').addClass('disabled');
        match.players_copy[player_key]['name'] = player_name;
    });

    $('.btn-cancel-add-player-base').click(function() {
        var player_key = $('#added-player-base').attr('data-player-key');
        $('.choose-team-base').prop('checked', false);
        $('.new-player-base-div').css('visibility', 'hidden');
        $('.btn-steady-player-base[data-player-key="' + player_key + '"]').removeClass('picked');
    });

    $(document).on('click', '.btn-player-delete-base', function() {
        var team_player_key = $(this).attr('data-team-player-key');
        var player_key = $(this).attr('data-player-key');
        var team_index = $(this).attr('data-team-key');
        var data_variables_arr = new Array(team_player_key, player_key, team_index);
        var player_name = $(this).parent().find('.current-team-player-base').html();
        $('#confirm-dialog .content-of-confirm').html(getTextFromVar('REMOVE_QUESTION') + player_name + '?');
        $('.ui-dialog .ui-dialog-buttonpane button:first-child').html(getTextFromVar('REMOVE'));
        $('.ui-dialog .ui-dialog-buttonpane button:nth-child(2)').html(getTextFromVar('NO'));
        $('#confirm-dialog .content-of-confirm').attr('data-variables', JSON.stringify(data_variables_arr));
        $('#confirm-dialog .content-of-confirm').attr('data-function', 'deletePlayerBase');
        if ($('#define-teams .modal-content').find($('.dialog-of-confirm')).length == 0) {
            $('#define-teams .modal-content').append($('.dialog-of-confirm'));
        }
        $('#confirm-dialog').dialog('open');
        $('#define-teams .modal-content').append($('.ui-widget-overlay'));
    });

    $(document).on('click', '.team-player.head.team-player-current-base', function() {
        var team_index = $(this).attr('data-team-key');
        var team_name = $(this).html();
        $('.team-name-base[data-team-key="' + team_index + '"]').val(team_name);
        $(this).css('display', 'none');
        $('.team-player.head.team-player-current-base-change[data-team-key="' + team_index + '"]').css('display', 'block');
        $('.team-name-base[data-team-key="' + team_index + '"]').focus().select();
    });

    $(document).on('click', '.btn-cancel-change-team-name-base', function() {
        var team_index = $(this).attr('data-team-key');
        $('.team-player.head.team-player-current-base[data-team-key="' + team_index + '"]').css('display', 'block');
        $('.team-player.head.team-player-current-base-change[data-team-key="' + team_index + '"]').css('display', 'none');
    });

    $(document).on('click', '.btn-change-team-name-base', function() {
        var team_index = $(this).attr('data-team-key');
        var team_name = $('.team-name-base[data-team-key="' + team_index + '"]').val();
        if (team_name.trim() == '') {
            alert_answer = false;
            makeModalAlert(getTextFromVar('MUST_FILL_TEAM_NAME'), '', '#define-teams');
            alert_interval = setInterval(function() { checkAlertAnswer('(\'.team-name-base[data-team-key="' + team_index + '"]\')'); }, 200);
            return;
        }
        $('.team-player.head.team-player-current-base[data-team-key="' + team_index + '"]').html(team_name);
        $('.team-player.head.team-player-current-base-change[data-team-key="' + team_index + '"]').css('display', 'none');
        $('.team-player.head.team-player-current-base[data-team-key="' + team_index + '"]').css('display', 'block');
        match.teams_copy[team_index]['name'] = team_name;
    });

    $('.in-or-up-link.up').click(function() {
        $('.sign-in').css('display', 'none');
        $('.forgot-password').css('display', 'none');
        $('.send-activation-link').css('display', 'none');
        $('.sign-up').css('display', 'block');
    });

    $('.in-or-up-link.in').click(function() {
        $('.sign-up').css('display', 'none');
        $('.forgot-password').css('display', 'none');
        $('.send-activation-link').css('display', 'none');
        $('.sign-in').css('display', 'block');
    });

    $('.in-or-up-link.forgot').click(function() {
        $('.sign-in').css('display', 'none');
        $('.sign-up').css('display', 'none');
        $('.send-activation-link').css('display', 'none');
        $('.forgot-password').css('display', 'block');
    });

    $('.in-or-up-link.activation-link').click(function() {
        $('.sign-in').css('display', 'none');
        $('.sign-up').css('display', 'none');
        $('.forgot-password').css('display', 'none');
        $('.send-activation-link').css('display', 'block');
    });

    $('.language').focus(function() {
        prev_lang = $(this).val();
    });

    $('.language').change(function() {
        var lang = $(this).val();
        if (lang.trim() == '') {
            return;
        }
        $.ajax({
            url: 'set_language.php'
            , method: 'post'
            , data: {
                lang: lang
            }
            , dataType: 'json'
        })
            .done(function(data) {
                if (data[0] != 0) {
                    $('.language').each(function() {
                        $(this).val(prev_lang);
                    });
                    return;
                }
                $('.language').each(function() {
                    $(this).val(lang);
                });
                switchHtmlToLanguage(lang, prev_lang);
                return;
                dialog_title = $('.ui-dialog .ui-dialog-title').html();
                $('.ui-dialog .ui-dialog-title').html(data[4]);
                $('.ui-dialog .ui-dialog-buttonpane button:first-child').html(data[2]);
                $('.ui-dialog .ui-dialog-buttonpane button:nth-child(2)').html(data[3]);
                $('#confirm-dialog .content-of-confirm').html(data[1]);
                $('#confirm-dialog .content-of-confirm').attr('data-function', 'refreshPage');
                if ($('.main-container').find($('.dialog-of-confirm')).length == 0) {
                    $('.main-container').append($('.dialog-of-confirm'));
                }
                $('#confirm-dialog').dialog('open');
                $('.main-container').append($('.ui-widget-overlay'));
            });
    });

    $(document).on('click', '.scores-for-player', function() {
        var player_key = $(this).attr('data-player-key');
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $('.ball-potted[data-player-key="' + player_key + '"]').removeClass('show');
            return;
        }
        $(this).addClass('open');
        $('.ball-potted[data-player-key="' + player_key + '"]').addClass('show');
    });

    $('.help').click(function() {
        $('#frame-board-modal .modal-content').append($('.alert-of-modal-backdrop'));
        $('.alert-of-modal-backdrop').css('display', 'block');
        $('.instructions-div').css('display', 'block');
    });

    $('.cancel-instructions').click(function() {
        $('.alert-of-modal-backdrop').css('display', 'none');
        $('.instructions-div').css('display', 'none');
    });

    $('#clock-modal').click(function() {
        if (angles_window == null || angles_window.closed) {
            //angles_window = window.open('http://gidsite.net/angles/', 'angles_window');
        }
        else {
            angles_window.focus();
        }
    });

    $('.remove-x').click(function() {
        if (!match.frame_on) {
            return;
        }
        if (!match.all_balls_can_pot) {
            match.all_balls_can_pot = true;
            $(this).addClass('active');
            $('.fault').removeClass('active');
            match.fault = false;
            $('.btn-ball.red').removeClass('no-entry-red');
            $('.btn-ball').each(function() {
                if (!$(this).hasClass('red')) {
                    $(this).removeClass('no-entry-only-red');
                }
                $(this).removeClass('no-entry-fault');
                $(this).removeClass('no-entry-last-six-colors');
            });
            return;
        }
        $(this).removeClass('active');
        match.all_balls_can_pot = false;
        updateBalls();
    });

    $('#timer-modal').click(function() {
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
            clearInterval(match.frame_time_out);
            match.timer_blink = setInterval(blinkTimer, 800);
            return;
        }
        $('#timer-modal').removeClass('blink');
        var now  = new Date();
        var now_time = now.getTime() - match.time_diff;
        match.start_frame_time.setTime(now_time);
        clearInterval(match.timer_blink);
        $(this).addClass('on');
        startTimer();
    });

    $('.cancel-define-teams').click(function() {
        $temp_current_players_arr = new Object();
        $.each(match.teams, function(team_index, team_value) {
            $.each(match.teams[team_index]['player-key'], function(team_player_key, player_key) {
                $temp_current_players_arr[player_key] = '';
            });
            $('.btn-steady-player-base').each(function() {
                if ($temp_current_players_arr[$(this).attr('data-player-key')] != 'undefined') {
                    $(this).addClass('add');
                    $(this).prop('disabled', false);
                    $(this).removeClass('disabled');
                    return;
                }
                $(this).removeClass('add');
                $(this).prop('disabled', true);
                $(this).addClass('disabled');
            });
        });
    });

    $('.apply-define-teams').click(function() {
        $('#define-teams .modal-content').append($('#downloading-image-of-modal'));
        $('#downloading-image-of-modal').css('display', 'inline');
        $.ajax({
            url: 'update_players.php'
            , method: 'post'
            , data: {
                players: match.players_copy
                , teams: match.teams_copy
                , user_name: user_name_logged
                , num_of_reds_base: parseInt($('.num-of-reds-base').html())
            }
            , dataType: 'json'
        })
            .done(function(data) {
                $('#downloading-image-of-modal').css('display', 'none');
                if (data[0] != 0) {
                    alert(data[1]);
                    return;
                }
                alert (getTextFromVar('TEAMS_UPDATED_SUCCESSFULLY'));
                var teams_sort = new Array();
                var teams_copy_sort = new Array();
                teams_sort['A'] = new Array();
                teams_sort['B'] = new Array();
                teams_copy_sort['A'] = new Array();
                teams_copy_sort['B'] = new Array();
                $.each(match.teams_base, function(team_index, team_value) {
                    var count = 0;
                    $.each(match.teams[team_index]['player-key'], function(team_player_key, player_key) {
                        teams_sort[team_index][count] = match.players_copy[player_key]['name'];
                        count++;
                    });
                });
                $.each(match.teams_copy, function(team_index, team_value) {
                    var count = 0;
                    $.each(match.teams_copy[team_index]['player-key'], function(team_player_key, player_key) {
                        teams_copy_sort[team_index][count] = match.players_copy[player_key]['name'];
                        count++;
                    });
                });
                teams_sort['A'].sort();
                teams_sort['B'].sort();
                teams_copy_sort['A'].sort();
                teams_copy_sort['B'].sort();
                match.teams = JSON.parse(JSON.stringify(match.teams_copy));
                match.players = JSON.parse(JSON.stringify(match.players_copy));
                match.teams_base = JSON.parse(JSON.stringify(match.teams_copy));
                match.players_base = JSON.parse(JSON.stringify(match.players_copy));
                match.num_of_reds_base = parseInt($('.num-of-reds-base').html());
                match.num_of_reds = parseInt($('.num-of-reds-base').html());
                $('#define-teams').modal('hide');
                if (JSON.stringify(teams_sort['A']) != JSON.stringify(teams_copy_sort['A']) || JSON.stringify(teams_sort['B']) != JSON.stringify(teams_copy_sort['B'])) {
                    match.new_teams = true;
                    match.order_set = false;
                }
                $.each(match.teams, function(team_index, team_value) {
                    $('.teams #base-team-' + team_index).html('');
                    var html = '';
                    html += '<div class="team-player head">' + match.teams[team_index]['name'] + '</div>';
                    $.each(match.teams[team_index]['player-key'], function(team_player_key, player_key) {
                        html += '<div class="team-player">' + match.players[player_key]['name'] + '</div>';
                    });
                    $('.teams #base-team-' + team_index).html(html);
                    $('.btn-score-update[data-team-key="' + team_index + '"]').html(match.teams[team_index]['name']);
                });
                match.temp_teams = false;
                $('.temp-teams').css('visibility', 'hidden');
            });
    });

    $('#alert-confirm-dialog').dialog({
        autoOpen: false,
        width: '515px',
        resizable: false,
        draggable: false,
        //appendTo: '#frame-board-modal',
        //position: { my: 'left center', at: 'left top', of: '#frame-board-modal' },
        title: getTextFromVar('CONFIRM_BOX'),
        minHeight: 'none',
        dialogClass: 'no-close alert-dialog-of-confirm',
        modal: true,
        buttons: [
            {
                text: $('#alert-confirm-dialog .content-of-confirm').attr('data-answer-ok'),
                click : function () {
                    $(this).dialog('close');
                    //eval($('#confirm-dialog .content-of-confirm').attr('data-function'))(true);
                }
            }
        ]
    });

    $('#confirm-dialog').dialog({
        autoOpen: false,
        width: '515px',
        resizable: false,
        draggable: false,
        //appendTo: '#frame-board-modal',
        //position: { my: 'left center', at: 'left top', of: '#frame-board-modal' },
        title: getTextFromVar('CONFIRM_BOX'),
        minHeight: 'none',
        dialogClass: 'no-close dialog-of-confirm',
        modal: true,
        buttons: [
            {
                text: $('#confirm-dialog .content-of-confirm').attr('data-answer-yes'),
                click : function () {
                    $(this).dialog('close');
                    eval($('#confirm-dialog .content-of-confirm').attr('data-function'))(true);
                }
            },
            {
                text: $('#confirm-dialog .content-of-confirm').attr('data-answer-no'),
                click: function () {
                    $(this).dialog('close');
                    eval($('#confirm-dialog .content-of-confirm').attr('data-function'))(false);
                }
            }
        ]
    });

    $(window).on('popstate', function () {
        if (modal_is_open) {
            event.preventDefault();
            window.history.pushState('', null, './');
        }
    });
});

function updateBalls() {
    if (match.only_red) {
        $('.btn-ball').each(function () {
            if (!$(this).hasClass('red')) {
                $(this).addClass('no-entry-only-red');
            }
        });
    }
    else {
        $('.btn-ball').each(function () {
            if (!$(this).hasClass('red')) {
                $(this).removeClass('no-entry-only-red');
            }
        });
    }
    if (match.only_color) {
        $('.btn-ball.red').addClass('no-entry-red');
    }
    else {
        $('.btn-ball.red').removeClass('no-entry-red');
    }
    if (match.last_six_colors) {
        $('.btn-ball').each(function() {
            //if (!$(this).hasClass('red')) {
                $(this).addClass('no-entry-last-six-colors');
            //}
        });
        if(match.last_six_colors_2) {
            $('.btn-ball.yellow').removeClass('no-entry-last-six-colors');
        }
        else if (match.last_six_colors_3) {
            $('.btn-ball.green').removeClass('no-entry-last-six-colors');
        }
        else if (match.last_six_colors_4) {
            $('.btn-ball.brown').removeClass('no-entry-last-six-colors');
        }
        else if (match.last_six_colors_5) {
            $('.btn-ball.blue').removeClass('no-entry-last-six-colors');
        }
        else if (match.last_six_colors_6) {
            $('.btn-ball.pink').removeClass('no-entry-last-six-colors');
        }
        else {
            $('.btn-ball.black').removeClass('no-entry-last-six-colors');
        }
    }
    else {
        $('.btn-ball').each(function () {
            //if (!$(this).hasClass('red')) {
                $(this).removeClass('no-entry-last-six-colors');
            //}
        });
    }
    $('.btn-ball.red').removeClass('no-entry-fault');
    $('.btn-ball.yellow').removeClass('no-entry-fault');
    $('.btn-ball.green').removeClass('no-entry-fault');
}

function checkSnookerNeeded() {
    //if (match.last_six_colors_7) {
    //    return;
    //}
    var red_points = match.reds_left * 8;
    if (!match.last_six_colors || match.last_six_colors_2) {
        var color_points = 27;
    }
    else {
        if (match.last_six_colors_3) {
            var color_points = 25;
        }
        else if (match.last_six_colors_4) {
            var color_points = 22;
        }
        else if (match.last_six_colors_5) {
            var color_points = 18;
        }
        else if (match.last_six_colors_6) {
            var color_points = 13;
        }
        else {
            var color_points = 7;
        }
    }
    if (match.frame_score_arr[getOppositeTeamKey(match.current_player['team_key'])] > match.frame_score_arr[match.current_player['team_key']]) {
        if (match.red_potted && $('#current-player-circle').attr('data-team-key') == match.current_player['team_key']) {
            red_points += 7;
        }
    }
    match.points_left = red_points + color_points;
    if (match.frame_score_arr[match.current_player['team_key']] - match.frame_score_arr[getOppositeTeamKey(match.current_player['team_key'])] > match.points_left || match.frame_score_arr[getOppositeTeamKey(match.current_player['team_key'])] - match.frame_score_arr[match.current_player['team_key']] > match.points_left) {
        if (!match.need_snooker) {
            $('.frame-snooker-body').html(getTextFromVar('NEED_SNOOKER'));
            $('.frame-snooker-body').addClass('need-snooker');
            $('#frame-board-modal .modal-content').append($('.alert-of-modal-backdrop'));
            $('.alert-of-modal-backdrop').css('display', 'block');
            $('.frame-snooker-div.of-modal').css('display', 'block');
        }
        if (match.frame_score_arr[match.current_player['team_key']] > match.frame_score_arr[getOppositeTeamKey(match.current_player['team_key'])]) {
            var team_needs_snooker = getOppositeTeamKey(match.current_player['team_key']);
        }
        else {
            var team_needs_snooker = match.current_player['team_key'];
        }
        match.need_snooker = true;
        $('.score').each(function() {
            $(this).removeClass('snooker-situation');
        });
        $('.score-' + team_needs_snooker).addClass('snooker-situation');
    }
    else {
        if (match.need_snooker) {
            $('.frame-snooker-body').html(getTextFromVar('NO_SNOOKER_NEED'));
            $('.frame-snooker-body').removeClass('need-snooker');
            $('#frame-board-modal .modal-content').append($('.alert-of-modal-backdrop'));
            $('.alert-of-modal-backdrop').css('display', 'block');
            $('.frame-snooker-div.of-modal').css('display', 'block');
        }
        match.need_snooker = false;
        $('.score').each(function() {
            $(this).removeClass('snooker-situation');
        });
    }
}

function playPlayerSound() {
    var player_sound = document.getElementById('player-name-' + match.next_team_player);
    if (!player_sound) {
        return;
    }
    //player_sound.load();
    player_sound.play();
}

function playScoreSound(number) {
    var score_sound = document.getElementById('score-' + number);
    if (!score_sound) {
        return;
    }
    //$('#score-audio-source').attr('src', 'number_' + number + '.aac');
    //score_sound.load();
    score_sound.play();
}

function updateLocalStorage() {
    localStorage.setItem('match', JSON.stringify(match));
}

function restoreMatch(answer) {
    if (!answer) {
        return;
    }
    match = JSON.parse(localStorage.getItem('match'));
    $.each(match.teams, function(team_index, team_value) {
        $('.teams #temp-team-' + team_index).html('');
        var html = '';
        html += '<div class="team-player head">' + match.teams[team_index]['name'] + '</div>';
        $.each(match.teams[team_index]['player-key'], function(team_player_key, player_key) {
            html += '<div class="team-player">' + match.players[player_key]['name'] + '</div>';
        });
        $('.teams #temp-team-' + team_index).html(html);
        $('.btn-score-update[data-team-key="' + team_index + '"]').html(match.teams[team_index]['name']);
    });
    $('.total-score-A').html(match.total_score_arr['A']);
    $('.total-score-B').html(match.total_score_arr['B']);
    $('.num-of-reds').html(match.num_of_reds);
    if (match.temp_teams) {
        $('.temp-teams').css('visibility', 'visible');
    }
    $('#frame-board-modal .all-players .all-players-team').each(function () {
        $(this).html('');
    });
    $.each(match.teams, function (team_index, team_value) {
        var html = '';
        $.each(match.teams[team_index]['player-key'], function (team_player_key, player_key) {
            var player_name = match.players[player_key]['name'];
            var background_color = match.players[player_key]['background-color'];
            var color = match.players[player_key]['color'];
            html += '\r\n<button class="btn btn-player btn-team-player order" data-team-player-key="' + team_player_key + '" data-background-color="' + background_color + '" data-color="' + color + '" data-team-key="' + team_index + '" data-player-key="' + player_key + '" >' + player_name + '</button>';
        });
        $('#frame-board-modal .all-players .all-players-team-' + team_index).append(html);
    });
    if (match.frame_on) {
        //$('#frame-board-modal .all-players .all-players-team').each(function () {
        //    $(this).html('');
        //});
        //$.each(match.teams, function (team_index, team_value) {
        //    var html = '';
        //    $.each(match.teams[team_index]['player-key'], function (team_player_key, player_key) {
        //        var player_name = match.players[player_key]['name'];
        //        var background_color = match.players[player_key]['background-color'];
        //        var color = match.players[player_key]['color'];
        //        html += '\r\n<button class="btn btn-player btn-team-player order" data-team-player-key="' + team_player_key + '" data-background-color="' + background_color + '" data-color="' + color + '" data-team-key="' + team_index + '" data-player-key="' + player_key + '" >' + player_name + '</button>';
        //    });
        //    $('#frame-board-modal .all-players .all-players-team-' + team_index).append(html);
        //});
        $('#current-player-circle').attr('data-team-player-key', match.current_player['team_player_key']);
        $('#current-player-circle').attr('data-background-color', match.current_player['background_color']);
        $('#current-player-circle').attr('data-color', match.current_player['color']);
        $('#current-player-circle').attr('data-team-key', match.current_player['team_key']);
        $('#current-player-circle').attr('data-player-key', match.current_player['player_key']);
        $('#current-player-name').text(match.current_player['player_name']);
        if (match.current_player['team_key'] != '') {
            $.each(match.team_players_order_arr, function (team_key, team_value) {
                $.each(match.team_players_order_arr[team_key], function (team_player_key, player_value) {
                    if (typeof(match.team_players_order_arr[team_key][team_player_key]['data-next']) != 'undefined' && match.team_players_order_arr[team_key][team_player_key]['data-next'] != '' || match.first_team_player[team_key] == team_player_key || match.prev_team_player_arr[team_key] == team_player_key) {
                        $('.btn-team-player[data-team-key="' + team_key + '"][data-team-player-key="' + team_player_key + '"]').removeClass('order');
                        $('.btn-team-player[data-team-key="' + team_key + '"][data-team-player-key="' + team_player_key + '"]').prop('disabled', true);
                        $('.btn-team-player[data-team-key="' + team_key + '"][data-team-player-key="' + team_player_key + '"]').addClass('disabled');
                    }
                });
            });
        }
        else {
            $('.score-' + match.current_player['team_key']).addClass('current-team');
        }
        if (!match.current_player['show']) {
            $('#start').addClass('show');
            if (match.current_player['team_key'] == '') {
                $('.next-title').removeClass('show');
                $('.start-title').addClass('show');
            }
            else {
                $('.next-title span').text(match.current_player['player_name']);
                $('.start-title').removeClass('show');
                $('.next-title').addClass('show');
                $('.all-players .all-players-team-' + match.current_player['team_key']).addClass('invisible');
            }
        }
        else {
            $('.start-title').removeClass('show');
            $('#start').removeClass('show');
            $('.next-title').removeClass('show');
            $('.btn-played').addClass('visible');
            $('#current-player').addClass('show');
        }
        match.start_frame_time = new Date(match.start_frame_time);
        $('.reds-left').html(match.reds_left);
        if (match.fault) {
            $('.fault').addClass('active');
            $('.btn-ball.red').addClass('no-entry-fault');
            $('.btn-ball.yellow').addClass('no-entry-fault');
            $('.btn-ball.green').addClass('no-entry-fault');
        }
        if (match.made_snooker) {
            $('.made-snooker').addClass('active');
        }
        $('.score-A').html(match.frame_score_arr['A']);
        $('.score-B').html(match.frame_score_arr['B']);
        $('#frame-board-modal').modal('show');
        $('#timer-modal').addClass('on');
        startTimer();
    }
}

function disableFrame() {
    match.frame_on = false;
    $('.btn-team-player').each(function() {
        $(this).removeClass('order');
        $(this).prop('disabled', true);
        $(this).addClass('disabled');
    });
    $('.btn-ball').each(function() {
        $(this).removeClass('picked');
    });
    $('.btn-played').removeClass('visible');
    //$('.btn-stats').addClass('visible');
    $('#btn-close-play-modal').addClass('show');
    $('#btn-end-frame').addClass('hide');
    $('#btn-start-frame-modal').addClass('show');
    $('#btn-cancel-frame').addClass('hide');
    if (!match.order_set) {

    }
    $('#timer-modal').removeClass('on');
    match.first_player_of_frame_order_set_teams_equal = false;
    clearInterval(match.frame_time_out);
}

function getOppositeTeamKey(team_key) {
    return (team_key == 'B') ? 'A' : 'B';
}

function startNewFrame(answer) {
    //$('.ui-dialog .ui-dialog-title').html(dialog_title);
    //$('.ui-dialog .ui-dialog-buttonpane button:first-child').html(getTextFromVar('YES'));
    match.order_set = answer;
    if (match.new_teams) {
        $('#frame-board-modal .all-players .all-players-team').each(function() {
            $(this).html('');
        });
        match.team_players_order_arr['A'] = new Object();
        match.team_players_order_arr['B'] = new Object();
        $.each(match.teams, function (team_index, team_value) {
            var html = '';
            $.each(match.teams[team_index]['player-key'], function (team_player_key, player_key) {
                var player_name = match.players[player_key]['name'];
                var background_color = match.players[player_key]['background-color'];
                var color = match.players[player_key]['color'];
                var name_src = match.players[player_key]['name-src'];
                html += '\r\n<button class="btn btn-player btn-team-player order" data-team-player-key="' + team_player_key + '" data-background-color="' + background_color + '" data-color="' + color + '" data-team-key="' + team_index + '" data-player-key="' + player_key + '" data-player-mane-src="' + name_src + '" >' + player_name + '</button>';
                match.team_players_order_arr[team_index][team_player_key] = new Object();
                match.team_players_order_arr[team_index][team_player_key]['data-background-color'] = background_color;
                match.team_players_order_arr[team_index][team_player_key]['data-color'] = color;
                match.team_players_order_arr[team_index][team_player_key]['data-player-name'] = player_name;
                match.team_players_order_arr[team_index][team_player_key]['name-src'] = name_src;
                match.team_players_order_arr[team_index][team_player_key]['data-player-key'] = player_key;
                match.teams_players_count_arr[team_index]++;
            });
            $('#frame-board-modal .all-players .all-players-team-' + team_index).append(html);
        });
        match.teams_players_count_arr['A'] = Object.keys(match.teams['A']['player-key']).length;
        match.teams_players_count_arr['B'] = Object.keys(match.teams['B']['player-key']).length;
        match.teams_equal = match.teams_players_count_arr['A'] == match.teams_players_count_arr['B'];
        match.total_score_arr['A'] = 0;
        $('.total-score-A').html(match.total_score_arr['A']);
        match.total_score_arr['B'] = 0;
        $('.total-score-B').html(match.total_score_arr['B']);
        match.new_teams = false;
    }
    else {
        $('.btn-team-player').each(function() {
            $(this).addClass('order');
            $(this).prop('disabled', false);
            $(this).removeClass('disabled');
        });
    }
    $('.all-players .all-players-team').each(function() {
        $(this).removeClass('invisible');
    });
    if (!match.order_set) {
        $.each(match.team_players_order_arr, function (team_index, team_value) {
            match.last_team_player[team_index] = '';
            match.first_team_player[team_index] = '';
            $.each(match.team_players_order_arr[team_index], function (team_player_key, player_value) {
                delete match.team_players_order_arr[team_index][team_player_key]['data-next'];
            });
        });
        if (match.teams_equal) {
            match.inter_teams_players_order_arr['A'] = new Object();
            match.inter_teams_players_order_arr['B'] = new Object();
        }
    }
    else {
        if (match.teams_equal) {
            match.first_player_of_frame_order_set_teams_equal = true;
        }
    }
    match.red_potted = false;
    match.need_snooker = false;
    match.points_left = 0;
    $('.score').each(function() {
        $(this).removeClass('snooker-situation');
    });
    match.only_red = true;
    match.last_six_colors = false;
    for (var score = 2; score < 8; score++) {
        eval('match.last_six_colors_' + score + ' = false');
    }
    $('.remove-x').removeClass('active');
    match.all_balls_can_pot = false;
    match.only_color = false;
    match.prev_team_player_arr['A'] = '';
    match.prev_team_player_arr['B'] = '';
    match.next_players_count_arr['A'] = 0;
    match.next_players_count_arr['B'] = 0;
    match.add_score_arr['amount'] = '';
    match.add_score_arr['team'] = '';
    match.add_score_arr['data-player-key'] = '';
    match.add_score_arr['data-player-key-fault'] = '';
    match.add_score_arr['data-player-key-snooker-success'] = '';
    match.add_score_arr['data-player-key-snooker-failed'] = '';
    if (Object.keys(match.teams['A']['player-key']).length == 1) {
        var object_key = Object.keys(match.teams['A']['player-key']);
        var team_player_key = object_key[0];
        match.team_players_order_arr['A'][team_player_key]['data-next'] = team_player_key;
        match.prev_team_player_arr['A'] = team_player_key;
    }
    if (Object.keys(match.teams['B']['player-key']).length == 1) {
        var object_key = Object.keys(match.teams['B']['player-key']);
        var team_player_key = object_key[0];
        match.team_players_order_arr['B'][team_player_key]['data-next'] = team_player_key;
        match.prev_team_player_arr['B'] = team_player_key;
    }
    match.current_player['team_key'] = '';
    $('#current-player-circle').attr('data-team-key', '');
    match.frame_score_arr['A'] = 0;
    $('.score-A').html(match.frame_score_arr['A']);
    match.frame_score_arr['B'] = 0;
    $('.score-B').html(match.frame_score_arr['B']);
    $('.score-A').removeClass('current-team');
    $('.score-B').removeClass('current-team');
    match.reds_left = match.num_of_reds;
    $('.reds-left').html(match.reds_left);
    $('.fault').removeClass('active');
    match.fault = false;
    $('.made-snooker').removeClass('active');
    match.made_snooker = false;
    $('#start').addClass('show');
    $('.btn-undo').prop('disabled', true);
    $('.btn-undo').addClass('disabled');
    $('.next-title').removeClass('show');
    $('.start-title').addClass('show');
    match.current_player['show'] = false;
    $('#current-player').removeClass('show');
    match.frame_on = true;
    $('#btn-close-play-modal').removeClass('show');
    $('#btn-end-frame').removeClass('hide');
    $('#btn-start-frame-modal').removeClass('show');
    $('#btn-cancel-frame').removeClass('hide');
    $('.btn-ball').each(function() {
        if (!$(this).hasClass('red')) {
            $(this).addClass('no-entry-only-red');
            $(this).removeClass('no-entry-last-six-colors');
        }
    });
    $('.btn-ball.red').removeClass('no-entry-red');
    $('.btn-ball').each(function() {
        $(this).removeClass('no-entry-fault');
    });
    match.start_frame_time  = new Date();
    $('#timer-modal').addClass('on');
    $.each(match.teams, function(team_index, team_value) {
        $.each(match.teams[team_index]['player-key'], function(team_player_key, player_key) {
            match.players[player_key]['score'] = 0;
            match.players[player_key]['score-1'] = 0;
            match.players[player_key]['score-2'] = 0;
            match.players[player_key]['score-3'] = 0;
            match.players[player_key]['score-4'] = 0;
            match.players[player_key]['score-5'] = 0;
            match.players[player_key]['score-6'] = 0;
            match.players[player_key]['score-7'] = 0;
            match.players[player_key]['score-minus'] = 0;
            match.players[player_key]['snooker-made'] = 0;
            match.players[player_key]['snooker-success'] = 0;
            match.players[player_key]['snooker-failed'] = 0;
        });
    });
    startTimer();
}

function blinkScore(score) {
    if (typeof this.counter == 'undefined') {
        this.counter = 0;
    }
    this.counter++;
    if ($(score).hasClass('updated')) {
        $(score).removeClass('updated');
        if (this.counter == 4) {
            this.counter = 0;
            clearInterval(match.score_blink);
        }
        return;
    }
    $(score).addClass('updated');
}

function endFrame(answer) {
    //$('.ui-dialog .ui-dialog-title').html(dialog_title);
    //$('.ui-dialog .ui-dialog-buttonpane button:first-child').html(getTextFromVar('YES'));
    if (!answer) {
        return;
    }
    if (match.frame_score_arr['A'] > match.frame_score_arr['B']) {
        match.total_score_arr['A']++;
        $('.total-score-A').html(match.total_score_arr['A']);
        //$('.total-score-A').addClass('updated').delay(1000).queue(function() {
        //    $(this).removeClass('updated').dequeue();
        //});
        match.score_blink = setInterval(function() { blinkScore('.total-score-A'); }, 800);
    }
    else {
        match.total_score_arr['B']++;
        $('.total-score-B').html(match.total_score_arr['B']);
        //$('total-score-B').addClass('updated').delay(1000).queue(function() {
        //    $(this).removeClass('updated').dequeue();
        //});
        match.score_blink = setInterval(function() { blinkScore('.total-score-B'); }, 800);
    }
    disableFrame();
    updateLocalStorage();
}

function startTime() {
    var now  = new Date();
    var hour = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    $('#clock').html(hour + ':' + minutes);
    $('#clock-modal').html(hour + ':' + minutes);
    var t = setTimeout(startTime, 500);
}

function startTimer() {
    var now  = new Date();
    match.time_diff = now.getTime() - match.start_frame_time.getTime();
    var seconds_diff = Math.floor((match.time_diff) / 1000);
    var hour = Math.floor(seconds_diff / 3600);
    seconds_diff -= hour * 3600;
    var minutes = Math.floor(seconds_diff / 60);
    var seconds = seconds_diff - minutes * 60;
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    $('#timer-modal').html(hour + ':' + minutes + ':' + seconds);
    match.frame_time_out = setTimeout(startTimer, 500);
}

function blinkTimer() {
    if ($('#timer-modal').hasClass('blink')) {
        $('#timer-modal').removeClass('blink');
        return;
    }
    $('#timer-modal').addClass('blink');
}

function forgotPassword(answer) {
    //$('.ui-dialog .ui-dialog-buttonpane button:first-child').html(getTextFromVar('YES'));
    //$('.ui-dialog .ui-dialog-buttonpane button:nth-child(2)').html(getTextFromVar('NO'));
    if (!answer) {
        return;
    }
    var user_name = $('#user-name-forgot').val();
    if (user_name.trim() == '') {
        alert_answer = false;
        makeAlert(getTextFromVar('PLEASE_FILL_USERNAME'), '');
        alert_interval = setInterval(function() { checkAlertAnswer('(\'#user-name-forgot\')'); }, 200);
        return false;
    }
    $('#downloading-image').css('display', 'inline');
    $.ajax({
        url: 'send_reset_password_link.php'
        , method: 'post'
        , data: {
            user_name: user_name
        }
        , dataType: 'json'
    })
        .done(function(data) {
            $('#downloading-image').css('display', 'none');
            if (data[0] != 0) {
                alert(data[1]);
                return;
            }
            alert (getTextFromVar('IF_USER_REGISTERED_EMAIL_TO_RESET_PASSWORD_WAS_SENT'));
        });
}

function ActivateAccount(answer) {
    //$('.ui-dialog .ui-dialog-buttonpane button:first-child').html(getTextFromVar('YES'));
    //$('.ui-dialog .ui-dialog-buttonpane button:nth-child(2)').html(getTextFromVar('NO'));
    if (!answer) {
        return;
    }
    var user_name = $('#user-name-activation').val();
    if (user_name.trim() == '') {
        alert_answer = false;
        makeAlert(getTextFromVar('PLEASE_FILL_USERNAME'), '');
        alert_interval = setInterval(function() { checkAlertAnswer('(\'#user-name-activation\')'); }, 200);
        return false;
    }
    $('#downloading-image').css('display', 'inline');
    $.ajax({
        url: 'send_activate_account.php'
        , method: 'post'
        , data: {
            user_name: user_name
        }
        , dataType: 'json'
    })
        .done(function(data) {
            $('#downloading-image').css('display', 'none');
            if (data[0] != 0) {
                alert(data[1]);
                return;
            }
            alert (getTextFromVar('IF_USER_REGISTERED_EMAIL_TO_AVTIVATE_ACCOUNT_WAS_SENT'));
        });
}

function checkReset() {
    if (document.reset_password.password_change.value.trim() == '') {
        alert_answer = false;
        makeAlert(getTextFromVar('PLEASE_FILL_PASSWORD'), '');
        alert_interval = setInterval(function() { checkAlertAnswer(''); }, 200);
        return false;
    }
    if (document.reset_password.password_change.value.trim() != document.reset_password.password_change_retype.value.trim()) {
        alert_answer = false;
        makeAlert(getTextFromVar('NEED_TO_FILL_SAME_PASSWORD_TWICE'), '');
        alert_interval = setInterval(function() { checkAlertAnswer(''); }, 200);
        return false;
    }
    if (document.reset_password.password_change.value.trim().indexOf(' ') >= 0) {
        alert_answer = false;
        makeAlert(getTextFromVar('PASSWORD_NUST_NOT_CONTAIN_SPACES'), '');
        alert_interval = setInterval(function() { checkAlertAnswer(''); }, 200);
        return false;
    }
    if (document.reset_password.password_change.value.trim().length < 6 || document.reset_password.password_change.value.trim().length > 12) {
        alert_answer = false;
        makeAlert(getTextFromVar('PASSWORD_BETWEEN') + ' 6 ' + getTextFromVar('AND_BETWEEN') + ' 12 ' + getTextFromVar('CHARACTERS'), '');
        alert_interval = setInterval(function() { checkAlertAnswer(''); }, 200);
        return false;
    }
}

function testFunction(answer) {
    if (!answer) {
        return;
    }
}

function refreshPage(answer) {
    //$('.ui-dialog .ui-dialog-title').html(dialog_title);
    //$('.ui-dialog .ui-dialog-buttonpane button:first-child').html(getTextFromVar('YES'));
    $('.ui-dialog .ui-dialog-title').html(dialog_title);
    $('.ui-dialog .ui-dialog-buttonpane button:first-child').html(getTextFromVar('YES'));
    $('.ui-dialog .ui-dialog-buttonpane button:nth-child(2)').html(getTextFromVar('NO'));
    if (!answer) {
        return;
    }
    location.reload();
}

function cancelFrame(answer) {
    //$('.ui-dialog .ui-dialog-title').html(dialog_title);
    //$('.ui-dialog .ui-dialog-buttonpane button:first-child').html(getTextFromVar('YES'));
    if (!answer) {
        return;
    }
    disableFrame();
    updateLocalStorage();
}

function deletePlayer(answer) {
    $('.ui-dialog .ui-dialog-buttonpane button:first-child').html(getTextFromVar('YES'));
    $('.ui-dialog .ui-dialog-buttonpane button:nth-child(2)').html(getTextFromVar('NO'));
    if (!answer) {
        return;
    }
    var data_variables_arr = JSON.parse($('#confirm-dialog .content-of-confirm').attr('data-variables'));
    var data_variables_arr = JSON.parse($('#confirm-dialog .content-of-confirm').attr('data-variables'));
    var team_player_key = data_variables_arr[0];
    var player_key = data_variables_arr[1];
    var team_index = data_variables_arr[2];
    $('.btn-steady-player[data-player-key="' + player_key + '"]').html(getTextFromVar('AVAILABLE'));
    $('.btn-steady-player[data-player-key="' + player_key + '"]').addClass('add');
    $('.btn-steady-player[data-player-key="' + player_key + '"]').prop('disabled', false);
    $('.btn-steady-player[data-player-key="' + player_key + '"]').removeClass('disabled');
    match.players_copy[player_key]['name'] = '';
    delete match.teams_copy[team_index]['player-key'][team_player_key];
    $('.btn-player-delete[data-player-key="' + player_key + '"]').parent().remove();
}

function deletePlayerBase(answer) {
    $('.ui-dialog .ui-dialog-buttonpane button:first-child').html(getTextFromVar('YES'));
    $('.ui-dialog .ui-dialog-buttonpane button:nth-child(2)').html(getTextFromVar('NO'));
    if (!answer) {
        return;
    }
    var data_variables_arr = JSON.parse($('#confirm-dialog .content-of-confirm').attr('data-variables'));
    var data_variables_arr = JSON.parse($('#confirm-dialog .content-of-confirm').attr('data-variables'));
    var team_player_key = data_variables_arr[0];
    var player_key = data_variables_arr[1];
    var team_index = data_variables_arr[2];
    $('.btn-steady-player-base[data-player-key="' + player_key + '"]').html(getTextFromVar('AVAILABLE'));
    $('.btn-steady-player-base[data-player-key="' + player_key + '"]').addClass('add');
    $('.btn-steady-player-base[data-player-key="' + player_key + '"]').prop('disabled', false);
    $('.btn-steady-player-base[data-player-key="' + player_key + '"]').removeClass('disabled');
    match.players_copy[player_key]['name'] = '';
    delete match.teams_copy[team_index]['player-key'][team_player_key];
    $('.btn-player-delete-base[data-player-key="' + player_key + '"]').parent().remove();
}

function makeModalAlert(alert, div_to_display, alert_modal) {
    $(alert_modal + ' .modal-content').append($('.alert-of-modal-backdrop')).append($('.alert-div.of-modal'));
    $(alert_modal + ' .alert-of-modal-backdrop').css('display', 'block');
    $(alert_modal + ' .alert-div.of-modal .alert-body').html(alert);
    $(alert_modal + ' .alert-div.of-modal').css('display', 'block');
    if (div_to_display != '') {
        $(alert_modal + ' .alert-of-modal-backdrop').addClass('modal-on-modal');
    }
    $(alert_modal + ' .alert-div.of-modal .popup-footer .btn').attr('data-alert_div', alert_modal);
    $(alert_modal + ' .alert-div.of-modal .popup-footer .btn').attr('data-div-source', div_to_display);
}

function checkAlertAnswer(input_to_focus) {
    if (alert_answer) {
        clearInterval(alert_interval);
        if (input_to_focus != '') {
            $(eval(input_to_focus)).focus().select();
        }
    }
}

function makeAlert(alert, div_to_display) {
    $('.alert-backdrop').css('display', 'block');
    $('.alert-div.general .alert-body').html(alert);
    $('.alert-div.general').css('display', 'block');
    if (div_to_display != '') {
        $(alert_modal + ' .alert-backdrop').addClass('modal-on-modal');
    }
    $('.alert-div.general .popup-footer .btn').attr('data-div-source', div_to_display);
}

function getTextFromVar(text) {
    if (typeof(lang_const['gen'][text]) != 'undefined') {
        return lang_const['gen'][text];
    }
    return text;
}

function getTextFromVarClass(text) {
    if (typeof(lang_const['lang'][lang][text]) != 'undefined') {
        return lang_const['lang'][lang][text];
    }
    return text;
}

function switchHtmlToLanguage(lang, prev_lang) {
    $('body').removeClass();
}
