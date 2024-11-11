const { Model, DataTypes } = require('sequelize');
const CommentModel = require('./comment');


class FileAppModel extends Model {
    static init (sequelize) {
        return super.init({
            comment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: CommentModel,
                    key: 'id',
                }
            },
            key: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'file_applications',
            timestamps: false,
        });
    }
}

module.exports = FileAppModel;