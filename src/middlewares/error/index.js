const HttpError = require('../../helpers/error');
const { DatabaseError } = require('sequelize');

async function errorHandler(err, req, res, next) {
    const error = {
        message: "Bad request",
        status: 400,
    };

    switch(err.conctructor) {
        case HttpError:
            error.message = err.message;
            error.status = err.code;
        case DatabaseError:
            error.message = 'Something went wrong';
            error.status = 500;
        default:
            error.message = err?.message || err || error.message;
    }

    res.status(error.status).send(error);
}

module.exports = errorHandler;