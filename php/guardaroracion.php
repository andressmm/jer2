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

$id_contacto = isset($_POST['id_contacto']) ? $_POST['id_contacto'] : null;
$motivos_raw = isset($_POST['motivos'])     ? $_POST['motivos']     : null;

if (!$id_contacto || !$motivos_raw) {
    echo json_encode(["success" => false, "message" => "Faltan datos.", "post" => $_POST]);
    exit;
}

$motivos = json_decode($motivos_raw, true);

if (!is_array($motivos) || count($motivos) === 0) {
    echo json_encode(["success" => false, "message" => "Motivos inválidos."]);
    exit;
}

include('conexion.php');

if (!$link) {
    echo json_encode(["success" => false, "message" => "Error conexión: " . mysqli_connect_error()]);
    exit;
}

// Verificar estructura real de la tabla
$desc = mysqli_query($link, "DESCRIBE oracion");
$columnas = [];
while ($row = mysqli_fetch_assoc($desc)) {
    $columnas[] = $row['Field'] . " (" . $row['Type'] . ")";
}

$errores      = 0;
$guardados    = 0;
$ultimo_error = "";
$ultimo_sql   = "";

foreach ($motivos as $motivo) {
    $motivo_esc = mysqli_real_escape_string($link, trim($motivo));
    $sql        = "INSERT INTO oraciones (id_contacto, motivo) VALUES (" . intval($id_contacto) . ", '$motivo_esc')";
    $result     = mysqli_query($link, $sql);
    if ($result) {
        $guardados++;
    } else {
        $ultimo_error = mysqli_error($link);
        $ultimo_sql   = $sql;
        $errores++;
    }
}


$sql    = "UPDATE troquel SET oracion = 'si' WHERE id = " . intval($id_contacto);
$result = mysqli_query($link, $sql);

$link->close();

echo json_encode([
    "success"      => $errores === 0,
    "message"      => $errores === 0 ? "$guardados pedido(s) guardado(s)." : "$guardados guardado(s), $errores error(es).",
    "guardados"    => $guardados,
    "errores"      => $errores,
    "mysql_error"  => $ultimo_error,
    "sql_ejecutado"=> $ultimo_sql,
    "columnas"     => $columnas
]);
?>