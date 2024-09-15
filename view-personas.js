const express = require('express');
const mysql = require('mysql2');

const app = express();

// Conexión a la base de datos MySQL en Railway
const connection = mysql.createConnection({
  host: 'junction.proxy.rlwy.net',  // Host público proporcionado por Railway
  user: 'root',                     // Usuario proporcionado
  password: 'bMSzJomEQjrxwbmQWDWflJBqGteoenlt', // Contraseña proporcionada
  database: 'railway',              // Nombre de la base de datos
  port: 48639                       // Puerto público proporcionado
});

// Verificar la conexión
connection.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL en Railway');
});

// Ruta para mostrar los registros de la tabla personas
app.get('/ver-personas', (req, res) => {
  const sql = 'SELECT * FROM personas';

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error al consultar los datos:', err);
      return res.status(500).send('Error al consultar los datos');
    }

    // Renderizar resultados en HTML
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

    responseHTML += '</table>';
    res.send(responseHTML);
  });
});

// Iniciar el servidor en un puerto diferente
app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
