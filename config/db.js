const mongoose = require('mongoose');

 //Función para conectar a MongoDB
const dbconnect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/dbGestorBiblioteca");
        console.log('Conexión a la base de datos fue exitosa');
    } catch (error) {
        console.error('Error en la conexión a la base de datos:', error);
        process.exit(1); // Detener la aplicación si falla la conexión
    }
};

module.exports = dbconnect;