<?php
require_once('include_files/init.php');
$players = getPlayers($user_obj->getUserName());
$num_of_reds = $user_obj->getNumOfReds();
$players_from_app = array();
$teams_from_app = array();
$num_of_reds_from_app = 0;
if (!empty($_POST['players'])) {
    $players_from_app_str = $_POST['players'];
    $players_from_app = (array) json_decode($players_from_app_str);
    $players_from_app_temp = array();
//    echo '<pre style="display: block !important;">';
//    print_r($players_from_app);
//    echo '</pre>';
    foreach ($players_from_app as $player_from_app_key => $player_from_app) {
        $players_from_app_temp[$player_from_app_key] = (array) $player_from_app;
    }
//    echo '<pre style="display: block !important;">';
//    print_r($players_from_app_temp);
//    echo '</pre>';
    $players_from_app = array();
    foreach ($players_from_app_temp as $player_from_app_key => $player_from_app) {
        $players_from_app[$player_from_app_key] = $player_from_app;
    }
//    echo '<pre style="display: block !important;">';
//    print_r($players_from_app);
//    echo '</pre>';
    foreach ($players_from_app as $player_from_app_key => $player_from_app) {
        $players_from_app[$player_from_app_key]['team-key'] = '';
    }
    $teams_from_app_str = $_POST['teams'];
    $teams_from_app = (array) json_decode($teams_from_app_str);
    foreach ($teams_from_app as $team_from_app_key => $team_from_app) {
        $teams_from_app[$team_from_app_key] = (array) $teams_from_app[$team_from_app_key];
    }
    foreach ($teams_from_app as $team_from_app_key => $team_from_app) {
        foreach ($team_from_app as $player_key_key => $player_key) {
            if ($player_key_key == 'player-key') {
                $teams_from_app[$team_from_app_key][$player_key_key] = (array)$teams_from_app[$team_from_app_key][$player_key_key];
            }
        }
    }
    foreach ($teams_from_app as $team_from_app_key => $team_from_app) {
        foreach ($team_from_app['player-key'] as $player_key => $player) {
            $players_from_app[$player]['team-key'] = $team_from_app_key;
        }
    }
    $num_of_reds_from_app = $_POST['num_of_reds'];
    $num_of_reds = $num_of_reds_from_app;
//    Util::$players_from_app_str = $players_from_app_str;
//    Util::$teams_from_app_str = $teams_from_app_str;
//    Util::$num_of_reds_from_app = $num_of_reds_from_app;
}
//echo '<pre style="display: block;">';
//print_r($players_from_app);
//echo '</pre>';
//Util::makePre($players, 'players');
$teams = array();
if (Util::$post_from != 'app' || Util::$include_user || empty($players_from_app)) {
//require_once('init_teams.php');
    $teams['A']['name'] = $user_obj->getTeamAName();
    $teams['B']['name'] = $user_obj->getTeamBName();
}
else {
    $players = $players_from_app;
    $teams = $teams_from_app;
}
$teams['A']['player-key'] = array();
$teams['B']['player-key'] = array();
foreach ($players as $player_key => $player) {
    $player_team_key = $player['team-key'];
    if ($player_team_key != '') {
        $teams[$player_team_key]['player-key'][$player_key] = '';
    }
}
$help = getContentOfSubject('help');
//Util::makePre($teams, 'teams');
$site_title = constant('LangGeneralConstants::SITE_TITLE');
$meta_description = constant('LangGeneralConstants::META_DESCRIPTION');
require_once('include_files/start_html.php');
?>
<script>
    var angles_window = null;
    var match = new Object();
    match.next_team_player = '';
    match.red_potted = true;
    match.need_snooker = false;
    match.points_left = 0;
    match.time_diff = 0;
    match.only_red = true;
    match.last_six_colors = false;
    for (var score = 2; score < 8; score++) {
        eval('match.last_six_colors_' + score + ' = false');
    }
    match.all_balls_can_pot = false;
    match.score_blink = '';
    match.timer_blink = '';
    match.start_frame_time = '';
    match.frame_time_out = '';
    match.players = new Object();
    match.teams = new Object();
    match.first_team_player = new Object();
    match.last_team_player = new Object();
    match.prev_team_player_arr = new Object();
    match.team_players_order_arr = new Object();
    match.inter_teams_players_order_arr = new Object();
    match.next_players_count_arr = new Object();
    match.teams_players_count_arr = new Object();
    match.frame_score_arr = new Object();
    match.add_score_arr = new Object();
    match.total_score_arr = new Object();
    match.teams_equal = false;
    match.new_teams = true;
    match.order_set = false;
    match.temp_teams = false;
    match.first_player_of_frame_order_set_teams_equal = false;
    match.frame_on = true;
    match.num_of_reds = <?php echo $num_of_reds; ?>;
    match.num_of_reds_base = match.num_of_reds;
    match.reds_left = match.num_of_reds;
    match.fault = false;
    match.made_snooker = false;
    match.teams_copy = new Object();
    match.players_copy = new Object();
    match.players_base = new Object();
    match.teams_base = new Object();
    var teams_base_copy = new Object();
    var players_base_copy = new Object();
    match.current_player = new Object();
</script>
<?php
$player_audio = false;
$player_audio = true;
?>
<?php foreach ($players as $player_key => $player) : ?>
    <script>
        match.players[<?php echo $player_key; ?>] = new Object();
        match.players[<?php echo $player_key; ?>]['name'] = '<?php echo $player['name']; ?>';
        match.players[<?php echo $player_key; ?>]['background-color'] = '<?php echo $player['background-color']; ?>';
        match.players[<?php echo $player_key; ?>]['color'] = '<?php echo $player['color']; ?>';
        match.players[<?php echo $player_key; ?>]['spare'] = match.players[<?php echo $player_key; ?>]['name'] == '';
        match.players[<?php echo $player_key; ?>]['score'] = 0;
        match.players[<?php echo $player_key; ?>]['score-1'] = 0;
        match.players[<?php echo $player_key; ?>]['score-2'] = 0;
        match.players[<?php echo $player_key; ?>]['score-3'] = 0;
        match.players[<?php echo $player_key; ?>]['score-4'] = 0;
        match.players[<?php echo $player_key; ?>]['score-5'] = 0;
        match.players[<?php echo $player_key; ?>]['score-6'] = 0;
        match.players[<?php echo $player_key; ?>]['score-7'] = 0;
        match.players[<?php echo $player_key; ?>]['score-minus'] = 0;
        match.players[<?php echo $player_key; ?>]['snooker-made'] = 0;
        match.players[<?php echo $player_key; ?>]['snooker-success'] = 0;
        match.players[<?php echo $player_key; ?>]['snooker-failed'] = 0;
        match.players[<?php echo $player_key; ?>]['name-src'] = '<?php echo $player['name-src']; ?>';
    </script>
    <?php if ($player['name-src'] != '') : ?>
        <audio id="player-name-<?php echo $player_key; ?>" class="audio-player-name">
            <source id="player-name-audio-source" src="audio/player_names/<?php echo $player['name-src']; ?>.mp3" />
        </audio>
        <?php
        $player_audio = true;
        ?>
    <?php endif; ?>
<?php endforeach; ?>
<div class="container-fluid">
    <div class="container main-container">
        <div class="row teams base-teams">
            <?php if (Util::$post_from != 'app' || Util::$include_user) : ?>
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h2 class="main-title constant-teams-title"><?php echo getTextFromConstClass('CONSTANT_TEAMS_COMPOSITIONS'); ?></h2>
                </div>
            <?php endif; ?>
            <?php foreach ($teams as $team_key => $team) : ?>
                <script>
                    match.teams['<?php echo $team_key; ?>'] = new Object();
                    match.teams['<?php echo $team_key; ?>']['player-key'] = new Object();
                    match.first_team_player['<?php echo $team_key; ?>'] = '';
                    match.last_team_player['<?php echo $team_key; ?>'] = '';
                    match.prev_team_player_arr['<?php echo $team_key; ?>'] = '';
                    match.team_players_order_arr['<?php echo $team_key; ?>'] = new Object();
                    match.inter_teams_players_order_arr['<?php echo $team_key; ?>'] = new Object();
                    match.next_players_count_arr['<?php echo $team_key; ?>'] = 0;
                    match.frame_score_arr['<?php echo $team_key; ?>'] = 0;
                    match.total_score_arr['<?php echo $team_key; ?>'] = 0;
                </script>
                <?php if (Util::$post_from != 'app' || Util::$include_user) : ?>
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 team" id="base-team-<?php echo $team_key; ?>">
                        <div class="team-player head">
                            <?php echo $team['name']; ?>
                        </div>
                        <script>match.teams['<?php echo $team_key; ?>']['name'] = '<?php echo $team['name']; ?>';</script>
                        <?php if (isset($team['player-key'])) : ?>
                            <?php $player_count = 0; ?>
                            <?php foreach ($team['player-key'] as $player_key => $player) : ?>
                                <script>
                                    match.teams['<?php echo $team_key ?>']['player-key'][<?php echo $player_count; ?>] = <?php echo $player_key; ?>;
                                </script>
                                <div class="team-player">
                                    <?php echo $players[$player_key]['name']; ?>
                                </div>
                                <?php $player_count++; ?>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                <?php else : ?>
                    <script>match.teams['<?php echo $team_key; ?>']['name'] = '<?php echo $team['name']; ?>';</script>
                    <?php if (isset($team['player-key'])) : ?>
                        <?php $player_count = 0; ?>
                        <?php foreach ($team['player-key'] as $player_key => $player) : ?>
                            <script>
                                match.teams['<?php echo $team_key ?>']['player-key'][<?php echo $player_count; ?>] = <?php echo $player_key; ?>;
                            </script>
                            <?php $player_count++; ?>
                        <?php endforeach; ?>
                    <?php endif; ?>
                <?php endif; ?>
            <?php endforeach; ?>
            <script>
                match.teams_base = JSON.parse(JSON.stringify(match.teams));
                match.players_base = JSON.parse(JSON.stringify(match.players));
            </script>
        </div>
        <?php if (Util::$post_from != 'app' || Util::$include_user) : ?>
            <div class="no-players-div col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12<?php if (count($teams['A']['player-key']) != 0 || count($teams['B']['player-key']) != 0) { echo ' hide'; } ?>">
                <h4 class="no-players"><?php echo getTextFromConst('NO_PLAYERS_DEFINED_FOR_TEAMS'); ?></h4>
            </div>
            <?php if ($user_obj->getUserName() != '') : ?>
                <div class="define-teams-div btn-main-div">
                    <button id="btn-define-teams" class="btn btn-define-teams btn-main" data-toggle="modal" data-target="#define-teams" data-whatever="@mdo" data-backdrop="static" data-keyboard="false"><?php echo getTextFromConst('DEFINE_CONSTANT_TEAMS'); ?></button>
                </div>
            <?php else : ?>
                <div class="no-define-div col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h4 class="no-define"><?php echo getTextFromConst('AFTER_LOGIN_YOU_CAN_DEFINE_CONSTANT_TEAMS'); ?></h4>
                </div>
            <?php endif; ?>
            <hr class="define-teams-hr">
        <?php endif; ?>
        <div class="new-frame-div btn-main-div">
            <button id="btn-start-frame" class="btn btn-start-frame start-new-frame btn-main" data-toggle="modal" data-target="#frame-board-modal" data-whatever="@mdo" data-backdrop="static" data-keyboard="false"><?php echo getTextFromConst('NEW_FRAME'); ?></button>
        </div>
        <?php if (Util::$post_from != 'app' || Util::$include_user) : ?>
            <div class="new-teams-div btn-main-div">
                <button id="btn-new-teams" class="btn btn-new-teams btn-main" data-toggle="modal" data-target="#new-teams" data-whatever="@mdo" data-backdrop="static" data-keyboard="false"><?php echo getTextFromConst('CHANGE_TEAMS_TEMPORARLY'); ?></button>
            </div>
        <?php else : ?>
            <div class="new-teams-div btn-main-div">
                <button id="btn-new-teams" class="btn btn-new-teams btn-main" data-toggle="modal" data-target="#new-teams" data-whatever="@mdo" data-backdrop="static" data-keyboard="false"><?php echo getTextFromConst('DEFINE_TEAMS'); ?></button>
            </div>
        <?php endif; ?>
        <div class="restore-div btn-main-div">
            <button id="btn-restore" class="btn btn-restore btn-main"><?php echo getTextFromConst('RESTORE_MATCH'); ?></button>
        </div>
        <div class="row teams temp-teams<?php if (Util::$post_from != 'app' || Util::$include_user) { echo ' from-internal'; } ?>">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <?php if (Util::$post_from != 'app' || Util::$include_user) : ?>
                    <h2 class="main-title constant-teams-title"><?php echo getTextFromConst('TEMPORARY_TEAMS_COMPOSITIONS'); ?></h2>
                <?php else : ?>
                    <h2 class="main-title constant-teams-title"><?php echo getTextFromConst('TEAMS_COMPOSITIONS'); ?></h2>
                <?php endif; ?>
            </div>
            <?php foreach ($teams as $team_key => $team) : ?>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 team" id="temp-team-<?php echo $team_key; ?>">
                    <div class="team-player head">
                        <?php echo $team['name']; ?>
                    </div>
                    <?php if (isset($team['player-key'])) : ?>
                        <?php $player_count = 0; ?>
                        <?php foreach ($team['player-key'] as $player_key => $player) : ?>
                            <div class="team-player">
                                <?php echo $players[$player_key]['name']; ?>
                            </div>
                            <?php $player_count++; ?>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>
<div class="modal fade" id="frame-board-modal" tabindex="-1" role="dialog" aria-labelledby="playeModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">
                    <?php echo getTextFromConst('MATCH_BOARD'); ?>
                </h2>
                <?php foreach ($teams as $team_key => $team) : ?>
                    <div class="total-score btn total-score-<?php echo $team_key; ?>" data-team-key="<?php echo $team_key; ?>">0</div>
                <?php endforeach; ?>
            </div>
            <div class="modal-body form-horizontal">
                <div class="all-players">
                    <?php foreach ($teams as $team_key => $team) : ?>
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 all-players-team all-players-team-<?php echo $team_key; ?>">
                            <button class="btn btn-player btn-team-player"></button>
                        </div>
                    <?php endforeach; ?>
                    <div class="current-player" id="current-player">
                        <div class="current-player-circle" data-team-player-key="" data-background-color="" data-color="" data-team-key="" data-player-key="" id="current-player-circle">
                            <div class="current-player-name" id="current-player-name">

                            </div>
                        </div>
                    </div>
                    <div class="start" id="start">
                        <h4 class="start-title"><?php echo getTextFromConst('WHO_STARTS'); ?><br />?</h4>
                        <h4 class="next-title"><?php echo getTextFromConst('WHOS_AFTER'); ?><span></span><br />?</h4>
                    </div>
                </div>
                <div class="played">
                    <button class="btn fault"><?php echo getTextFromConst('FOUL_SHORT'); ?></button>
                    <button type="button" class="btn btn-played" id="btn-played"><?php echo getTextFromConst('I_PLAYED'); ?></button>
                    <button class="btn made-snooker"><?php echo getTextFromConst('SNOOKER_SHORT'); ?></button>
                </div>
                <div class="balls">
                    <div class="balls-circle">
                        <button class="btn btn-ball black" data-score="7">7</button>
                        <button class="btn btn-ball pink" data-score="6">6</button>
                        <button class="btn btn-ball blue" data-score="5">5</button>
                        <button class="btn btn-ball brown" data-score="4">4</button>
                        <button class="btn btn-ball green" data-score="3">3</button>
                        <button class="btn btn-ball yellow" data-score="2">2</button>
                        <button class="btn btn-ball red" data-score="1">1</button>
                    </div>
                    <?php foreach ($teams as $team_key => $team) : ?>
                        <div class="score btn score-<?php echo $team_key; ?>" data-team-key="<?php echo $team_key; ?>">0</div>
                    <?php endforeach; ?>
                    <div class="clock-modal" id="clock-modal"></div>
                    <div class="clock-modal timer-modal" id="timer-modal">16:53</div>
                    <div class="help" id="help"><?php echo getTextFromConst('RULES'); ?></div>
                    <div class="remove-x" id="remove-x"><?php echo getTextFromConst('REMOVE_X'); ?></div>
                    <a id="screen-saver-modal" class="btn-screen-saver-modal screen-saver btn"><?php echo getTextFromConst('DISABLE_SCREEN_OFF'); ?></a>
                    <button class="btn reds-left"><?php echo $num_of_reds; ?></button>
                    <button type="button" class="btn btn-stats" id="btn-stats"><?php echo getTextFromConst('STATISTICS'); ?></button>
                    <button class="btn btn-mute btn-mute-player-name<?php if (!$player_audio) { echo ' no-players-audio'; } ?>" id="btn-mute-player-name">&nbsp;</button>
                    <button class="btn btn-mute btn-mute-score" id="btn-mute-score">&nbsp;</button>
                </div>
                <div class="score-update">
                    <?php foreach ($teams as $team_key => $team) : ?>
                        <button class="btn btn-score-update" data-team-key="<?php echo $team_key; ?>"><?php echo $team['name']; ?></button>
                    <?php endforeach; ?>
                </div>
            </div>
            <div class="modal-footer">
                <div class="btns">
                    <button class="btn btn-default btn-undo" id="btn-undo"><?php echo getTextFromConst('CANCEL_ADD'); ?></button>
                    <button data-sumbit="" class="btn btn-first btn-end-frame" id="btn-end-frame"><?php echo getTextFromConst('END_FRAME'); ?></button>
                    <button data-sumbit="" class="btn btn-first btn-start-frame-modal start-new-frame" id="btn-start-frame-modal"><?php echo getTextFromConst('NEW_FRAME'); ?></button>
                    <button data-sumbit="" class="btn btn-second btn-default btn-cancel-frame" id="btn-cancel-frame"><?php echo getTextFromConst('CANCEL_FRAME'); ?></button>
                    <button type="button" class="btn btn-second btn-default btn-close-play-modal" id="btn-close-play-modal" data-dismiss="modal"><?php echo getTextFromConst('CLOSE'); ?></button>
                </div>
            </div>
            <div class="show-data-div instructions-div of-modal">
                <div>
                    <div class="show-data-header instructions-header"><?php echo $help->{'title_' . LangGeneralConstants::FONTS_LANGUAGE}; ?></div>
                    <div class="show-data-body instructions-body">
                        <?php echo $help->{'content_' . LangGeneralConstants::FONTS_LANGUAGE}; ?>
                    </div>
                    <footer class="popup-footer show-data-footer">
                        <button type="button" class="btn btn-default cancel-instructions"><?php echo getTextFromConst('CLOSE'); ?></button>
                    </footer>
                </div>
            </div>
            <div class="fill-data-div update-score-div of-modal">
                <div>
                    <div class="fill-data-header update-score-header"><?php echo getTextFromConst('SCORE_FILLING'); ?></div>
                    <div class="fill-data-body update-score-body">
                        <input type="tel" class="input-score update-input-score" value="" data-team-key="" pattern="\d*" />
                        <input type="hidden" class="input-for-score-focus" value="" />
                    </div>
                    <footer class="popup-footer fill-data-footer">
                        <button class="btn btn-first btn-primary update-total-score"><?php echo getTextFromConst('OK'); ?></button>
                        <button class="btn btn-first btn-primary update-frame-score"><?php echo getTextFromConst('OK'); ?></button>
                        <button type="button" class="btn btn-second btn-default cancel-update-score"><?php echo getTextFromConst('CLOSE'); ?></button>
                    </footer>
                </div>
            </div>
            <div class="fill-data-div update-reds-div of-modal">
                <div>
                    <div class="fill-data-header update-reds-header"><?php echo getTextFromConst('NUM_OF_REDS_LEFT_FILLING'); ?></div>
                    <div class="fill-data-body update-reds-body">
                        <input type="tel" class="input-reds update-input-score" value="" pattern="\d*" />
                    </div>
                    <footer class="popup-footer fill-data-footer">
                        <button class="btn btn-first btn-primary update-frame-reds"><?php echo getTextFromConst('OK'); ?></button>
                        <button type="button" class="btn btn-second btn-default cancel-update-reds"><?php echo getTextFromConst('CLOSE'); ?></button>
                    </footer>
                </div>
            </div>
            <div class="show-data-div frame-stats-div of-modal">
                <div>
                    <div class="show-data-header frame-stats-header"><?php echo getTextFromConst('FRAME_SUMMARY'); ?></div>
                    <div class="show-data-body frame-stats-body">
                    </div>
                    <footer class="popup-footer show-data-footer">
                        <button type="button" class="btn btn-default cancel-frame-stats"><?php echo getTextFromConst('CLOSE'); ?></button>
                    </footer>
                </div>
            </div>
            <div class="show-data-div frame-snooker-div of-modal">
                <div>
                    <div class="show-data-header frame-snooker-header"><?php echo getTextFromConst('SNOOKER_NOTIFICATION'); ?></div>
                    <div class="show-data-body frame-snooker-body">
                    </div>
                    <footer class="popup-footer show-data-footer">
                        <button type="button" class="btn btn-default cancel-frame-snooker"><?php echo getTextFromConst('CLOSE'); ?></button>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="new-teams" tabindex="-1" role="dialog" aria-labelledby="new-teams">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">
                    <?php echo getTextFromConst('CHANGE_TEAMS_TEMPORARLY'); ?>
                </h2>
            </div>
            <div class="modal-body form-horizontal">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 spare-players">
                    <?php foreach ($players as $player_key => $player) : ?>
                        <button class="btn btn-player btn-steady-player spare-player add" data-player-key="<?php echo $player_key; ?>" data-background-color="<?php echo $player['background-color']; ?>" data-color="<?php echo $player['color']; ?>"><?php if ($player['team-key'] == '') { echo getTextFromConst('AVAILABLE'); } else { echo '&nbsp;'; } ?></button>
                    <?php endforeach; ?>
                </div>
                <div class="new-player-div">
                    <input type="text" value="" class="new-player" placeholder="<?php echo getTextFromConst('PLAYER_NAME'); ?>" />
                    <?php foreach ($teams as $team_key => $team) : ?>
                        <div class="choose-team-div" data-team-key="<?php echo $team_key; ?>">
                            <input type="radio" name="choose-team" class="choose-team" value="<?php echo $team_key; ?>" />
                            <label for="choose-team"><?php echo $team['name']; ?></label>
                        </div>
                    <?php endforeach; ?>
                    <div class="add-player-div">
                        <button type="button" class="btn btn-first btn-add-player" id="btn-add-player"><?php echo getTextFromConst('ADD'); ?></button>
                        <button type="button" class="btn btn-second btn-default btn-cancel-add-player"><?php echo getTextFromConst('CANCEL'); ?></button>
                    </div>
                    <input type="hidden" id="added-player" value="" data-player-key="" data-background-color="" data-color="" />
                </div>
                <div class="num-of-reds-div">
                    <div class="num-of-reds-title"><?php echo getTextFromConst('CHOOSE_NUM_OF_REDS_PER_PRAME'); ?></div>
                    <button class="btn num-of-reds"><?php echo $num_of_reds; ?></button>
                </div>
                <hr>
                <div class="all-players-new-teams all-players-current" id="current-all-players">
                    <?php foreach ($teams as $team_key => $team) : ?>
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 all-players-team all-players-team-<?php echo $team_key; ?>">
                            <div class="team-player head team-player-current" data-team-key="<?php echo $team_key; ?>">
                            </div>
                            <div class="team-player head team-player-current-change" data-team-key="<?php echo $team_key; ?>">
                                <button type="button" class="btn btn-first btn-change-team-name" data-team-key="<?php echo $team_key; ?>"><?php echo getTextFromConst('OK'); ?></button>
                                <button type="button" class="btn btn-second btn-default btn-cancel-change-team-name" data-team-key="<?php echo $team_key; ?>"><?php echo getTextFromConst('CANCEL'); ?></button>
                                <input type="text" value="" class="team-name" data-team-key="<?php echo $team_key; ?>" placeholder="<?php echo getTextFromConst('TEAM_NAME'); ?>" />
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                <div class="players-voice-div">
                    <?php
                    $dir = 'audio/player_names';
                    $files = scandir($dir);
                    ?>
                    <button type="button" class="btn btn-first btn-save-player-voice" id="save-player-voice"><?php echo getTextFromConst('OK'); ?></button>
                    <select class="players-voice">
                        <option value="">בחר שם שחקן</option>
                        <?php foreach ($files as $file) : ?>
                            <?php
                            if ($file == '.' || $file == '..') {
                                continue;
                            }
                            $file_name_arr = explode('.', $file);
                            unset($file_name_arr[count($file_name_arr) - 1]);
                            $file_name = implode('.', $file_name_arr);
                            ?>
                            <option value="<?php echo $file_name; ?>"><?php echo $file_name; ?></option>
                        <?php endforeach; ?>
                    </select>
                    <button type="button" class="btn btn-second btn-default btn-cancel-save-player-voice"><?php echo getTextFromConst('CANCEL'); ?></button>
                    <input type="hidden" id="picked-player" value="" data-player-key="" data-background-color="" data-color="" />
                </div>
            </div>
            <div class="modal-footer">
                <div class="btns">
                    <button data-sumbit="form" class="btn btn-first btn-primary apply-new-teams"><?php echo getTextFromConst('OK'); ?></button>
                    <button type="button" class="btn btn-second btn-default cancel-new-teams" data-dismiss="modal"><?php echo getTextFromConst('CANCEL'); ?></button>
                </div>
            </div>
            <div class="fill-data-div update-num-of-reds-div of-modal">
                <div>
                    <div class="fill-data-header update-reds-header"><?php echo getTextFromConst('NUM_OF_RED_IN_FRAME_FILLING'); ?></div>
                    <div class="fill-data-body update-reds-body">
                        <input type="tel" class="input-num-of-reds update-input-score" value="" pattern="\d*" />
                    </div>
                    <footer class="popup-footer fill-data-footer">
                        <button class="btn btn-first btn-primary update-frame-num-of-reds"><?php echo getTextFromConst('OK'); ?></button>
                        <button type="button" class="btn btn-second btn-default cancel-update-num-of-reds"><?php echo getTextFromConst('CLOSE'); ?></button>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</div>
<?php if ($user_obj->getUserName() != '') : ?>
    <div class="modal fade" id="define-teams" tabindex="-1" role="dialog" aria-labelledby="define-teams">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">
                        <?php echo getTextFromConst('DEFINE_CONSTANT_TEAMS'); ?>
                    </h2>
                </div>
                <div class="modal-body form-horizontal">
                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 spare-players">
                        <?php foreach ($players as $player_key => $player) : ?>
                            <button class="btn btn-player btn-steady-player-base spare-player add" data-player-key="<?php echo $player_key; ?>" data-background-color="<?php echo $player['background-color']; ?>" data-color="<?php echo $player['color']; ?>"><?php if ($player['team-key'] == '') { echo getTextFromConst('AVAILABLE'); } else { echo '&nbsp;'; } ?></button>
                        <?php endforeach; ?>
                    </div>
                    <div class="new-player-base-div">
                        <input type="text" value="" class="new-player-base" placeholder="<?php echo getTextFromConst('PLAYER_NAME'); ?>" />
                        <?php foreach ($teams as $team_key => $team) : ?>
                            <div class="choose-team-base-div" data-team-key="<?php echo $team_key; ?>">
                                <input type="radio" name="choose-team-base" class="choose-team-base" value="<?php echo $team_key; ?>" />
                                <label for="choose-team-base"><?php echo $team['name']; ?></label>
                            </div>
                        <?php endforeach; ?>
                        <div class="add-player-div-base">
                            <button type="button" class="btn btn-first btn-add-player-base" id="btn-add-player-base"><?php echo getTextFromConst('ADD'); ?></button>
                            <button type="button" class="btn btn-second btn-default btn-cancel-add-player-base"><?php echo getTextFromConst('CANCEL'); ?></button>
                        </div>
                        <input type="hidden" id="added-player-base" value="" data-player-key="" data-background-color="" data-color="" />
                    </div>
                    <div class="num-of-reds-div">
                        <div class="num-of-reds-title"><?php echo getTextFromConst('CHOOSE_NUM_OF_REDS_PER_PRAME'); ?></div>
                        <button class="btn num-of-reds-base"><?php echo $num_of_reds; ?></button>
                    </div>
                    <hr>
                    <div class="all-players-define-teams all-players-current" id="current-all-players-base">
                        <?php foreach ($teams as $team_key => $team) : ?>
                            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 all-players-team all-players-team-<?php echo $team_key; ?>">
                                <div class="team-player head team-player-current-base" data-team-key="<?php echo $team_key; ?>">
                                </div>
                                <div class="team-player head team-player-current-base-change" data-team-key="<?php echo $team_key; ?>">
                                    <button type="button" class="btn btn-first btn-change-team-name-base" data-team-key="<?php echo $team_key; ?>"><?php echo getTextFromConst('OK'); ?></button>
                                    <button type="button" class="btn btn-second btn-default btn-cancel-change-team-name-base" data-team-key="<?php echo $team_key; ?>"><?php echo getTextFromConst('CANCEL'); ?></button>
                                    <input type="text" value="" class="team-name-base" data-team-key="<?php echo $team_key; ?>" placeholder="<?php echo getTextFromConst('TEAM_NAME'); ?>" />
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="btns">
                        <button data-sumbit="form" class="btn btn-first btn-primary apply-define-teams"><?php echo getTextFromConst('OK'); ?></button>
                        <button type="button" class="btn btn-second btn-default cancel-define-teams" data-dismiss="modal"><?php echo getTextFromConst('CANCEL'); ?></button>
                    </div>
                </div>
                <div class="fill-data-div update-num-of-reds-base-div of-modal">
                    <div>
                        <div class="fill-data-header update-reds-header"><?php echo getTextFromConst('NUM_OF_RED_IN_FRAME_FILLING'); ?></div>
                        <div class="fill-data-body update-reds-body">
                            <input type="tel" class="input-num-of-reds-base update-input-score" value="" pattern="\d*" />
                        </div>
                        <footer class="popup-footer fill-data-footer">
                            <button class="btn btn-first btn-primary update-frame-num-of-reds-base"><?php echo getTextFromConst('OK'); ?></button>
                            <button type="button" class="btn btn-second btn-default cancel-update-num-of-reds-base"><?php echo getTextFromConst('CLOSE'); ?></button>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php endif; ?>
<?php require_once('include_files/end_html.php'); ?>
