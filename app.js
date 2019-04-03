const express = require('express');
const path = require('path');
// const assert = require('assert');
// const database = require('./src/database');

// let db = database.connect();
// console.log("db");

let app = express();
app.use(express.static(path.join(__dirname, 'public')));

//port that the application will run
let port = process.env.PORT || 5000;


//https://www.google.com/search?q=mongodb+and+google+maps&oq=mongodb+and+google+maps&aqs=chrome..69i57j69i65j69i60j0l3.3541j0j1&sourceid=chrome&ie=UTF-8

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:fo0emuxKydkjdTDD@cluster0-ax3iq.mongodb.net";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(async err => {
    console.log(err);
    const collection = client.db("test").collection("devices");

    // perform actions on the collection object
    // console.log(await collection.find());

    //find
    collection.find().toArray((err, items) => {
        console.log(items)
    });

    client.close();
});


// Use connect method to connect to the server
// mongodb.connect(url, function(err, client) {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");
//
//
//
//     // client.close();
// });

//collection
// const collection = db.collection('points')

//insert
// collection.insertOne({name: 'Roger'}, (err, result) => {
//
// });
// const item = await collection.findOne({name: 'Togo'})    //async/await

//find
// collection.find().toArray((err, items) => {
//     console.log(items)
// })

//find one
// collection.findOne({name: 'Togo'}, (err, item) => {
//     console.log(item)
// })

// API routes
// app.get('/api/', function(req, res, next) {
//     res.json({
//         success: true,
//         message: "Funcionando!"
//     });
// });

// express listen to port
app.listen(port, function () {
    console.log('trabalho-bd-pos listening on port = '+port);
});
