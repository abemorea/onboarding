const router = require('express').Router();
const validators = require('../../validators');

router.get('/', (req, res) => {
    return res.send('API is working...');
});

router.get('/genres', async (req, res) => {
    const db = req.app.locals.mongo.db('onboarding');
    const collection = db.collection('genres');
    let result = null;
    try {
        result = await collection.find({}).toArray();
    } catch (err) {
        return res.status(500).send(err);
    }
    return res.send(result);
});

router.post('/genres', async (req, res) => {
    const db = req.app.locals.mongo.db('onboarding');
    const collection = db.collection('genres');
    const validation = validators.genres.validate(req.body);
    const errors = validation.errors();
    if (errors) {
        return res.status(400).send(errors);
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
            return res.status(400).send("Duplicate key");
        } else {
            return res.status(500).send(err);
        }
        
    }
    return res.send(result.ops[0]);
});

router.get('/genres/:name', async (req, res) => {
    const db = req.app.locals.mongo.db('onboarding');
    const collection = db.collection('genres');
    let result = null;
    try {
        result = await collection.findOne({name: req.params.name});
        //console.log(result);
    } catch (err) {
        return res.status(500).send(err);
    }
    if (!result) {
        return res.status(404).send(`The genre with the name "${req.params.name}" was not found.`)
    }
    return res.send(result);
});

router.patch('/genres/:name', async (req, res) => {
    const db = req.app.locals.mongo.db('onboarding');
    const collection = db.collection('genres');
    let genre = null;
    try {
        genre = await collection.findOne({name: req.params.name});
    } catch (err) {
        return res.status(500).send(err);
    }
    if (!genre) {
        return res.status(404).send(`The genre with the name "${req.params.name}" was not found.`)
    }
    genre.name = req.body.name;
    const validation = validators.genres.validate(genre);
    const errors = validation.errors();
    if (errors) {
        return res.status(400).send(errors);
    }
    try {
        const result = await collection.replaceOne({name: req.params.name}, genre);
        //console.log(result);
    } catch (err) {
        //console.log(err);
        return res.status(500).send(err);
    }
    return res.send(genre);
});

router.delete('/genres/:name', async (req, res) => {
    const db = req.app.locals.mongo.db('onboarding');
    const collection = db.collection('genres');
    let result = null;
    try {
        result = await collection.deleteOne({name: req.params.name});
    } catch (err) {
        return res.status(500).send(err);
    }
    console.log(result);
    if (result.deletedCount !== 1) {
        return res.status(404).send(`The genre with the name "${req.params.name}" was not found.`);
    }
    return res.status(200).send(`The genre with the name "${req.params.name}" was successfully deleted.`);

});

module.exports = router;