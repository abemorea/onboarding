//const express = require('express');
const restify = require('restify');
const { Router } = require('restify-router');
const { MongoClient } = require('mongodb');
const routes = require('./routes');


(async function () {

    const mongoURI = 'mongodb://127.0.0.1:27017/';
    const mongoClient = new MongoClient(mongoURI, { useUnifiedTopology:true });
    try {
        await mongoClient.connect();
    } catch(err) {
        console.log(err);
        process.exit(1);
    }

    try {
        await mongoClient.db('onboarding').collection('genres').createIndex({name: 'text'}, {unique: true});
    } catch(err) {
        console.log(err);
        process.exit(1);
    }

    const server = restify.createServer();

    server.use((req, res, next) => {
        req.mongo = mongoClient;
        next();
    });
    server.use(restify.plugins.bodyParser());
    const router = routes;
    router.applyRoutes(server);

    /*server.get('/', (req, res, next) => {
        console.log(this);
        res.send('HOME');
        next();
    });*/


    const port = process.env.PORT || 3000;

    server.listen(port, () => {
        console.log(`Listening on port ${port}...`);
    });


    
    /*const app = express();

    app.locals.mongo = mongoClient;

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(routes);
    
    const port = process.env.PORT || 3000;
    
    app.listen(port, () => {
        console.log(`Listening on port ${port}...`);
    });*/

})();
