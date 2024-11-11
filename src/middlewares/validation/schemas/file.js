const joi = require('joi');
const { validate } = require('uuid');

const keyFormat = (value, helpers) => {
    if (!value) return;

    return validate(value) ? value : helpers.message('File key must be valid uuid format');
}

const fileSchema = {
    params: joi.object({
        key: joi.string().custom(keyFormat).required(),
    }),
}

module.exports = fileSchema;