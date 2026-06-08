<?php

header("Access-Control-Allow-Origin: https://jer-steel.vercel.app");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (isset($_POST['dni'])) {

    $dni = $_POST['dni'];

    include('conexion.php');

    $consulta = "SELECT id, nombre, apellido, rol, dni 
                 FROM users 
                 WHERE dni = '$dni'";

    $result = mysqli_query($link, $consulta);

    $datos = mysqli_fetch_assoc($result);

    echo json_encode($datos);

    $result->free();
    $link->close();
}
?>