<?php

function get_mysql_connection(){
    $con = new mysqli('localhost', 'root', 'Ll04021995', 'transit');

    if(!$con) return false;
    if(!empty($con->connect_error)) return false;

    return $con;
} //RETURNS CONN OR FALSE