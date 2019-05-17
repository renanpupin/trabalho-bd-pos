const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let GeometrySchema = new Schema({
    name: String,
    location: {
        type: {
            type: String,
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

GeometrySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Geometry", GeometrySchema);