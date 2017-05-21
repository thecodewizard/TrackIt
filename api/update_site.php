<?php
require_once "db_core.php";
header('Access-Control-Allow-Origin: *');

function save_site_to_database($ip, $country, $lat, $long, $host){
    //Create the needed variables
    $data = array();
    $data["success"] = false;
    $data["error"] = "";

    //Make the connection
    $con = get_mysql_connection();
    if($con === false){
        $data["error"] = "Connection failed at 'save site to database'";
        return $data;
    }

    //Check whether the given data is valid
    if(empty($ip) || empty($country) || empty($lat) || empty($long) || empty($host)
        || !is_string($ip) || !is_string($host))
        $data["error"] = "The given data is not valid";
    else{
        $ip = htmlentities($ip);    $ip = strval($ip);
        $host = htmlentities($host);    $host = strval($host);
    }

    //Temp validation
    if(!empty($data["error"])) return $data;

    //Check if the site is already written
    $sql = $con->query("SELECT COUNT(host) FROM sitesdev WHERE ip='".$ip."' AND host='".$host."'");
    $row = $sql->fetch_array(MYSQLI_NUM)[0];
    if($row != 0) {
        $data["error"] = "This site is already present in the database";
        $data["success"] = true;
        return $data;
    }

    //Save the site
    $stmt = $con->prepare("INSERT INTO sitesdev(ip, country, lat, lng, host) VALUES (?,?,?,?,?)");
    $stmt->bind_param('sssss', $ip, $country, $lat, $long, $host);
    $stmt->execute();

    //Check if the insertion went OK
    if($con->affected_rows !== 1){
        if($con->affected_rows == 0) $data["error"] = "No rows were affected";
        else $data["error"] = "Too many rows were affected";
    }

    $con->close();

    //Final Validation
    if(empty($data["error"])) $data["success"] = true;
    return $data;
}

//Make the needed variables
$data = array();
$data["success"] = false;
$data["error"] = "";

if(!empty($_POST["data"]) && !empty($_GET["sss"])){
    //Check the input
    $data = json_decode($_POST["data"], true);
    $sss = urldecode($_GET["sss"]);

    //Pass to database
    $result = save_site_to_database($data["ip"], $data["country"], $data["lat"],
        $data["long"], $data["host"]);

    //Check the response
    if(is_array($result)){
        if($result["success"]){
            http_response_code(200);
            $data["success"] = true;
        } else {
            http_response_code(409);
            $data["success"] = false;
            $data["error"] = $result["error"];
        }
    } else {
        http_response_code(500);
        $data["success"] = false;
        $data["error"] = "500 - INTERNAL SERVER ERROR";
    }
} else {
    http_response_code(400);
    $data["success"] = false;
    $data["error"] = "The API did not receive a valid request";
}

$data["success"] = strval($data["success"]);
$json = json_encode($data);
echo $json;