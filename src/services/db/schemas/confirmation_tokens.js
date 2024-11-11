const { Model, DataTypes } = require('sequelize');
const UserModel = require('./user');


class ConfTokenModel extends Model {
    static init (sequelize) {
        return super.init({
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: UserModel,
                    key: 'id',
                }
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'confirmation_tokens',
            timestamps: false,
        });
    }
}

module.exports = ConfTokenModel;