const mongoose = require("mongoose");

let Schema = new mongoose.Schema({
    numero_bo: String,
    ano: String,
    mes: String,
    crime: String,
    delegacia: String,
    nome_departamento: String,
    cidade: String,
    logradouro: String,
    localizacao: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

Schema.index({ localizacao: "2dsphere" });

module.exports = mongoose.model("Ocorrencia", Schema);