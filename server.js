const express = require('express');
const path = require('path');
let bodyParser = require("body-parser");
const database = require('./src/database');
const asyncMiddleware = require("./src/utils/asyncMiddleware");

const fs = require('fs');
const csv = require('fast-csv');

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


//conexão com o banco de dados
database.connect();

//create geometry
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

    let type = req.query.type;
    let lon = req.query.lon;
    let lat = req.query.lat;
    let radius = req.query.radius ? Number(req.query.radius) : 5000;
    let path = req.query.path;
    console.log("type = ", type);
    console.log("lon = ", lon);
    console.log("lat = ", lat);
    console.log("radius = ", radius);
    console.log("path = ", path);

    let query = {};
    if(type === "Circle"){
        query = {
            localizacao: {
                $near: {
                    $maxDistance: radius,
                    $geometry: {
                        type: "Point",
                        coordinates: [lon, lat]
                        // coordinates: [-46.605324401855455,-23.54017214893641]
                    }
                }
            }
        };
    }else if(type === "Polygon"){
        query = {
            localizacao: {
                $geoWithin: {
                    $geometry: {
                        type : "Polygon" ,
                        coordinates: JSON.parse(path)
                        // coordinates: [
                        //     [
                        //         [-46.63244689941405,-23.516563666356102],
                        //         [-46.64686645507811,-23.562517608332776],
                        //         [-46.57820190429686,-23.561573510861336],
                        //         [-46.63244689941405,-23.516563666356102]
                        //     ]
                        // ]
                    }
                }
            }
        };
    }

    let ocorrencias = await OcorrenciaModel
        .find(query)
        .limit(5000)
        .skip(0)
        .exec();

    res.json({
        success: true,
        message: "Ocorrências buscadas com sucesso",
        ocorrencias
    });
}));

//importa csv dos dados de boletins em SP
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
let port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log('trabalho-bd-pos listening on port = '+port);
});
