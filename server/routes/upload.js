const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// Default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
                tipo
            }
        });
    }

    let archivo = req.files.archivo;

    // Validar extension
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    let splitted = archivo.name.split('.');
    console.log(splitted);
    let extension = splitted[splitted.length -1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // Cambiamos nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    // Imagen cargada, actualizamos imagen de usuario

    if (tipo === 'usuarios') {
        imagenUsuario(id, res, nombreArchivo);
    } else if (tipo === 'productos') {
        imagenProducto(id, res, nombreArchivo);
    }

    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        // Verificar ruta del archivo
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioFinal) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioFinal) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El usuario no existe'
                    }
                });
            }

            res.json({
                ok: true,
                usuario: usuarioFinal,
                archivo: nombreArchivo
            });


        });

        

    });

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        // Verificar ruta del archivo
        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
           
            if (!productoActualizado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no se ha podido podificar'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoActualizado,
                archivo: nombreArchivo
            });
        });

    });

}

function borraArchivo(nombreArchivo, tipo) {
    let urlImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(urlImagen)) {
        fs.unlinkSync(urlImagen);
    }
}

module.exports = app;