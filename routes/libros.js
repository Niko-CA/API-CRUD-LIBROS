const express = require(`express`);
const router = express.Router();

const ModelLibro = require(`../models/libromodel`);

//Obtener todos los libros

router.get(`/libros`, async (req,res) => {
    try{
        const libros = await ModelLibro.find();
        res.status(200).send(libros);
    } catch (error) {
        res.status(500).send({ mensaje: "Error al obtener los libros", error});
    }

});

//Libros por ID
router.get(`/libros/:id`, async (req,res) => {
    try{
        const libro = await ModelLibro.findById(req.params.id);
        
        if (!libro) {
            return res.status(404).send({ mensaje: "Libro no encontrado"});
        }

        res.status(200).send(libro);

    } catch(error) {
        res.status(500).send({ mensaje: "Error al obtener el libro", error});
    }
});

//Crear un nuevo libro

router.post(`/libros`, async (req,res) => {
    const body = req.body;
    try {
        const nuevolibro = await ModelLibro.create(body);
        res.status(201).send(nuevolibro);
    } catch (error) {
        res.status(400).send(error);
    }

});

//Actualizar un libro por ID

router.put(`/libros/:id/`, async (req,res) => {
    try {
        const libroActualizado = await ModelLibro.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true});
        if(!libroActualizado) {
            return res.status(400).send({ mensaje: "libro no encontrado"});
        }
        res.status(200).send(libroActualizado);

    } catch(error) {
        res.status(400).send({ mensaje: "Error al actualizar el libro", error});
    }
});

//Eliminar un libro por ID

router.delete(`/libros/:id`, async (req,res) => {
    try {
        const libroEliminado = await ModelLibro.findByIdAndDelete(req.params.id);
        if(!libroEliminado) {
            return res.status(404).send({ mensaje: "libro no encontrado"});
        }
        res.status(200).send({ mensaje: "Libro eliminado correctamente"});

    } catch(error) {
        res.status(400).send({ mensaje: "Error al eliminar el libro", error});
    }

});

//A partir de aqui comienzan los enpoint de negocios
//-------------------------------------------------------------------------
//Obtener libros segun los filtros de busqueda (autor, categoria, estado)

router.get(`/libros/negocio/busqueda`, async (req,res) => {
    const {autor, categoria, estado} = req.query;    //Obtenemos el autor, categoria, estado desde los query
    
    try {
        const query = {};                               //Creamos un objeto vacio para almacenar los filtros
        if (autor) query.autor = autor;                 //Si el autor esta en los query params, lo va a agregar al filtro
        if (categoria) query.categoria = categoria;    //Si la categoria esta en los query params, lo va a agregar al filtro
        if (estado) query.estado = estado;             //Si el estado esta en los query params, lo va a agregar al filtro
        
        const libros = await ModelLibro.find(query);   //Buscamos los libros con los filtros
        
        if(!libros.length) {
            return res.status(404).send({ mensaje: "No se encontraron libros con los filtros proporcionados"});
        }

        res.status(200).send(libros);


    } catch (error) {
        res.status(500).send({ mensaje: "Error al obtener los libros", error});
    };
});

// Endpoint para prestar un libro (cambia estado y fechas)

router.put('/libros/:id/prestar', async (req, res) => {
    try {
        const libro = await ModelLibro.findById(req.params.id);         //Encontrar el libro
        if (!libro) {
            return res.status(404).send({ mensaje: "Libro no encontrado"});
        }

        libro.estado = `Prestado`;            //Cambiar el estado al libro
        libro.fechaPrestamo = new Date;       //Fecha de Prestamo = fecha actual
        
        //Definir la fecha de devolucion (Por ejemplo, 14 dias despues de la fecha de prestamo)
        const fechaDevolucion = new Date();                        //Obtener la fecha actual
        fechaDevolucion.setDate(fechaDevolucion.getDate() +14);    //A esa fecha actual le sumamos 14 dias
        libro.fechaDevolucion = fechaDevolucion;                   //Asignamos la fecha de devolucion al libro

        //Guardar el libro
        await libro.save();
        res.status(200).send(libro);


    } catch (error) {
        res.status(400).send({ mensaje: "Error al actualizar el estado del libro", error});
    }
});


//Endpoint para devolver un libro (cambiar el estado a "Disponible" y limpiar las fechas)

router.put(`/libros/:id/devolver`, async(req,res) => {
    try {
        //Encontrar el libro
        const libro = await ModelLibro.findById(req.params.id);

        if(!libro) {
            return res.status(404).send({ mensaje: "Libro no encontrado"});
        }

        //Cambiar el estado al libro
        libro.estado = `Disponible`;
        libro.fechaPrestamo = null;        //Limpiar la fecha de prestamo
        libro.fechaDevolucion = null;      //Limpiar la fecha de devolucion 
        
        //Guardar los cambios al Libro y actualizar estado
        await libro.save();
        res.status(200).send(libro);

        
    } catch (error) {
        res.status(400).send({ mensaje: "Error al encontrar el libro", error});
    }
});





module.exports = router;

