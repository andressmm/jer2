<?php
ini_set('display_errors', 0);
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$dni = isset($_GET['dni']) ? $_GET['dni'] : '';

if (!$dni) {
    echo json_encode(["success" => false, "message" => "Falta DNI."]);
    exit;
}

include('conexion.php');
if (!$link) { echo json_encode(["success" => false, "message" => "Error de conexión."]); exit; }

$dni = mysqli_real_escape_string($link, $dni);

$sql = "SELECT id, nombre, apellido, celular, contacto, direccion,localidad, casadepaz, quierevisita 
        FROM troquel 
        WHERE dataentry = '$dni'
        ORDER BY apellido ASC, nombre ASC";

$result = mysqli_query($link, $sql);

if (!$result) {
    echo json_encode(["success" => false, "message" => mysqli_error($link)]);
    $link->close();
    exit;
}

$rows = [];
while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}

$link->close();
echo json_encode($rows);
?>