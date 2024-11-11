const joi = require('joi');

const { HtmlValidate } = require('html-validate');

const htmlvalidate = new HtmlValidate({
    rules: {
        "element-permitted-content": ["error", {
            "*": ["#text", "a", "code", "i", "strong"],
        }],
        "attribute-allowed": ["error", {
            "a": ["href", "title"],
            "code": [],
            "i": [],
            "strong": [],
        }],
        "require-closing-tags": "error",
        "attr-quotes": "error",
    },
})

const htmlValidator = (value, helpers) => {
    if (!value) return;

    const result = htmlvalidate.validateStringSync(value);
    console.log(result.results[0].messages);

    return result.valid ? value : helpers.message('Invalid comment format');
}

const commentSchema = {
    GET: {
        query: joi.object({
            page: joi.number().integer().min(1),
            criteria: joi.number().integer(),
            order: joi.number().integer(),
        }),
    },
    POST: {
        body: joi.object({
            parent_id: joi.number().integer().optional(),
            text: joi.string().max(288).required(),
            file: joi.object({
                key: joi.string().required(),
                type: joi.string().required(),
            }).optional(),
        }),
    }
}

module.exports = commentSchema;