const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({

    nombre:{
        type: String,
        require: true,
        trim: true, // Elimina los espacios en blanco
    },
    email:{
        type: String,
        require: true,
        trim: true,
        unique: true, //Solo un usuario por correo(llave unica)

    },
    password:{
        type: String,
        require: true,
        trim: true
    },
    registro: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('Usuario', UsuariosSchema);