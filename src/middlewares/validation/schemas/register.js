const joi = require('joi');


const registerSchema = {
    body: joi.object({
        login: joi.string().min(3).max(24).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required().label('password'),
        passwordConfirm: joi.string()
            .required()
            .valid(joi.ref('password'))
            .messages({
                'any.only': 'Passwords must match',
            }),
        homepage: joi.string().max(255).allow('').optional(), 
    }),
}

module.exports = registerSchema;