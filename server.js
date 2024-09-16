const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();  // Cargar las variables de entorno desde .env

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Usamos createPool en lugar de createConnection para manejar mejor las conexiones
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,          // Usar la variable de entorno para el host
  user: process.env.MYSQLUSER,          // Usar la variable de entorno para el usuario
  password: process.env.MYSQLPASSWORD,  // Usar la variable de entorno para la contraseña
  database: process.env.MYSQLDATABASE,  // Usar la variable de entorno para la base de datos
  port: process.env.MYSQLPORT || 3306,  // Puerto 3306 por defecto
  waitForConnections: true,
  connectionLimit: 10,                  // Límite de conexiones
  queueLimit: 0
});

// Verificar la conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL en Railway');
  connection.release(); // Liberar la conexión para otros usos
});

// Ruta para el formulario HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para agregar personas
app.post('/agregar-persona', (req, res) => {
  const { nombre, apellido, edad, sexo } = req.body;
  
  const sql = 'INSERT INTO personas (nombre, apellido, edad, sexo) VALUES (?, ?, ?, ?)';
  pool.query(sql, [nombre, apellido, edad, sexo], (err, result) => {
    if (err) {
      console.error('Error al insertar los datos:', err);
      return res.status(500).send('Error al insertar los datos');
    }
    res.send('Persona agregada correctamente <br><a href="/">Volver</a>');
  });
});

// Iniciar el servidor en el puerto proporcionado por Railway o en el 3000 localmente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
