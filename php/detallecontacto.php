<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$id) {
    echo json_encode(["success" => false, "message" => "Falta el ID."]);
    exit;
}

include('conexion.php');

if (!$link) {
    echo json_encode(["success" => false, "message" => "Error de conexión."]);
    exit;
}

$sql    = "SELECT * FROM troquel WHERE id = $id LIMIT 1";
$result = mysqli_query($link, $sql);

if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode(["success" => false, "message" => "Contacto no encontrado."]);
    $link->close();
    exit;
}

$row = mysqli_fetch_assoc($result);
$link->close();

echo json_encode(["success" => true, "data" => $row]);
?>