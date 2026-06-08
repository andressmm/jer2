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
    $check = mysqli_query($link, "SELECT id FROM users WHERE dni = '$dni'");

    if (mysqli_num_rows($check) > 0) {
        echo json_encode(["success" => false, "message" => "El DNI ya está registrado, debes ingresar usando tu DNI."]);
        $link->close();
        exit;
    }

    // Insertar
    $sql = "INSERT INTO users (nombre, apellido, celular, dni, direccion, rol) 
            VALUES ('$nombre', '$apellido', '$celular', '$dni', '$direccion', '$rol')";

    $result = mysqli_query($link, $sql);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Usuario registrado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar: " . mysqli_error($link)]);
    }

    $link->close();
}
?>