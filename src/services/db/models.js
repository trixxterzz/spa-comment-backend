const UserModel = require('./schemas/user');
const CommentModel = require('./schemas/comment');
const FileAppModel = require('./schemas/file_applications');
const ConfTokenModel = require('./schemas/confirmation_tokens');
const CommentRelationModel = require('./schemas/comments_relations');

function initializeModels(sequelize) {
    const Users = UserModel.init(sequelize);
    const Comments = CommentModel.init(sequelize);
    const FileApplications = FileAppModel.init(sequelize);
    const ConfirmationTokens = ConfTokenModel.init(sequelize);
    const CommentsRelation = CommentRelationModel.init(sequelize);

    Users.hasMany(Comments, { foreignKey: 'author_id' });
    Comments.belongsTo(Users, { foreignKey: 'author_id' });

    Comments.hasOne(CommentsRelation, { foreignKey: 'child_id' });
    CommentsRelation.belongsTo(Comments, { foreignKey: 'child_id' });

    Comments.hasMany(FileApplications, { foreignKey: 'comment_id' });
    FileApplications.belongsTo(Comments, { foreignKey: 'comment_id' });

    Users.hasOne(ConfirmationTokens, { foreignKey: 'user_id' });
    ConfirmationTokens.belongsTo(Users, { foreignKey: 'user_id' });

    return {
        Users,
        Comments,
        FileApplications,
        ConfirmationTokens,
        CommentsRelation,
    }
}

module.exports = initializeModels;