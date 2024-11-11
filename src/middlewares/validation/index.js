const schemas = require('./schemas');

async function validation(req, res, next) {
    const { route: { path }, baseUrl } = req;

    const fullPath = (baseUrl + path);
    try {
        for (let field in schemas[fullPath]) {
            const value = req[field];
            req[field] = await schemas[fullPath][field].validateAsync(value);
        }
        next();
    } catch (e) {
        next(e);
    }
}

module.exports = validation;