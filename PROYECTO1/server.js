// Requerir los módulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Crear una instancia de Express
const app = express();

// Usar bodyParser para analizar los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta raíz
app.use(express.static(__dirname));

// Ruta para servir el formulario HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para generar el PDF
app.post('/generate-pdf', (req, res) => {
    const { nombre, apellido, rut, auto, patente } = req.body;

    // Crear el documento PDF
    const doc = new PDFDocument();

    // Ruta para guardar el archivo PDF en la carpeta minisistema
    const filePath = path.join(__dirname, `${nombre}_${apellido}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Agregar un logo (asegúrate de tener el archivo logo.png en la carpeta principal)
    if (fs.existsSync(path.join(__dirname, 'logo.png'))) {
        doc.image(path.join(__dirname, 'logo.png'), 50, 45, { width: 100 });
    }

    // Agregar el título
    doc.fontSize(20).text('Formulario de Registro', { align: 'center' });

    // Espaciado
    doc.moveDown(2);

    // Estilo de las etiquetas y datos
    doc.fontSize(12)
       .text(`Nombre: ${nombre}`, 100)
       .moveDown(0.5)
       .text(`Apellido: ${apellido}`)
       .moveDown(0.5)
       .text(`RUT: ${rut}`)
       .moveDown(0.5)
       .text(`Auto: ${auto}`)
       .moveDown(0.5)
       .text(`Patente: ${patente}`);

    // Finalizar el PDF
    doc.end();

    // Esperar hasta que el archivo esté completamente escrito y luego enviar al usuario
    stream.on('finish', function () {
        res.download(filePath);
    });
});

// Escuchar en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
