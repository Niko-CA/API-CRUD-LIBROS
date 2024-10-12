const mongoose = require(`mongoose`);

//Definir esquema del libro

const libroSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            require: true,
        },
        autor: {
            type: String,
            require: true,
        }, categoria: {      //Desde aqui comienza a cambiar esquema para los endpoint de negocio - clase 4
            type: String,
            require: true,
        }, estado: {         //Solo puede tomar los estados predefinidos en el "enum"
            type: String,
            require: true,
            enum: ["Disponible", "Prestado", "Vencido"],
            default: "Disponible",
        }, fechaPrestamo: {
            type: Date,
        }, fechaDevolucion: {
            type: Date,
        }
    },
    {
        timestamps: true, //Añadir fechas de creación y modificación automaticamente
    }
);

const ModelLibro = mongoose.model("libros", libroSchema);
module.exports = ModelLibro;
