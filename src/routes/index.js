const router = require('express').Router();
const validators = require('../validators');
const courses = require('../courses');

const api = require('./api');

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.use('/api', api);

router.get('/api/courses', (req, res) => {
    res.send(courses);
});

router.post('/api/courses', (req, res) => {
    const result = validators.course.validate(req.body);
    const errors = result.errors();
    if (errors) {
        return res.status(400).send(errors);
    }
    const course = {
        id: courses.length,
        name: req.body.name
    };
    courses.push(course);
    return res.send(course);
});

router.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send(`The course with the given id "${req.params.id}" is not found.`);
    } else {
        return res.send(course);
    }
});

router.patch('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send(`The course with the given id "${req.params.id}" is not found.`);
    }
    course.name = req.body.name;
    const result = validators.course.validate(course);
    const errors = result.errors();
    if (errors) {
        return res.status(400).send(errors);
    }
    return res.send(course);
});

module.exports = router;