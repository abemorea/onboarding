const Joi = require('joi');

class Validator {
    constructor(schema) {
        this.schema = schema;
    }

    validate(data) {
        const result = this.schema.validate(data);
        result.errors = () => {
            if (result.error) {
                const errors = {};
                for (const err of result.error.details) {
                    errors[err.path.join('.')] = err.message;
                }
                return (errors);
            }
            return (null);
        };
        return (result);
    }
}

module.exports = {
    course: new Validator(
        Joi.object({
            name: Joi.string().min(3).required()
        })
    ),
    genres: new Validator(
        Joi.object({
            _id: Joi.any(),
            name: Joi.string().min(3).required(),
        })
    )
}