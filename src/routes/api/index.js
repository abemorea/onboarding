//const router = require('express').Router();
const { Router } = require('restify-router');
const validators = require('../../validators');

const router = new Router();

router.get('/', (req, res, next) => {
    res.send('API is working...');
    return next();
});

router.get('/genres', async (req, res, next) => {
    const db = req.mongo.db('onboarding');
    const collection = db.collection('genres');
    let result = null;
    try {
        result = await collection.find({}).toArray();
    } catch (err) {
        res.send(500, err);
        return next();
    }
    res.send(result);
    return next();
});

router.post('/genres', async (req, res, next) => {
    const db = req.mongo.db('onboarding');
    const collection = db.collection('genres');
    const validation = validators.genres.validate(req.body);
    const errors = validation.errors();
    if (errors) {
        res.send(400, errors);
        return next();
    }
    const genre = {
        name: req.body.name
    };
    let result = null;
    try {
        result = await collection.insertOne(genre);
    } catch (err) {
        //console.log(err);
        if (err.code == 11000) {
            res.send(400, "Duplicate key");
            return next();
        } else {
            res.send(500, err);
            return next();
        }
        
    }
    res.send(result.ops[0]);
    return next();
});

router.get('/genres/:name', async (req, res, next) => {
    const db = req.mongo.db('onboarding');
    const collection = db.collection('genres');
    let result = null;
    try {
        result = await collection.findOne({name: req.params.name});
        //console.log(result);
    } catch (err) {
        res.send(500, err);
        return next();
    }
    if (!result) {
        res.send(404, `The genre with the name "${req.params.name}" was not found.`)
        return next();
    }
    res.send(result);
    return next();
});

router.patch('/genres/:name', async (req, res, next) => {
    const db = req.mongo.db('onboarding');
    const collection = db.collection('genres');
    let genre = null;
    try {
        genre = await collection.findOne({name: req.params.name});
    } catch (err) {
        res.send(500, err);
        return next();
    }
    if (!genre) {
        res.send(404, `The genre with the name "${req.params.name}" was not found.`);
        return next();
    }
    genre.name = req.body.name;
    const validation = validators.genres.validate(genre);
    const errors = validation.errors();
    if (errors) {
        res.send(400, errors);
        return next();
    }
    try {
        const result = await collection.replaceOne({name: req.params.name}, genre);
        //console.log(result);
    } catch (err) {
        //console.log(err);
        res.send(500, err);
        return next();
    }
    res.send(genre);
    return next();
});

router.del('/genres/:name', async (req, res, next) => {
    const db = req.mongo.db('onboarding');
    const collection = db.collection('genres');
    let result = null;
    try {
        result = await collection.deleteOne({name: req.params.name});
    } catch (err) {
        res.send(500, err);
        return next();
    }
    console.log(result);
    if (result.deletedCount !== 1) {
        res.send(404, `The genre with the name "${req.params.name}" was not found.`);
        return next();
    }
    res.send(`The genre with the name "${req.params.name}" was successfully deleted.`);
    return next();
});

module.exports = router;