const { Router } = require('express');
const validate = require('../middlewares/validation');
const authenticate = require('../middlewares/auth');
const { getComments, writeComment } = require('../controllers');
const { deleteFile } = require('../services/s3');

const router = Router();

router.get('/', validate, authenticate, async (req, res, next) => {
    const { query: { page, criteria, order } } = req;
    try {
        const { status, data } = await getComments(page, criteria, order);

        res.status(status).send(data);
    } catch(e) {
        next(e);
    }
});

router.post('/write', validate, authenticate, async (req, res, next) => {
    const { body, user } = req;
    try {
        const { message, status, data } = await writeComment(user, body);

        res.status(status).send({ message, data });
    } catch (e) {
        body.fileKey && await deleteFile(body.fileKey);
        next(e);
    }
});

module.exports = router;