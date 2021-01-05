//const router = require('express').Router();
const { Router } = require('restify-router');

const api = require('./api');

const router = new Router();

router.get('/', (req, res, next) => {
    res.send('Hello World');
    next();
});

router.add('/api', api);

module.exports = router;