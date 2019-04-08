const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PolygonSchema = new Schema({
    name: String,
    location: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true
        },
        coordinates: {
            type: [[[Number]]], // Array of arrays of arrays of numbers
            required: true
        }
    }
});

module.exports = mongoose.model("Polygon", PolygonSchema);