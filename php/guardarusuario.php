<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (isset($_POST['nombre'])) {

    $nombre    = strtoupper($_POST['nombre']);
    $apellido  = strtoupper($_POST['apellido']);
    $celular   = $_POST['celular'];
    $dni       = $_POST['dni'];
    $direccion = strtoupper($_POST['direccion']);
    $rol       = $_POST['rol'];

    include('conexion.php');

    // Verificar si el DNI ya existe
    $dniEsc = mysqli_real_escape_string($link, $dni);
    $check = mysqli_query($link, "SELECT id FROM users WHERE dni = '$dniEsc'");

    if (mysqli_num_rows($check) > 0) {
        echo json_encode(["success" => false, "message" => "El DNI ya está registrado, debes ingresar usando tu DNI."]);
        $link->close();
        exit;
    }

    // ── GEOCODIFICAR DIRECCIÓN (Nominatim / OpenStreetMap) ──────────────────
    function geocodificarDireccion($direccion) {
        // Se fuerza el contexto a Concordia, Entre Ríos para mejorar precisión
        $direccionCompleta = $direccion . ", Concordia, Entre Ríos, Argentina";

        $url = "https://nominatim.openstreetmap.org/search?" . http_build_query([
            "q"            => $direccionCompleta,
            "format"       => "json",
            "limit"        => 1,
            "countrycodes" => "ar"
        ]);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 8);
        // Nominatim exige un User-Agent identificable, es obligatorio por su política de uso
        curl_setopt($ch, CURLOPT_USERAGENT, "JER-App/1.0 (contacto@jesusesrey.com.ar)");

        $response = curl_exec($ch);
        $error    = curl_error($ch);
        curl_close($ch);

        if ($error || !$response) {
            return [null, null];
        }

        $data = json_decode($response, true);

        if (!empty($data) && isset($data[0]['lat'], $data[0]['lon'])) {
            return [$data[0]['lat'], $data[0]['lon']];
        }

        return [null, null];
    }

    list($lat, $lng) = geocodificarDireccion($direccion);

    // ── INSERTAR USUARIO (con coordenadas si se encontraron) ────────────────
    $nombreEsc    = mysqli_real_escape_string($link, $nombre);
    $apellidoEsc  = mysqli_real_escape_string($link, $apellido);
    $celularEsc   = mysqli_real_escape_string($link, $celular);
    $direccionEsc = mysqli_real_escape_string($link, $direccion);
    $rolEsc       = mysqli_real_escape_string($link, $rol);

    $latSql = $lat !== null ? "'" . mysqli_real_escape_string($link, $lat) . "'" : "NULL";
    $lngSql = $lng !== null ? "'" . mysqli_real_escape_string($link, $lng) . "'" : "NULL";

    $sql = "INSERT INTO users (nombre, apellido, celular, dni, direccion, rol, lat, lng) 
            VALUES ('$nombreEsc', '$apellidoEsc', '$celularEsc', '$dniEsc', '$direccionEsc', '$rolEsc', $latSql, $lngSql)";

    $result = mysqli_query($link, $sql);

    if ($result) {
        echo json_encode([
            "success" => true,
            "message" => "Usuario registrado correctamente",
            "lat"     => $lat,
            "lng"     => $lng
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar: " . mysqli_error($link)]);
    }

    $link->close();
}
?>