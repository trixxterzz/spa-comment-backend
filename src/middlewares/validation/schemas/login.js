const joi = require('joi');


const loginSchema = {
    body: joi.object({
        identifier: joi.string().required(),
        password: joi.string().required(),
    }),
}

module.exports = loginSchema;