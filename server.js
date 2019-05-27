const express = require('express');
const path = require('path');
let bodyParser = require("body-parser");
const database = require('./src/database');
const asyncMiddleware = require("./src/utils/asyncMiddleware");

const fs = require('fs');
const csv = require('fast-csv');


const PointModel = require("./src/models/point");
const PolygonModel = require("./src/models/polygon");
const GeometryModel = require("./src/models/geometry");
const OcorrenciaModel = require("./src/models/ocorrencia");


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

// API routes

//create point
app.post('/api/point', asyncMiddleware(async (req, res) => {

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

//create polygon
app.post('/api/geometry', asyncMiddleware(async (req, res) => {

    let type = req.body.type;
    let coordinates = req.body.coordinates;
    console.log("type =", type);
    console.log("coordinates =", coordinates);

    await new GeometryModel({
        name: type,
        location: {
            "type": type,
            "coordinates": coordinates
        }
    }).save();

    // await new GeometryModel({
    //     name: 'PrudenShopping',
    //     location: {
    //         "type": "Point",
    //         "coordinates": [-51.40741554392724, -22.115527197433412]
    //     }
    // }).save();
    //
    // await new GeometryModel({
    //     name: 'Museu',
    //     location: {
    //         "type": "Point",
    //         "coordinates": [-51.41130310096503, -22.11640242793752]
    //     }
    // }).save();
    //
    // await new GeometryModel({
    //     name: 'Unesp',
    //     location: {
    //         "type": "Point",
    //         "coordinates": [-51.40755702879477, -22.121802594724592]
    //     }
    // }).save();
    //
    // await new GeometryModel({
    //     name: 'Unesp',
    //     // location: {
    //     //     "type": "Polygon",
    //     //     "coordinates": [[
    //     //         [-51.40755702879477, -22.121802594724592],
    //     //         [-51.412369823285644, -22.119079631547432],
    //     //         [-51.40204264789077, -22.118055078830448],
    //     //         [-51.40244770208369, -22.11390681529527]
    //     //     ]]
    //     // }
    //     location: {
    //         "type": "Polygon",
    //         "coordinates": [[
    //             [-109, 41],
    //             [-102, 41],
    //             [-102, 37],
    //             [-109, 37],
    //             [-109, 41]
    //         ]]
    //     }
    // }).save();

    res.json({
        success: true,
        message: "Geometria adicionada com sucesso"
    });
}));

// get geometries
app.get('/api/geometry', asyncMiddleware(async (req, res) => {

    let geometries = await GeometryModel.find({
        // location: {
        //     $near: {
        //         $maxDistance: 1000000000000000000000000,
        //         $geometry: {
        //             type: "Point",
        //             coordinates: [-21, -42]
        //         }
        //     }
        // }
    });

    res.json({
        success: true,
        message: "Geometrias buscadas com sucesso",
        geometries
    });
}));

// get ocorrencias
app.get('/api/ocorrencias', asyncMiddleware(async (req, res) => {

    let ocorrencias = await OcorrenciaModel.find({
        // localizacao: {
        //     $near: {
        //         $maxDistance: 1000000000000000000000000,
        //         $geometry: {
        //             type: "Point",
        //             coordinates: [-21, -42]
        //         }
        //     }
        // }
        // localizacao: {
        //     $geoWithin: {
        //         $geometry: {
        //             type : "Polygon" ,
        //             coordinates: [ [ [ -54, -18 ], [ -41, -17 ], [ -41, -27 ], [ -57, -27 ], [ -54, -18 ] ] ]
        //         }
        //     }
        // }
    })
    .limit(500)
    .skip(0)
    .exec();


    //Lista de crimos
    // Furto (art. 155)
    // Roubo (art. 157)
    // Lesão corporal (art 129 § 9º)
    // Furto qualificado (art. 155, §4o.)
    // Lesão corporal culposa na direção de veículo automotor (Art. 303)
    // Lesão corporal seguida de morte (art. 129, §3o.)
    // A.I.-Drogas sem autorização ou em desacordo (Art.33, caput)

    res.json({
        success: true,
        message: "Ocorrências buscadas com sucesso",
        ocorrencias
    });
}));

//importa csv de crimes
app.get('/api/import/csv', function(req, res, next) {

    let stream = fs.createReadStream("boletins_complete.csv");   //Dados completos em: https://data.world/maszanchi/boletins-de-ocorrencia-sp-2016

    let csvStream = csv()
        .on("data", async function(data){
            console.log("DATA = ", data);
            console.log("numero_bo = ", data[0]);
            console.log("ano = ", data[9]);
            console.log("mes = ", data[10]);
            console.log("crime = ", data[12]);
            console.log("delegacia = ", data[5]);
            console.log("nome_departamento = ", data[6]);
            console.log("cidade = ", data[18]);
            console.log("logradouro = ", data[19]);
            console.log("localizacao = ", data[16], data[15]);

            if(data[16] && data[15] && data[16] !== 'NULL' && data[15] !== 'NULL'){
                await new OcorrenciaModel({
                    numero_bo: data[0],
                    ano: data[9],
                    mes: data[10],
                    crime: data[12],
                    delegacia: data[5],
                    nome_departamento: data[6],
                    cidade: data[18],
                    logradouro: data[19],
                    localizacao: {
                        "type": "Point",
                        "coordinates": [data[16], data[15]]
                    },
                }).save();
            }
        })
        .on("end", function(){
            console.log("done");
        });

    stream.pipe(csvStream);


    res.json({
        success: true,
        message: "Funcionou!"
    });
});


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
