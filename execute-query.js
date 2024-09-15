const mysql = require('mysql2');

// Configuración de la conexión con la base de datos Railway
const connection = mysql.createConnection({
  host: 'junction.proxy.rlwy.net',  // Host público proporcionado por Railway
  user: 'root',                     // Usuario proporcionado
  password: 'bMSzJomEQjrxwbmQWDWflJBqGteoenlt', // Contraseña proporcionada
  database: 'railway',              // Nombre de la base de datos
  port: 48639                       // Puerto público proporcionado
});

// Conectar a la base de datos
connection.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL en Railway');
  
  // Consulta para modificar el campo id de la tabla 'personas'
  const sql = 'ALTER TABLE personas MODIFY id INT AUTO_INCREMENT';
  
  // Ejecutar la consulta
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
    } else {
      console.log('Campo id modificado correctamente para ser AUTO_INCREMENT');
    }
    // Cerrar la conexión después de ejecutar la consulta
    connection.end();
  });
});
