const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos MySQL utilizando las variables de entorno
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,            // Utiliza el valor de MYSQLHOST desde el archivo .env
  user: process.env.MYSQLUSER,            // Utiliza el valor de MYSQLUSER desde el archivo .env
  password: process.env.MYSQLPASSWORD,    // Utiliza el valor de MYSQLPASSWORD desde el archivo .env
  database: process.env.MYSQLDATABASE,    // Utiliza el valor de MYSQLDATABASE desde el archivo .env
  port: process.env.MYSQLPORT || 3306,    // Utiliza el puerto de MySQL, por defecto 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar la conexión a la base de datos
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL en Railway');
  connection.release(); // Liberar la conexión para otros usos
});

// Ruta para servir el formulario HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Sirve el archivo HTML del formulario
});

// Ruta para agregar personas
app.post('/agregar-persona', (req, res) => {
  const { nombre, apellido, edad, sexo } = req.body;

  // Insertar datos en la tabla `personas`
  const sql = 'INSERT INTO personas (nombre, apellido, edad, sexo) VALUES (?, ?, ?, ?)';
  pool.query(sql, [nombre, apellido, edad, sexo], (err, result) => {
    if (err) {
      console.error('Error al insertar los datos:', err);
      return res.status(500).send('Error al insertar los datos');
    }
    res.send('Persona agregada correctamente <br><a href="/">Volver</a>');
  });
});

// Ruta para mostrar los registros de la tabla `personas`
app.get('/ver-personas', (req, res) => {
  const sql = 'SELECT * FROM personas';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al consultar los datos:', err);
      return res.status(500).send('Error al consultar los datos');
    }

    // Mostrar los resultados en una tabla HTML
    let responseHTML = `
      <h1>Lista de Personas</h1>
      <table border="1" cellpadding="5">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Edad</th>
          <th>Sexo</th>
        </tr>
    `;

    results.forEach(persona => {
      responseHTML += `
        <tr>
          <td>${persona.id}</td>
          <td>${persona.nombre}</td>
          <td>${persona.apellido}</td>
          <td>${persona.edad}</td>
          <td>${persona.sexo}</td>
        </tr>
      `;
    });

    responseHTML += '</table><br><a href="/">Volver al formulario</a>';
    res.send(responseHTML);
  });
});

// Iniciar el servidor en el puerto asignado por Railway o en el puerto 3000 localmente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
