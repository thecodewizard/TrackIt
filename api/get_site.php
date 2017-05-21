<?php
require_once "db_core.php";
header('Access-Control-Allow-Origin: *');

if(!empty($_GET["ping"]) && $_GET["ping"] == "pong") die(date("hh:mm:ss"));

function get_sites_by_country($country, $not = false){
    //Make the needed variables
    $data = array(); $data["array"] = array();
    $data["success"] = false; $data["error"] = "";

    //Make the connection
    $con = get_mysql_connection();
    if($con === false){
        $data["error"] = "Connection failed at 'get sites by country'";
        return $data;
    }

    //Input Validation
    if(empty($country) || !is_string($country)){
        $data["error"] = "The Input is not valid";
        $data["success"] = false;
        return $data;
    }

    //Talk to the database.

    $query = ($not) ?
        "SELECT ip, country, lat, lng, host FROM sitesdev WHERE country !='".strval($country)."'"
        : "SELECT ip, country, lat, lng, host FROM sitesdev WHERE country ='".strval($country)."'";
    $sql = $con->query($query);

    //Read the results
    $result = array();
    while($row = $sql->fetch_array(MYSQLI_ASSOC)){
        $result[] = $row;
    }

    $con->close();
    $data["array"] = $result;
    $data["success"] = true;
    return $data;
}

//Make the needed variables
$data = array(); $data["array"] = array();
$data["success"] = false; $data["error"] = "";

if(!empty($_GET["country"]) && !empty($_GET["sss"])){
    //Check the input
    $country = urldecode($_GET["country"]);
    $sss = urldecode($_GET["sss"]);

    //Check for the NOT parameter
    $not = false;
    if(substr($country, 0, 1) == "!"){
        $not = true;
        $country = substr($country, 1, (strlen($country) - 1));
    }

    //Pass to database
    $result = get_sites_by_country($country, $not);

    //Parse result
    if(is_array($result)){
        if($result["success"]){
            http_response_code(200);
            $data["success"] = true;
            $data["array"] = $result["array"];
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