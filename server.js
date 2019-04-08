const express = require('express');
const path = require('path');
let bodyParser = require("body-parser");
const database = require('./src/database');
const asyncMiddleware = require("./src/utils/asyncMiddleware");

const PointModel = require("./src/models/point");
const PolygonModel = require("./src/models/polygon");


let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT, DELETE');
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

//port that the application will run
let port = process.env.PORT || 5000;

database.connect();

// API routes

//create point
app.post('/api/point', asyncMiddleware(async (req, res) => {

    const getRandomLatLon = () => {
        let minLat = -90;
        let maxLat = 90;

        let minLon = -180;
        let maxLon = 180;

        return [
            Math.random() * (maxLon - minLon) + minLon,
            Math.random() * (maxLat - minLat) + minLat
        ]
    };

    const points = [];
    for (let i = 0; i < 100; i++){
        points.push(
            new PointModel({
                name: "Ponto "+i,
                location: {
                    type: "Point",
                    // coordinates: [132, -24]
                    coordinates: getRandomLatLon()
                }
            })
        );
    }
    for (const point of points) {
        await point.save();
    }

    res.json({
        success: true,
        message: "Pontos adicionados com sucesso"
    });
}));

// get points
app.get('/api/point', asyncMiddleware(async (req, res) => {

    let points = await PointModel.find({
        location: {
            $near: {
                $maxDistance: 1000000000000000000000000,
                $geometry: {
                    type: "Point",
                    coordinates: [-21, -42]
                }
            }
        }
    });

    res.json({
        success: true,
        message: "Pontos buscados com sucesso",
        points
    });
}));

//create polygon
app.post('/api/polygon', asyncMiddleware(async (req, res) => {

    await new PolygonModel({
        name: 'Colorado',
        location: {
            "type": "Polygon",
            "coordinates": [[
                [-109, 41],
                [-102, 41],
                [-102, 37],
                [-109, 37],
                [-109, 41]
            ]]
        }
    }).save();

    res.json({
        success: true,
        message: "Cidade adicionada com sucesso"
    });
}));

// get polygons
app.get('/api/polygon', asyncMiddleware(async (req, res) => {

    const colorado = {
        type: 'Polygon',
        coordinates: [[
            [-109, 41],
            [-102, 41],
            [-102, 37],
            [-109, 37],
            [-109, 41]
        ]]
    };

    let polygons = await PolygonModel.find({
        // location: {
        //     $geoWithin: {
        //         $geometry: colorado
        //     }
        // }
    });

    res.json({
        success: true,
        message: "Polígonos buscados com sucesso",
        polygons
    });
}));

// api message
app.get('/api', function(req, res, next) {
    res.json({
        success: true,
        message: "Funcionando!"
    });
});

//error handler
app.use(function(err, req, res, next) {
    console.log("Catch error: ", err);

    res.json({
        success: false,
        message: "Erro: " + err.message,
        error: err
    });
});

// express listen to port
app.listen(port, function () {
    console.log('trabalho-bd-pos listening on port = '+port);
});
