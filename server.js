const express = require('express');
const path = require('path');
let bodyParser = require("body-parser");
const database = require('./src/database');
const asyncMiddleware = require("./src/utils/asyncMiddleware");

const PointModel = require("./src/models/point");


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

    let point = await new PointModel({
        name: "ponto2",
        location: {
            type: "Point",
            coordinates: [-20.123, -41.123]
        },
    }).save();

    res.json({
        success: true,
        message: "Ponto adicionado com sucesso",
        point
    });
}));

// get points
app.get('/api/point', asyncMiddleware(async (req, res) => {

    let points = await PointModel.find({
        location: {
            $near: {
                $maxDistance: 1000000,
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
