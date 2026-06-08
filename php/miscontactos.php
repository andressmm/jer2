<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (isset($_GET['dni'])) {

    $dni = $_GET['dni'];

    include('conexion.php');

    $sql = "SELECT * FROM troquel WHERE dataentry = '$dni' order by apellido ASC";

    $result = mysqli_query($link, $sql);

    if ($result) {
        $contactos = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $contactos[] = $row;
        }
        echo json_encode($contactos);
    } else {
        echo json_encode(["success" => false, "message" => "Error en la consulta: " . mysqli_error($link)]);
    }

    $link->close();
}
?>