<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include('conexion.php');

// TOTALES
$resUsuarios  = mysqli_query($link, "SELECT COUNT(*) as total FROM users");
$totalUsuarios  = $resUsuarios ? mysqli_fetch_assoc($resUsuarios)['total'] : 0;

$resTroqueles = mysqli_query($link, "SELECT COUNT(*) as total FROM troquel");
$totalTroqueles = $resTroqueles ? mysqli_fetch_assoc($resTroqueles)['total'] : 0;

$resActividades = mysqli_query($link, "SELECT COUNT(*) as total FROM seguimiento");
$totalActividades = $resActividades ? mysqli_fetch_assoc($resActividades)['total'] : 0;

// RESUMEN POR USUARIO
$queryUsuarios = "
    SELECT 
        u.nombre,
        u.apellido,
        u.rol,
        u.dni,
        COUNT(DISTINCT t.id) as troqueles,
        COUNT(DISTINCT s.id) as actividades,
        MAX(CONCAT(s.fecha, ' ', s.hora)) as ultima_actividad_fecha
    FROM users u
    LEFT JOIN troquel t ON t.dataentry = u.dni
    LEFT JOIN seguimiento s ON s.dni_usuario = u.dni
    GROUP BY u.dni, u.nombre, u.apellido, u.rol
    ORDER BY troqueles DESC
";
$resU = mysqli_query($link, $queryUsuarios);
$usuarios = [];
if ($resU) {
    while ($row = mysqli_fetch_assoc($resU)) {
        $dni = $row['dni'];
        $queryUltima = "
            SELECT 
                s.medio,
                s.fecha,
                s.hora,
                s.observaciones,
                t.nombre   as contacto_nombre,
                t.apellido as contacto_apellido
            FROM seguimiento s
            LEFT JOIN troquel t ON t.id = s.id_contacto
            WHERE s.dni_usuario = '$dni'
            ORDER BY s.fecha DESC, s.hora DESC
            LIMIT 1
        ";
        $resUltima = mysqli_query($link, $queryUltima);
        if ($resUltima && mysqli_num_rows($resUltima) > 0) {
            $ultima = mysqli_fetch_assoc($resUltima);
            $row['ultima_actividad_fecha'] = $ultima['fecha'] . ' ' . $ultima['hora'];
            $row['ultima_medio']           = $ultima['medio'];
            $row['ultima_obs']             = $ultima['observaciones'];
            $row['contacto_nombre']        = $ultima['contacto_nombre'];
            $row['contacto_apellido']      = $ultima['contacto_apellido'];
        } else {
            $row['ultima_actividad_fecha'] = null;
            $row['ultima_medio']           = null;
            $row['ultima_obs']             = null;
            $row['contacto_nombre']        = null;
            $row['contacto_apellido']      = null;
        }
        $usuarios[] = $row;
    }
}

// RANKING TROQUELES top 5
$queryRankT = "
    SELECT u.nombre, u.apellido, COUNT(t.id) as total
    FROM users u
    LEFT JOIN troquel t ON t.dataentry = u.dni
    GROUP BY u.dni, u.nombre, u.apellido
    ORDER BY total DESC
    LIMIT 5
";
$resRankT = mysqli_query($link, $queryRankT);
$rankTroqueles = [];
if ($resRankT) {
    while ($row = mysqli_fetch_assoc($resRankT)) {
        $rankTroqueles[] = $row;
    }
}

// RANKING ACTIVIDADES top 5
$queryRankA = "
    SELECT u.nombre, u.apellido, COUNT(s.id) as total
    FROM users u
    LEFT JOIN seguimiento s ON s.dni_usuario = u.dni
    GROUP BY u.dni, u.nombre, u.apellido
    ORDER BY total DESC
    LIMIT 5
";
$resRankA = mysqli_query($link, $queryRankA);
$rankActividades = [];
if ($resRankA) {
    while ($row = mysqli_fetch_assoc($resRankA)) {
        $rankActividades[] = $row;
    }
}

// RANKING MOTIVOS DE ORACIÓN
$queryOraciones = "
    SELECT motivo, COUNT(*) as total
    FROM oraciones
    GROUP BY motivo
    ORDER BY total DESC
";
$resOraciones = mysqli_query($link, $queryOraciones);
$rankOraciones = [];
if ($resOraciones) {
    while ($row = mysqli_fetch_assoc($resOraciones)) {
        $rankOraciones[] = $row;
    }
}

// RANKING EDADES
$queryEdades = "
    SELECT edad, COUNT(*) as total
    FROM troquel
    WHERE edad IS NOT NULL AND edad != ''
    GROUP BY edad
    ORDER BY total DESC
";
$resEdades = mysqli_query($link, $queryEdades);
$rankEdades = [];
if ($resEdades) {
    while ($row = mysqli_fetch_assoc($resEdades)) {
        $rankEdades[] = $row;
    }
}

echo json_encode([
    "totales" => [
        "usuarios"    => $totalUsuarios,
        "troqueles"   => $totalTroqueles,
        "actividades" => $totalActividades
    ],
    "usuarios"        => $usuarios,
    "rankTroqueles"   => $rankTroqueles,
    "rankActividades" => $rankActividades,
    "rankOraciones"   => $rankOraciones,
    "rankEdades"      => $rankEdades
]);

$link->close();
?>