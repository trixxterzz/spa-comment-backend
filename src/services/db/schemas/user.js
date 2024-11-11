const { Model, DataTypes } = require('sequelize');


class UserModel extends Model {
    static init (sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            login: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            confirmed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            homepage: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'users',
            timestamps: false,
        });
    }
}

module.exports = UserModel;