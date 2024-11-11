const { Sequelize, Op } = require('sequelize');
const initializeModels = require('./models');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../../../comment_db.db'),
});

const initialized = initializeModels(sequelize);

module.exports = {
    ...initialized,
    sequelize,
    Op,
};