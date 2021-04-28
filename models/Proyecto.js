const mongoose = require('mongoose');


const ProyectoSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId,// lo relaciono con Usuario con su ID
        ref: 'Usuario'//lo relaciono
    },
    creado:{
        type: Date,
        default: Date.now()
    }

})


module.exports = mongoose.model('Proyecto', ProyectoSchema);