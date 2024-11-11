
const auth = require('./auth');
const comments = require('./comments');

module.exports = {
    ...auth,
    ...comments,
}