<?php
$from_ajax = true;
require_once('include_files/init.php');
$db_link = Database::getConnection();
if ($db_link->connect_error) {
    echo json_encode(array(-1, getTextFromConst('CANNOT_CONNECT_TO_DB')));
    exit();
}
$logged_in = (isset($_SESSION['logged_in']['user']) && trim($_SESSION['logged_in']['user'] != '')) ? $_SESSION['logged_in']['user'] : false;
if ($logged_in) {
    $stmt = $db_link->prepare("
                            select *
                            from users u
                            where u.user_name = ?
                        ");
    $stmt->bind_param('s', $logged_in);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if (!$row) {
        unset($_SESSION['logged_in']);
        echo json_encode(array(-1, getTextFromConst('YOU_ARE_NOT_LOGGED_IN_REFRESH_PAGE')));
        exit();
    }
    $_SESSION['logged_in']['logged_in_last_used'] = time();
}
else {
    unset($_SESSION['logged_in']);
    echo json_encode(array(-1, getTextFromConst('YOU_ARE_NOT_LOGGED_IN_REFRESH_PAGE')));
    exit();
}
$user_name = $logged_in;
$user_name_from_ajax = '';
if (isset($_POST['user_name'])) {
    $user_name_from_ajax = trim($_POST['user_name']);
}
if ($user_name != $user_name_from_ajax) {
    echo json_encode(array(-1, getTextFromConst('YOU_ARE_LOGGED_IN_WITH_ANOTHER_USER_REFRESH_PAGE')));
    exit();
}
$db_link = Database::getConnection();
if ($db_link->connect_error) {
    echo json_encode(array(-1, getTextFromConst('CANNOT_CONNECT_TO_DB')));
    exit();
}
$players = array();
$teams = array();
$num_of_reds = '';
if (isset($_POST['players'])) {
    $players = $_POST['players'];
}
if (isset($_POST['teams'])) {
    $teams = $_POST['teams'];
}
if (isset($_POST['num_of_reds_base'])) {
    $num_of_reds = trim($_POST['num_of_reds_base']);
}
//echo json_encode(array(-1, $players));
//exit();
if ($num_of_reds == '') {
    echo json_encode(array(-1, 'Please fill number of red balls'));
    exit();
}
if (count($players) != 10) {
    echo json_encode(array(-1, getTextFromConst('ERROR_OCCURED_CANNOT_UPDATE_TEAMS')));
    exit();
}
if (count($teams) != 2) {
    echo json_encode(array(-1, getTextFromConst('ERROR_OCCURED_CANNOT_UPDATE_TEAMS')));
    exit();
}
for ($i = 1; $i <= 10; $i++) {
    if (!isset($players[$i])) {
        echo json_encode(array(-1, getTextFromConst('ERROR_OCCURED_CANNOT_UPDATE_TEAMS')));
        exit();
    }
}
$teams_temp = array('A', 'B');
foreach ($teams_temp as $team) {
    if (!isset($teams[$team])) {
        echo json_encode(array(-1, getTextFromConst('ERROR_OCCURED_CANNOT_UPDATE_TEAMS')));
        exit();
    }
}
$new_players = array();
$player_count = 0;
foreach ($teams as $team_key => $team) {
    if ($team['name'] == '') {
        echo json_encode(array(-1, getTextFromConst('ERROR_OCCURED_CANNOT_UPDATE_TEAMS')));
        exit();
    }
    $team_name = 'user_team_' . strtolower($team_key);
    $$team_name = $team['name'];
    if (isset($team['player-key'])) {
        foreach ($team['player-key'] as $player) {
            if (!isset($players[$player]) || !isset($players[$player]['name']) || $players[$player]['name'] == '') {
                echo json_encode(array(-1, getTextFromConst('ERROR_OCCURED_CANNOT_UPDATE_TEAMS')));
                exit();
            }
            $new_players[$player_count]['player-key'] = $player;
            $new_players[$player_count]['name'] = $players[$player]['name'];
            $new_players[$player_count]['team-key'] = $team_key;
            $player_count++;
        }
    }
}
$db_link->begin_transaction();
$stmt = $db_link->prepare("
                            update users
                            set team_a_name = ?
                            , team_b_name = ?
                            , num_of_reds = ?
                            where user_name = ?
                        ");
$stmt->bind_param('ssis', $user_team_a, $user_team_b, $num_of_reds, $user_name);
$stmt->execute();
if ($stmt->error) {
    $stmt->close();
    $db_link->rollback();
    echo json_encode(array(-1, getTextFromConst('ERROR_OCCURED_CANNOT_UPDATE_TEAMS')));
    exit();
}
$stmt->close();
$stmt = $db_link->prepare("
                            delete from players
                            where user_name = ?
                        ");
$stmt->bind_param('s', $user_name);
$stmt->execute();
if ($stmt->error) {
    $stmt->close();
    $db_link->rollback();
    echo json_encode(array(-1, getTextFromConst('ERROR_OCCURED_CANNOT_UPDATE_TEAMS')));
    exit();
}
$stmt->close();
$stmt = $db_link->prepare("
                            insert into players
                            (name, player_id, team_id, user_name)
                            values (?, ?, ?, ?)
                        ");
foreach ($new_players as $player) {
    $stmt->bind_param('siss', $player['name'], $player['player-key'], $player['team-key'], $user_name);
    $stmt->execute();
    if ($stmt->error) {
        $stmt->close();
        $db_link->rollback();
        echo json_encode(array(-1, getTextFromConst('ERROR_OCCURED_CANNOT_UPDATE_TEAMS')));
        exit();
    }
}
$stmt->close();
$db_link->commit();
echo json_encode(array(0, ''));
?>
