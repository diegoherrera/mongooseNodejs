var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var librosSchema = new Schema({
    Titulo: String,
    Contenido: String,
    Imagen: String,
    Create_at: { type: Date, require: true, default: Date.now },
    IdUsuario: { type: Schema.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model("Libros", librosSchema);