const express = require('express');
const app = express();
const dbconnect = require(`./config/db`);
const librosRoutes = require(`./routes/libros`);

app.use(express.json());
app.use(librosRoutes);

dbconnect().then(() => {
    app.listen(3000, () => {
        console.log("El servidor esta corriendo en el puerto 3000");
    });

}).catch(err => {
    console.log("No se pudo iniciar el servidor debido a un error en la base de datos");
});

