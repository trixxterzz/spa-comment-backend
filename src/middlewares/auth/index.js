const { getUser } = require("../../controllers/auth");
const HttpError = require("../../helpers/error");
const { parseJWT } = require("../../helpers/tokens")

async function authenticate(req, res, next) {
    try {
        const { cookies: { auth, refresh }} = req;
        const { id, tokens } = parseJWT(auth, refresh);
        
        if (tokens) {
            res.cookie('auth', tokens.auth, { maxAge: 20 * 60000, httpOnly: false, secure: true, sameSite: 'none' });
            res.cookie('refresh', tokens.refresh, { maxAge: 7 * 24 * 60 * 60000, httpOnly: false, secure: true, sameSite: 'none' });
        }

        const user = await getUser(id);
        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        next(new HttpError('Invalid tokens', 403));
    }
}


module.exports = authenticate;