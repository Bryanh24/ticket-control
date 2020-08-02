const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const app = express();
const Usuario = require("../models/usuario");
const { verificaToken, verificaAdminRole } = require("../middlwares/auth");

app.get("/usuario", verificaToken, (req, res) => {
    let from = req.query.from || 0;
    let limit = req.query.limit || 5;
    limit = Number(limit);

    from = Number(from);
    Usuario.find({ estado: true }, "nombre email role google img estado")
        .skip(from)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    encontrados: conteo,
                });
            });
        });
});

app.post("/usuario", [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        // usuarioDB.password = null
        res.json({
            ok: true,
            usuario: usuarioDB,
        });
    });
});

app.put("/usuario/:id", [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "email", "img", "estado"]);

    Usuario.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                usuario: usuarioDB,
            });
        }
    );
});

app.delete("/usuario/:id", [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false,
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado.",
                },
            });
        }
        res.json({
            ok: true,
            usuario,
        });
    });
});

module.exports = app;