const { Model, DataTypes } = require('sequelize');
const UserModel = require('./user');


class CommentModel extends Model {
    static init (sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            text: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            author_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: UserModel,
                    key: 'id',
                },
            },
        }, {
            sequelize,
            tableName: 'comments',
            timestamps: true,
        });
    }
}

module.exports = CommentModel;