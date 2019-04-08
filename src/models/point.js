const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PointSchema = new Schema({
    name: String,
    location: {
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

PointSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Point", PointSchema);