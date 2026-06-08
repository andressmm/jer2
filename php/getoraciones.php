<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$id_contacto = isset($_GET['id_contacto']) ? intval($_GET['id_contacto']) : 0;

if (!$id_contacto) {
    echo json_encode(["success" => false, "message" => "Falta id_contacto."]);
    exit;
}

include('conexion.php');

if (!$link) {
    echo json_encode(["success" => false, "message" => "Error de conexión."]);
    exit;
}

$sql    = "SELECT id, motivo FROM oraciones WHERE id_contacto = $id_contacto ORDER BY id ASC";
$result = mysqli_query($link, $sql);

if (!$result) {
    echo json_encode(["success" => false, "message" => "Error en consulta: " . mysqli_error($link)]);
    $link->close();
    exit;
}

$rows = [];
while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}

$link->close();

echo json_encode(["success" => true, "data" => $rows]);
?>