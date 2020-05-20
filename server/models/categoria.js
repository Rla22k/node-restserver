const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const Schema = mongoose.Schema; 

let categoriaSchema = new Schema({

    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

categoriaSchema.plugin(validator, {
    message: '{PATH} ya registrada'
});

module.exports = mongoose.model('Categoria', categoriaSchema);