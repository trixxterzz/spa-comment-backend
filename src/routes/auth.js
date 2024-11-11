const { Router } = require('express');
const { register, login, confirmRegistration } = require('../controllers');
const validate = require('../middlewares/validation');
const authenticate = require('../middlewares/auth');

const router = Router();

router.post('/register', validate, async (req, res, next) => {
    const { body: { login, password, email, homepage = null }} = req;
    try {
        const { message, status } = await register(login, email, password, homepage);

        res.status(status).send(message);
    } catch (e) {
        next(e);
    }
});

router.post('/login', validate, async (req, res, next) => {
    const { body: { identifier, password }} = req;
    try {
        const { message, status, data: { authToken, refreshToken, user} } = await login(identifier, password);

        res.cookie('auth', authToken, { maxAge: 20 * 60000, httpOnly: false, secure: true, sameSite: 'none' });
        res.cookie('refresh', refreshToken, { maxAge: 7 * 24 * 60 * 60000, httpOnly: false, secure: true, sameSite: 'none' });

        res.status(status).send({ message, user });
    } catch (e) {
        next(e);
    }
});

router.post('/confirm', validate, async (req, res, next) => {
    const { body: { token } } = req;
    try {
        const { message, status } = await confirmRegistration(token);

        res.status(status).send(message);
    } catch (e) {
        next(e);
    }
});

module.exports = router;