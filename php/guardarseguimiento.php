<?php
ini_set('display_errors', 0);
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

if (!isset($_POST['id_contacto']) || !isset($_POST['medio'])) {
    echo json_encode(["success" => false, "message" => "Faltan datos."]);
    exit;
}

include('conexion.php');
if (!$link) { echo json_encode(["success" => false, "message" => "Error de conexión."]); exit; }

$dni_usuario  = mysqli_real_escape_string($link, $_POST['dni_usuario']   ?? '');
$id_contacto  = intval($_POST['id_contacto']);
$medio        = mysqli_real_escape_string($link, $_POST['medio']         ?? '');
$fecha        = mysqli_real_escape_string($link, $_POST['fecha']         ?? '');
$hora         = mysqli_real_escape_string($link, $_POST['hora']          ?? '');
$observaciones= mysqli_real_escape_string($link, $_POST['observaciones'] ?? '');

$sql = "INSERT INTO seguimiento (dni_usuario, id_contacto, medio, fecha, hora, observaciones)
        VALUES ('$dni_usuario', $id_contacto, '$medio', '$fecha', '$hora', '$observaciones')";

$result = mysqli_query($link, $sql);

if ($result) {
    echo json_encode(["success" => true, "message" => "Acción registrada correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . mysqli_error($link)]);
}

$link->close();
?>