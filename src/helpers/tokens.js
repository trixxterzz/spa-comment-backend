const jwt = require('jsonwebtoken');

const KEY = process.env.JWT_KEY;

const generateToken = (data, expiresIn) => jwt.sign(data, KEY, { expiresIn });
const generateAuthToken = (data) => generateToken(data, '20m');
const generateRefreshToken = (data) => generateToken(data, '7d');

const parseJWT = (auth, refresh) => {
    try {
        const { id } = jwt.verify(auth, KEY);
        return { id, tokens: null };
    } catch {
        const { id } =  jwt.verify(refresh, KEY);

        if (!id) {
            throw new Error();
        }

        const tokens = {
            auth: generateAuthToken({ id }),
            refresh: generateRefreshToken({ id }),
        };

        return { id, tokens };
    }
}

module.exports = {
    generateAuthToken,
    generateRefreshToken,
    parseJWT,
}