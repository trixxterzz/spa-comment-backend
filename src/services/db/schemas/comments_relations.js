const { Model, DataTypes } = require('sequelize');
const CommentModel = require('./comment');

class RelationModel extends Model {
    static init (sequelize) {
        return super.init({
            parent_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // references: {
                //     model: CommentModel,
                //     key: 'id',
                // },
            },
            child_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: CommentModel,
                    key: 'id',
                },
            },
        }, {
            sequelize,
            tableName: 'comments_relations',
            timestamps: false,
        })
    }
}

module.exports = RelationModel;