var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    Nombre: String,
    Apellido: String,
    Edad: Number,
    Profesional: Boolean,
    Create_at: { type: Date, require: true, default: Date.now }
});
module.exports = mongoose.model("Usuario", usuarioSchema);