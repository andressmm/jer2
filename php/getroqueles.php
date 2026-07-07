<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include('conexion.php');


$query = "
    SELECT id,nombre, apellido, direccion,celular,lat,lng 
    FROM troquel
    WHERE lat != ''
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