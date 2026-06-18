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

$sql = "SELECT id, id_contacto, fecha, hora, medio FROM seguimiento ORDER BY fecha DESC, hora DESC";
$result = $link->query($sql);
$seguimientos = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $seguimientos[] = [
            "id"          => $row["id"],
            "id_contacto" => $row["id_contacto"],
            "fecha"       => $row["fecha"],
            "hora"        => $row["hora"],
            "medio"       => $row["medio"],
        ];
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error: " . $link->error]);
    exit;
}

$link->close();

echo json_encode([
    "seguimientos"       => $seguimientos,
    "total_seguimientos" => count($seguimientos)
], JSON_UNESCAPED_UNICODE);
?>