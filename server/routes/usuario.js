const express = require('express');
const app = express();

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const { verificaToken, verificaRole } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken /*MDW*/, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
      
    Usuario.find({status: true},'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({status: true}, (erro, totalRegistros) => {
                res.json({
                    ok: true,
                    usuarios,
                    totalRegistros
                })
            }); 
        });

});

app.post('/usuario', [verificaToken, verificaRole] /*MDW*/, function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

});

app.put('/usuario/:id', [verificaToken, verificaRole] /*MDW*/, function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, 
        {
            new: true,
            runValidators: true
        },
        (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encuentra el usuario'
                    }
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        })

});

app.delete('/usuario/:id', [verificaToken, verificaRole] /*MDW*/, function (req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        status: false
    }

    Usuario
        .update({_id: id, status: true},cambiaEstado,(err,result) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
    
                if (!result) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Usuario no encontrado'
                        }
                    });
                }

                res.json({
                    ok: true,
                    result
                    //usuario: req.usuario
                });
        });
        

    // Usuario.findByIdAndUpdate(id, cambiaEstado, 
    //     {
    //         new: true,
    //         runValidators: true
    //     },
    //     (err, usuarioDB) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }

    //         if (!usuarioDB) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err: {
    //                     message: 'Usuario no encontrado'
    //                 }
    //             });
    //         }

    //         res.json({
    //             ok: true,
    //             usuario: usuarioDB
    //         });
    //     }
    // );

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });
    
});

module.exports = app;