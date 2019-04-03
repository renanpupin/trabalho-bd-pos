const mongoClient = require('mongodb').MongoClient;

//auth
const user = "admin";
const password = "fo0emuxKydkjdTDD";

// Connection URL
const url = 'mongodb+srv://'+user+':'+password+'@cluster0-ax3iq.mongodb.net/test?retryWrites=true';

// Database Name
const dbName = 'trabalho-bd-pos';

exports.connect = async () => {
    let client = await mongoClient.connect(url, { useNewUrlParser: true });
    return client.db(dbName);
};