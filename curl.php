<?php
$handle = curl_init();
$url = 'https://jsonplaceholder.typicode.com/users';
curl_setopt($handle, CURLOPT_URL, $url);
curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
$output = curl_exec($handle);
curl_close($handle);
$users = json_decode($output, true);
//echo '<pre>';
//print_r($users);
//echo '</pre>';
foreach ($users as $user) {
    echo $user['id'] . ' - ';
    echo $user['name'] . ' - ';
    echo $user['email'];
    echo '<br />';
}
?>
