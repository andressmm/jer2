<?php
header("Content-Type: application/json");

// Incluimos la conexión existente
include('conexion.php');

// 1. Buscar usuarios que tengan la dirección cargada pero lat o lng sean NULL o estén vacíos
$query = "
    SELECT id, direccion 
    FROM users 
    WHERE direccion IS NOT NULL 
      AND direccion != '' 
      AND (lat IS NULL OR lng IS NULL OR lat = '' OR lng = '')
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
        "header" => "User-Agent: CronometGeocodingScript/1.0 (contacto@tu-dominio.com)\r\n" // Cambia esto por tu dominio o correo
    ]
];
$context = stream_context_create($opts);

// Ciudad base para asegurar la precisión
$ciudad_base = ", Concordia, Entre Rios, Argentina";

while ($row = mysqli_fetch_assoc($result)) {
    $id = $row['id'];
    $direccion_usuario = $row['direccion'];
    
    // Construimos la dirección completa para buscar
    $direccion_completa = $direccion_usuario . $ciudad_base;
    
    // Codificamos la dirección para la URL
    $url = "https://nominatim.openstreetmap.org/search?q=" . urlencode($direccion_completa) . "&format=json&limit=1";
    
    // Hacemos la petición a la API de OpenStreetMap (Nominatim)
    $response = file_get_contents($url, false, $context);
    
    if ($response) {
        $data = json_decode($response, true);
        
        // Si Nominatim encontró la dirección
        if (!empty($data) && isset($data[0]['lat']) && isset($data[0]['lon'])) {
            $lat = $data[0]['lat'];
            $lng = $data[0]['lon']; // Nominatim devuelve 'lon'
            
            // 2. Actualizar los datos en la tabla users
            $update_query = "UPDATE users SET lat = '$lat', lng = '$lng' WHERE id = $id";
            
            if (mysqli_query($link, $update_query)) {
                $actualizados++;
            } else {
                $errores[] = "Error al actualizar ID $id: " . mysqli_error($link);
            }
        } else {
            $errores[] = "No se encontraron coordenadas para la dirección: $direccion_completa";
        }
    } else {
        $errores[] = "Error de conexión con la API para el ID $id";
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