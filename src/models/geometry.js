const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let GeometrySchema = new Schema({
    name: String,
    location: {
        type: {
            type: String,
            enum: ['Point', 'LineString', 'Polygon'],
            required: true
        },
        coordinates: {
            type: [],
            // type: [Schema.Types.Mixed],
            required: true
        }
    }
});

GeometrySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Geometry", GeometrySchema);