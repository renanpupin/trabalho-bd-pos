const mongoose = require("mongoose");

//auth
const user = "admin";
const password = "fo0emuxKydkjdT";

// Database Name
const dbName = 'trabalho-bd-pos';

// Connection URL
const uri = "mongodb://"+user+":"+password+"@ds155252.mlab.com:55252/"+dbName;
// console.log("URI", uri);

exports.connect = async () => {
    mongoose.connect(uri);

    mongoose.connection.on('error', function(err) {
        console.log("database connection error: ", err);
    });

    mongoose.connection.once('open', function() {
        console.log("database connected!");
    });
};