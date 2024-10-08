const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();  // Cargar variables de entorno desde el archivo .env

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos MySQL utilizando variables de entorno
const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// Verificar la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL en Railway');
});

// Ruta para mostrar el formulario de ingreso de personas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Sirve el archivo HTML del formulario
});

// Ruta para agregar personas
app.post('/agregar-persona', (req, res) => {
  const { nombre, apellido, edad, sexo } = req.body;

  // Insertar datos en la tabla `personas`
  const sql = 'INSERT INTO personas (nombre, apellido, edad, sexo) VALUES (?, ?, ?, ?)';
  connection.query(sql, [nombre, apellido, edad, sexo], (err, result) => {
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

  connection.query(sql, (err, results) => {
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
