<?php

include('bd.php');
$link = new mysqli($ip,$usuario,$passw,$bbdd);
$link->set_charset("utf8mb4");
header("Access-Control-Allow-Origin: https://jer-steel.vercel.app");
?>