<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include('conexion.php');

if (!isset($_POST['id_contacto']) || !isset($_POST['dni_delegado'])) {
    echo json_encode(["success" => false, "message" => "Faltan datos."]);
    exit;
}

$id_contacto  = mysqli_real_escape_string($link, $_POST['id_contacto']);
$dni_delegado = mysqli_real_escape_string($link, $_POST['dni_delegado']);

$sql = "UPDATE troquel SET dataentry = '$dni_delegado' WHERE id = '$id_contacto'";
$result = mysqli_query($link, $sql);

if ($result) {
    echo json_encode(["success" => true, "message" => "Contacto delegado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . mysqli_error($link)]);
}

$link->close();
?>