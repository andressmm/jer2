<?php
// creargrupo.php
header('Content-Type: application/json; charset=utf-8');
require_once "conexion.php";

$grupo     = isset($_POST['grupo']) ? trim($_POST['grupo']) : "";
$dataentry = isset($_POST['dataentry']) ? trim($_POST['dataentry']) : "";

if ($grupo === "") {
    echo json_encode(["success" => false, "message" => "El nombre del grupo es obligatorio"]);
    exit;
}

$grupoEsc     = mysqli_real_escape_string($conn, $grupo);
$dataentryEsc = mysqli_real_escape_string($conn, $dataentry);

$check = mysqli_query($conn, "SELECT id FROM crecimiento WHERE grupo = '$grupoEsc' LIMIT 1");
if ($check && mysqli_num_rows($check) > 0) {
    echo json_encode(["success" => false, "message" => "Ese grupo ya existe"]);
    exit;
}

$sql = "INSERT INTO crecimiento (grupo, dataentry, id_troquel, timestamp) VALUES ('$grupoEsc', '$dataentryEsc', NULL, NOW())";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["success" => true]);
} else {
    error_log("creargrupo.php error: " . mysqli_error($conn));
    echo json_encode(["success" => false, "message" => "Error al crear el grupo"]);
}