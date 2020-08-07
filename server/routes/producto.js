const express = require('express');
const { verificaToken } = require('../middlwares/auth');

let app = express();
let Producto = require('../models/producto');
const producto = require('../models/producto');


app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err,
                })
            }
            res.json({
                ok: true,
                productos,
            })
        });

});



app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err,
                })
            }

            res.json({
                ok: true,
                producto: productoDB,
            });
        });

});

//=======================
//BUSCAR PRODUCTOS
//========================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err,
                })
            }

            res.json({
                ok: true,
                productos
            })
        });

});

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err,
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB,
        });
    });

});


app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let productoActualizado = {
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        disponible: body.disponible,
        descripcion: body.descripcion,
        categoria: body.categoria,
    }

    Producto.findByIdAndUpdate(id, productoActualizado, { new: true, runValidators: true },
        (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err,
                })
            }

            res.json({
                ok: true,
                producto: productoDB,
            });
        });
});



app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err,
            })
        }
        res.json({
            ok: true,
            message: 'El producto ha sido inhabilitado con exito.'
        })
    });

});




module.exports = app;