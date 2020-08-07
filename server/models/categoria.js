const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let CategoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, "La descripcion es obligatoria"],
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
});

module.exports = mongoose.model("Categoria", CategoriaSchema);