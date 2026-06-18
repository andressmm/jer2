<?php
// getcrecimientocontactos.php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');
require_once "conexion.php";

$dni   = isset($_GET['dni'])   ? trim($_GET['dni'])   : "";
$grupo = isset($_GET['grupo']) ? trim($_GET['grupo']) : "";

if ($dni === "" || $grupo === "") {
    echo json_encode(["success" => false, "message" => "Faltan parámetros"]);
    exit;
}

$dniEsc   = mysqli_real_escape_string($link, $dni);
$grupoEsc = mysqli_real_escape_string($link, $grupo);

$sql = "
    SELECT t.id, t.nombre, t.apellido,
           CASE WHEN c.id IS NULL THEN 0 ELSE 1 END AS asignado
    FROM troquel t
    LEFT JOIN crecimiento c
           ON c.id_troquel = t.id
          AND c.grupo = '$grupoEsc'
    WHERE t.dataentry = '$dniEsc'
    ORDER BY t.nombre ASC
";

$result = mysqli_query($link, $sql);

if (!$result) {
    error_log("getcrecimientocontactos.php error: " . mysqli_error($link));
    echo json_encode(["success" => false, "message" => "Error al obtener contactos"]);
    exit;
}

$contactos = [];
while ($row = mysqli_fetch_assoc($result)) {
    $row['asignado'] = (bool)$row['asignado'];
    $contactos[] = $row;
}

echo json_encode(["success" => true, "data" => $contactos]);