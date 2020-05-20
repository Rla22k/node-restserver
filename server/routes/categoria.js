const express = require('express');
const _ = require('underscore');

let {verificaToken, verificaRole} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require ('../models/categoria');

//==============================
// Obtiene todas las categorias
//==============================
app.get('/categoria', verificaToken, (req, res) => {
    // Categoria.find((err, categorias) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         categorias
    //     });

    // });

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });
    })
});

//==============================
// Muestra categoria por id
//==============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id,(err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se ha encontrado la categoria'
                }
            });
        }
        
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//==============================
// Crear una nueva categoria
//==============================
app.post('/categoria', verificaToken, (req, res) => {

    // let nuevaCategoria = {
    //     descripcion: req.params.descripcion
    // }

    let body = req.body;

    let nuevaCategoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    nuevaCategoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error insertando nueva categoría'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

//==============================
// Actualiza categoria
//==============================
app.put('/categoria/:id', verificaToken, (req,res) => {

    let id = req.params.id;
    //let body = _.pick(req.body, ['descripcion']);
    let body = {
        descripcion: req.body.descripcion
    };

    Categoria.findByIdAndUpdate(id, body, 
        {
            new: true,
            runValidators: true,
            context: 'query' 
        },
        (err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        }
    );

});

//==============================
// Elimina categoria
//==============================
app.delete('/categoria/:id',[verificaToken, verificaRole], (req,res) => {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se ha encontrado la categoría"
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

})

module.exports = app;