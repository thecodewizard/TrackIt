<?php

function get_mysql_connection(){
    $con = new mysqli('localhost', 'root', '####', 'transit');

    if(!$con) return false;
    if(!empty($con->connect_error)) return false;

    return $con;
} //RETURNS CONN OR FALSE
