
const commentsSchema = require('./comment');
const loginSchema = require('./login');
const registerSchema = require('./register');
const fileSchema = require('./file');

const schemas = {
    '/auth/login': loginSchema,
    '/auth/register': registerSchema,
    '/comments/write': commentsSchema.POST,
    '/comments/': commentsSchema.GET,
    '/files/:key': fileSchema
}

module.exports = schemas;