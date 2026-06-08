<?php
ini_set('display_errors', 0);
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$nombre   = strtoupper(trim($_GET['nombre']   ?? ''));
$apellido = strtoupper(trim($_GET['apellido'] ?? ''));
$celular  = trim($_GET['celular'] ?? '');

if (!$nombre || !$apellido) {
    echo json_encode(["existe" => false]);
    exit;
}

include('conexion.php');

if (!$link) {
    echo json_encode(["existe" => false, "message" => "Error de conexión"]);
    exit;
}

$nombre   = mysqli_real_escape_string($link, $nombre);
$apellido = mysqli_real_escape_string($link, $apellido);
$celular  = mysqli_real_escape_string($link, $celular);

$sql = "SELECT id FROM troquel 
        WHERE (nombre LIKE '%$nombre%' AND apellido LIKE '%$apellido%') 
           OR (celular != '' AND celular LIKE '%$celular%')
        LIMIT 1";

$result = mysqli_query($link, $sql);

if (!$result) {
    echo json_encode(["existe" => false, "message" => mysqli_error($link)]);
    $link->close();
    exit;
}

$existe = mysqli_num_rows($result) > 0;
$row    = $existe ? mysqli_fetch_assoc($result) : null;

echo json_encode([
    "existe" => $existe,
    "id"     => $row ? $row['id'] : null
]);

$link->close();
?>