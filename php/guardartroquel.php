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

if (!isset($_POST['nombre'])) {
    echo json_encode(["success" => false, "message" => "Faltan datos.", "post" => $_POST]);
    exit;
}

$nombre        = strtoupper($_POST['nombre']);
$apellido      = strtoupper($_POST['apellido']);
$celular       = $_POST['celular'];
$contacto      = $_POST['contacto']      ?? 'WhatsApp';
$direccion     = strtoupper($_POST['direccion']);
$barrio        = strtoupper($_POST['barrio']        ?? '');
$localidad     = strtoupper($_POST['localidad']);
$provincia     = strtoupper($_POST['provincia']     ?? '');
$observaciones = strtoupper($_POST['observaciones'] ?? '');
$edad          = $_POST['edad']          ?? '';
$dataentry     = $_POST['dataentry']     ?? '';
$visita        = $_POST['visita']        ?? 'No';

include('conexion.php');

if (!$link) {
    echo json_encode(["success" => false, "message" => "Error de conexión: " . mysqli_connect_error()]);
    exit;
}

$nombre        = mysqli_real_escape_string($link, $nombre);
$apellido      = mysqli_real_escape_string($link, $apellido);
$celular       = mysqli_real_escape_string($link, $celular);
$contacto      = mysqli_real_escape_string($link, $contacto);
$direccion     = mysqli_real_escape_string($link, $direccion);
$barrio        = mysqli_real_escape_string($link, $barrio);
$localidad     = mysqli_real_escape_string($link, $localidad);
$provincia     = mysqli_real_escape_string($link, $provincia);
$observaciones = mysqli_real_escape_string($link, $observaciones);
$edad          = mysqli_real_escape_string($link, $edad);
$dataentry     = mysqli_real_escape_string($link, $dataentry);
$visita        = mysqli_real_escape_string($link, $visita);

$casadepaz = isset($_POST['casadepaz']) ? $_POST['casadepaz'] : 'No';
$casadepaz = mysqli_real_escape_string($link, $casadepaz);

$sql = "INSERT INTO troquel 
            (nombre, apellido, celular, contacto, direccion, barrio, localidad, provincia, observaciones, edad, dataentry, oracion, quierevisita,casadepaz) 
        VALUES 
            ('$nombre', '$apellido', '$celular', '$contacto', '$direccion', '$barrio', '$localidad', '$provincia', '$observaciones', '$edad', '$dataentry', 'no', '$visita','$casadepaz')";

$result = mysqli_query($link, $sql);

if ($result) {
    echo json_encode(["success" => true, "message" => "Troquel guardado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar: " . mysqli_error($link)]);
}

$link->close();
?>