<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include('conexion.php');

$dni_excluir = $_GET['dni'] ?? '';

$query = "
    SELECT nombre, apellido, dni, rol
    FROM users
    WHERE dni != '$dni_excluir'
    ORDER BY nombre ASC
";

$result = mysqli_query($link, $query);
$usuarios = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $usuarios[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $usuarios]);
$link->close();
?>