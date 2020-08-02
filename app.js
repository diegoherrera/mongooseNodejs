const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const configuracion = require('./configuracion');
const modeloUsuario = require('./model/usuario');
const modeloLibro = require('./model/Libros');

const methodOverride = require('method-override');

const app = express();
const router = express.Router();


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(methodOverride());

app.use(configuracion.path, express.static(__dirname + '/upload'));

app.all('*', (req, res, next) => {
    console.log(JSON.stringify(req.body));
    next();
});

mongoose.connect(configuracion.bd, (error, respuesta) => {
    if (error) throw error;
    console.log('conexion con la base de dato  de manera exitosa');

});

app.listen(3000, () => {
    console.log('estoy escuchando el puerto 3000');
});

router.get("/api/saludo", (req, res) => {
    res.send({ retorno: "hola mundo curso de nodejs " });
});

router.get("/salida", (req, res) => {
    res.redirect('http://google.com');
});

router.get("/escuchandoinput", (req, res) => {
    res.send({ retorno: "hola mundo curso de nodejs " + req.body.saludo + " " + req.body.curso });
});

router.get("/apiUri/:id/:nombre", (req, res) => {
    res.send({ retorno: "por uri " + req.params.id + " mas " + req.params.nombre });
});

router.post("/apiUriPost", (req, res) => {
    res.send({ retorno: "por uri " + req.body.id + " mas " + req.body.nombre });
});

router.put("/apiUriPost", (req, res) => {
    res.send({ retorno: "por uri " + req.body.id + " mas " + req.body.nombre });
});

router.delete("/apiUriPost", (req, res) => {
    res.send({ retorno: "por uri " + req.body.id + " mas " + req.body.nombre });
});

router.get("/usuario", (req, res) => {
    modeloUsuario.find({}, (error, respuestas) => {
        if (error) res.statusCode(400).send({ respuesta: 'error de la operacion ' + error });

        res.send({ usuarios: respuestas });
    });
});

router.get("/usuario/:id", (req, res) => {
    modeloUsuario.findById(req.params.id, (error, respuesta) => {
        if (error) res.statusCode(400).send({ respuesta: 'error de la operacion ' + error });

        res.send({ usuario: respuesta });
    });
});

//$And: [{ 'Nombre': new RegExp(req.params.buscar, 'i') },{ 'Edad': 34}]  
//$or: [{condicion1},{condicion2}]   (condicion1) or (condicion2)
router.get("/usuario/filtro/:buscar/:edad", (req, res) => {
    modeloUsuario.find({ $and: [{ 'Nombre': new RegExp(req.params.buscar, 'i') },{ 'Edad': req.params.edad}] }, (error, respuestas) => {
        if (error) res.statusCode(400).send({ respuesta: 'error de la operacion ' + error });

        res.send({ usuarios: respuestas });
    });
});

router.get("/usuario/filtro/:buscar", (req, res) => {
    modeloUsuario.find({ 'Nombre': new RegExp(req.params.buscar, 'i') }, (error, respuestas) => {
        if (error) res.statusCode(400).send({ respuesta: 'error de la operacion ' + error });

        res.send({ usuarios: respuestas });
    });
});


router.get("/libro", (req, res) => {
    modeloLibro.find({}).populate('IdUsuario')
    .exec((error, respuesta) => {
        if (error) res.statusCode(400).send({ respuesta: 'error de la operacion ' + error });
        res.send({ libros: respuesta });

    })
})

router.post("/libro", (req, res) => {
   
    var nuevolibro = new modeloLibro();
    nuevolibro.Titulo = req.body.Titulo;
    nuevolibro.Contenido = req.body.Contenido;
    nuevolibro.IdUsuario = req.body.IdUsuario;

    nuevolibro.save((error, resultado) => {
        if (error) res.statusCode(400).send({ respuesta: 'error de la operacion ' + error });

        res.send({ libro: resultado });
    });
});




router.post("/usuario", (req, res) => {

    var nuevoUsuario = new modeloUsuario();
    nuevoUsuario.Nombre = req.body.Nombre;
    nuevoUsuario.Apellido = req.body.Apellido;
    nuevoUsuario.Edad = req.body.Edad;

    nuevoUsuario.save((error, resultado) => {
        if (error) res.statusCode(400).send({ respuesta: 'error de la operacion ' + error });

        res.send({ usuario: resultado });
    });
});

router.delete("/usuario/:id", (req, res) => {
    modeloUsuario.findById(req.params.id, (error, buscado) => {
        buscado.remove((error, resultado) => {
            if (error) res.statusCode(400).send({ respuesta: 'error de la operacion ' + error });
            res.send({ resultado: 'Delete User' });
        });
    });
});

router.put("/usuario/:id", (req, res) => {

    modeloUsuario.findById(req.params.id, (error, buscado) => {

        buscado.Nombre = req.body.Nombre;
        buscado.Apellido = req.body.Apellido;
        buscado.Edad = req.body.Edad;

        buscado.save((errorGuardar, resultadoguardar) => {
            if (errorGuardar) res.statusCode(400).send({ respuesta: 'error de la operacion ' + errorGuardar });

            res.send({ usuario: resultadoguardar });
        });
    });



});



router.get("/login", (req, res) => {
    res.sendFile(__dirname + '/upload/login.html');
});

app.use(router);
