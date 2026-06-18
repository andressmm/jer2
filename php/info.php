<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');
require_once "conexion.php";

if ($link->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión: " . $link->connect_error]);
    exit;
}

$link->set_charset("utf8mb4");

// TROQUELES
$sql = "SELECT * FROM troquel ORDER BY apellido, registro DESC";
$result = $link->query($sql);
$registros = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $registros[] = [
            "id"       => $row["id"],
            "nombre"   => $row["nombre"],
            "apellido" => $row["apellido"],
            "registro" => $row["registro"],
            "decision" => $row["decision"],
            "dataentry" => $row["dataentry"]

        ];
    }
}

$link->close();

echo json_encode([
    "registros"    => $registros
], JSON_UNESCAPED_UNICODE);