const express = require('express');

let {verificaToken} = require('../middlewares/autenticacion');

const _ = require('underscore');

let Producto = require('../models/producto');

let app = express();


//==============================
// Obtener todos los productos
//==============================
// Populate usuario y categoria
// Paginado
app.get('/producto', verificaToken, (req,res) => {

    let limite = req.query.limite || 10;
    limite = Number(limite);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible: true})
    .skip(desde)
    .limit(limite)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productos) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error obteniendo productos'
                }
            });
        }

        Producto.countDocuments({disponible: true}, (err2, numProductos) => {
            if (err2) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos,
                numProductos
            });

        })

        
    });

});


//==============================
// Obtener producto por id
//==============================
// Populate usuario y categoria
app.get('/producto/:id', verificaToken, (req,res) => {

    let id = req.params.id;
    
    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error obteniendo producto'
                }
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });

});


//==============================
// Buscar productos
//==============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Error obteniendo productos'
                    }
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});


//==============================
// Crear nuevo producto
//==============================
app.post('/producto', verificaToken, (req,res) => {

    let body = req.body;

    let descCategoria = body.categoria;

    let nuevoProducto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    nuevoProducto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error insertando producto en BBDD'
                }
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

//==============================
// Actualizar producto por ID
//==============================
app.put('/producto/:id', verificaToken, (req,res) => {

    let id = req.params.id;
    let body = req.body;

    let datosProducto = _.pick(body, ['nombre', 'precio', 'descripcion', 'categoria']);

    console.log(datosProducto);

    Producto.findByIdAndUpdate(id, datosProducto, {
        new: true,
        runValidators: true,
        context: 'query' 
    }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error actualizando producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    });

});

//==============================
// Deshabilitar producto por ID
//==============================
app.delete('/producto/:id', verificaToken, (req,res) => {

    let id = req.params.id;

    let disponibleAct = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, disponibleAct, {
        new: true,
        runValidators: true,
        context: 'query' 
    }, (err,productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })

});


module.exports = app;