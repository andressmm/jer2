<?php
// togglecrecimiento.php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');
require_once "conexion.php";

$idTroquel = isset($_POST['id_troquel']) ? trim($_POST['id_troquel']) : "";
$grupo     = isset($_POST['grupo'])      ? trim($_POST['grupo'])      : "";
$dataentry = isset($_POST['dataentry'])  ? trim($_POST['dataentry'])  : "";
$accion    = isset($_POST['accion'])     ? trim($_POST['accion'])     : "";

if ($idTroquel === "" || $grupo === "" || $accion === "") {
    echo json_encode(["success" => false, "message" => "Faltan parámetros"]);
    exit;
}

$idTroquelEsc = mysqli_real_escape_string($link, $idTroquel);
$grupoEsc     = mysqli_real_escape_string($link, $grupo);
$dataentryEsc = mysqli_real_escape_string($link, $dataentry);

if ($accion === "agregar") {

    $check = mysqli_query($link, "SELECT id FROM crecimiento WHERE id_troquel = '$idTroquelEsc' AND grupo = '$grupoEsc' LIMIT 1");
    if ($check && mysqli_num_rows($check) > 0) {
        echo json_encode(["success" => true]);
        exit;
    }

    $sql = "INSERT INTO crecimiento (grupo, dataentry, id_troquel, timestamp) VALUES ('$grupoEsc', '$dataentryEsc', '$idTroquelEsc', NOW())";

    if (mysqli_query($link, $sql)) {
        echo json_encode(["success" => true]);
    } else {
        error_log("togglecrecimiento.php (agregar) error: " . mysqli_error($link));
        echo json_encode(["success" => false, "message" => "Error al agregar al grupo"]);
    }

} elseif ($accion === "quitar") {

    $sql = "DELETE FROM crecimiento WHERE id_troquel = '$idTroquelEsc' AND grupo = '$grupoEsc'";

    if (mysqli_query($link, $sql)) {
        echo json_encode(["success" => true]);
    } else {
        error_log("togglecrecimiento.php (quitar) error: " . mysqli_error($link));
        echo json_encode(["success" => false, "message" => "Error al quitar del grupo"]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Acción no reconocida"]);
}