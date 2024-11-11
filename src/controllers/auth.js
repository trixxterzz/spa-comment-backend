const { Users, ConfirmationTokens, sequelize } = require('../services/db');
const { UniqueConstraintError, Op } = require('sequelize');
const HttpError = require('../helpers/error');
const { hashPassword, comparePasswords, randomString, HandlerResponse } = require('../helpers/utils');
const sendMail = require('../services/mailer');
const { generateAuthToken, generateRefreshToken } = require('../helpers/tokens');

const TOKEN_LENGTH = 20;

async function register(login, email, password, homepage) {
    const transaction = await sequelize.transaction();
    try {

        const hashed = hashPassword(password);

        const user = await Users.create({
            login,
            email,
            password: hashed,
            homepage: homepage === '' ? null : homepage,
        }, {
            transaction,
        });

        const regtoken = randomString(TOKEN_LENGTH);

        await ConfirmationTokens.create({
            user_id: user.id,
            token: regtoken,
        }, {
            transaction,
        });

        await sendMail(email, regtoken);

        await transaction.commit();

        return new HandlerResponse("User has been successfully registered", 200);
    } catch (e) {
        await transaction.rollback();
        switch (e.constructor) {
            case UniqueConstraintError:
                throw new HttpError('User with such email or login already exists', 400);
        }
        throw e;
    }
}

async function login(identifier, password) {
    try {
        const user = await Users.findOne({
            where: {
                [Op.or]: [
                    { login: identifier },
                    { email: identifier },
                ]
            },
        });

        if (!user) {
            throw new HttpError('Wrong login or password', 404);
        }
    
        const correct = comparePasswords(password, user?.password);
    
        if (!correct) {
            throw new HttpError('Invalid login or password', 400);
        }

        const authToken = generateAuthToken({ id: user.id })
        const refreshToken = generateRefreshToken({ id: user.id });

        const userData = { login: user.login, email: user.email, homepage: user.homepage };

        return new HandlerResponse("User has been successfully logged in", 200, { authToken, refreshToken, user: userData });
    } catch (e) {
        throw e;
    }
}

async function confirmRegistration(token) {
    const transaction = await sequelize.transaction();
    try {
        const unconfirmedUser = await Users.findOne({
            where: { confirmed: false},
            include: [{
                model: ConfirmationTokens,
                required: true,
                where: { token },
            }],
        });

        if (!unconfirmedUser){
            throw new HttpError('This user has been already confirmed or wrong confirmation token', 400);
        }

        const result = await Users.update({ confirmed: true }, {
            where: { id: unconfirmedUser.id, confirmed: false },
        }, {
            transaction,
        });

        await ConfirmationTokens.destroy({
            where: { token },
        });

        await transaction.commit();

        return new HandlerResponse('User has been successfully confirmed', 200);
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
}

const getUser = async (id) => await Users.findByPk(id);

module.exports = {
    register,
    login,
    confirmRegistration,
    getUser,
}