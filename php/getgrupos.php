<?php
// getgrupos.php
header('Content-Type: application/json; charset=utf-8');
require_once "conexion.php";

$result = mysqli_query($conn, "SELECT DISTINCT grupo FROM crecimiento ORDER BY grupo ASC");

if (!$result) {
    error_log("getgrupos.php error: " . mysqli_error($conn));
    echo json_encode(["success" => false, "message" => "Error al obtener grupos"]);
    exit;
}

$grupos = [];
while ($row = mysqli_fetch_assoc($result)) {
    $grupos[] = $row['grupo'];
}

echo json_encode(["success" => true, "data" => $grupos]);