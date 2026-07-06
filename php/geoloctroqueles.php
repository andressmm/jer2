<?php
header("Content-Type: application/json");

// Evitar que el script se corte por timeout en procesos largos
set_time_limit(0);

// Incluimos la conexión existente
include('conexion.php');

// 1. Buscar usuarios que tengan la dirección cargada pero lat o lng sean NULL o estén vacíos
$query = "
    SELECT id, direccion, localidad 
    FROM troquel 
    WHERE direccion IS NOT NULL 
      AND (lat IS NULL OR lat = '' )
";

$result = mysqli_query($link, $query);

if (!$result) {
    echo json_encode(["success" => false, "message" => "Error en la consulta de selección: " . mysqli_error($link)]);
    exit;
}

$actualizados = 0;
$errores = [];

// Configuración del contexto para la función file_get_contents (Requerido por Nominatim)
$opts = [
    "http" => [
        "method" => "GET",
        "header" => "User-Agent: CronometGeocodingScript/1.0 (contacto@tu-dominio.com)\r\n", // Cambia esto por tu dominio o correo
        "timeout" => 10 // evita que quede colgado esperando respuesta de Nominatim
    ]
];
$context = stream_context_create($opts);

while ($row = mysqli_fetch_assoc($result)) {
    $id = $row['id'];
    $direccion_usuario = trim($row['direccion']);

    // Si después del trim quedó vacía, la saltamos
    if ($direccion_usuario === '') {
        $errores[] = "ID $id: dirección vacía luego de trim, se omite.";
        continue;
    }

    // Usamos la localidad real del registro, con fallback a Concordia
    $localidad = !empty(trim($row['localidad'])) ? trim($row['localidad']) : "Concordia";

    // Construimos la dirección completa para buscar
    $direccion_completa = "$direccion_usuario, $localidad, Entre Rios, Argentina";

    // Codificamos la dirección para la URL
    $url = "https://nominatim.openstreetmap.org/search?q=" . urlencode($direccion_completa) . "&format=json&limit=1";

    // Hacemos la petición a la API de OpenStreetMap (Nominatim)
    // @ para suprimir el warning de PHP si falla (timeout, DNS, etc.) y no romper el JSON de salida
    $response = @file_get_contents($url, false, $context);

    if ($response) {
        $data = json_decode($response, true);

        // Si Nominatim encontró la dirección
        if (!empty($data) && isset($data[0]['lat']) && isset($data[0]['lon'])) {
            $lat = $data[0]['lat'];
            $lng = $data[0]['lon']; // Nominatim devuelve 'lon'

            // 2. Actualizar los datos en la tabla troquel
            $update_query = "UPDATE troquel SET lat = '$lat', lng = '$lng' WHERE id = $id";

            if (mysqli_query($link, $update_query)) {
                $actualizados++;
            } else {
                $errores[] = "Error al actualizar ID $id: " . mysqli_error($link);
            }
        } else {
            $errores[] = "No se encontraron coordenadas para la dirección: $direccion_completa";
        }
    } else {
        $errores[] = "Error de conexión con la API para el ID $id (dirección: $direccion_completa)";
    }

    // RESPETAR LA POLÍTICA DE USO DE NOMINATIM: Máximo 1 petición por segundo
    sleep(1);
}

// Cerramos la conexión
$link->close();

// Devolvemos el resultado en formato JSON
echo json_encode([
    "success" => true,
    "usuarios_actualizados" => $actualizados,
    "alertas_o_errores" => $errores
]);
?>