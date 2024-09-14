<?php
// Configuración de la conexión a la base de datos
$servername = "localhost";
$username = "root"; // Cambia esto si usas otro usuario
$password = "2024"; // Cambia esto si usas una contraseña
$dbname = "contrato_consignacion";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Recibir datos del formulario
$vehiculo = $_POST['vehiculo'];
$marca = $_POST['marca'];
$modelo = $_POST['modelo'];
$anio = $_POST['anio'];
$chasis = $_POST['chasis'];
$motor = $_POST['motor'];
$patente = $_POST['patente'];
$kilometraje = $_POST['kilometraje'];
$permiso = $_POST['permiso'];
$revision = $_POST['revision'];
$seguro = $_POST['seguro'];
$precio = $_POST['precio'];

$rut = $_POST['rut'];
$nombre_apellido = $_POST['nombre_apellido'];
$direccion = $_POST['direccion'];
$telefono = $_POST['telefono'];
$correo = $_POST['correo'];
$fecha = $_POST['fecha'];

// Preparar sentencia para insertar cliente
$stmt_cliente = $conn->prepare("INSERT INTO clientes (rut, nombre_apellido, direccion, telefono, correo, fecha) 
VALUES (?, ?, ?, ?, ?, ?)");
$stmt_cliente->bind_param("ssssss", $rut, $nombre_apellido, $direccion, $telefono, $correo, $fecha);

// Ejecutar sentencia para cliente
if ($stmt_cliente->execute() === TRUE) {
    // Obtener el ID del cliente insertado
    $cliente_id = $conn->insert_id;

    // Preparar sentencia para insertar vehículo
    $stmt_vehiculo = $conn->prepare("INSERT INTO vehiculos (vehiculo, marca, modelo, anio, chasis, motor, patente, kilometraje, permiso, revision, seguro, precio) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt_vehiculo->bind_param("sssississssd", $vehiculo, $marca, $modelo, $anio, $chasis, $motor, $patente, $kilometraje, $permiso, $revision, $seguro, $precio);

    // Ejecutar sentencia para vehículo
    if ($stmt_vehiculo->execute() === TRUE) {
        echo "Contrato registrado con éxito.";
    } else {
        echo "Error al registrar el vehículo: " . $stmt_vehiculo->error;
    }

    // Cerrar sentencia de vehículo
    $stmt_vehiculo->close();

} else {
    echo "Error al registrar el cliente: " . $stmt_cliente->error;
}

// Cerrar sentencia de cliente
$stmt_cliente->close();

// Cerrar conexión
$conn->close();
?>
