const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos MySQL en XAMPP
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Usuario predeterminado de XAMPP
  password: '', // Deja en blanco si no tienes contraseña en MySQL
  database: 'sistema_practica' // Nombre de la base de datos creada en phpMyAdmin
});

// Verificar la conexión
connection.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para el formulario HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Sirve el archivo HTML
});

// Ruta para recibir los datos del formulario
app.post('/agregar-persona', (req, res) => {
  const { nombre, apellido, edad, sexo } = req.body;
  
  // Insertar datos en la tabla `personas`
  const sql = 'INSERT INTO personas (nombre, apellido, edad, sexo) VALUES (?, ?, ?, ?)';
  connection.query(sql, [nombre, apellido, edad, sexo], (err, result) => {
    if (err) {
      console.error('Error al insertar los datos:', err);
      return res.status(500).send('Error al insertar los datos');
    }
    res.send('Persona agregada correctamente');
  });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
