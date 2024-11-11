const { getChildren, isActualParent, getOrderCondition, CRITERIAS, ORDERS } = require('../helpers/comments');
const HttpError = require('../helpers/error');
const { HandlerResponse, CommentPayload } = require('../helpers/utils');
const { Comments, CommentsRelation, FileApplications, sequelize, Op, Users } = require('../services/db');

const PAGE_LIMIT = 25;


async function getComments(page = 1, criteria = CRITERIAS.DATES, order = ORDERS.DESC) {
    const orderCondition = getOrderCondition(criteria, order);
    console.log(orderCondition);
    const comments = (await Comments.findAll({
        limit: PAGE_LIMIT,
        offset: PAGE_LIMIT * (page - 1),
        order: [
            orderCondition,
        ],
        where: {
            id: {
                [Op.notIn]: sequelize.literal(`(
                    SELECT DISTINCT "child_id" FROM "comments_relations"
                    WHERE "child_id" IS NOT NULL
                )`)
            }
        },
        include: [{
            model: FileApplications,
            required: false,
            attributes: ['key', 'type']
        }, {
            model: Users,
            required: false,
            attributes: ['login', 'email', 'homepage'],
        }],
    }))?.map(el => el.toJSON());

    //console.log(comments);

    const count = await Comments.count({
        where: {
            id: {
                [Op.notIn]: sequelize.literal(`(
                    SELECT DISTINCT "child_id" FROM "comments_relations"
                    WHERE "child_id" IS NOT NULL
                )`)
            }
        },
    });

    const composedComments = [];
    for (let comment of comments) {
        const commentPayload = new CommentPayload({
            id: comment.id,
            text: comment.text,
            date: comment.createdAt,
            author: comment.UserModel,
            children: await getChildren(comment.id),
            attachedFiles: comment.FileAppModels,
        });
        composedComments.push(commentPayload);
    }

    return new HandlerResponse("", 200, {
        count,
        page,
        comments: composedComments,
    });
}

async function writeComment(user, payload) {
    const transaction = await sequelize.transaction();
    try {

        const res = await Users.findOne({
            where: {
                id: user.id,
                confirmed: true,
            },
        });

        if (!res) {
            throw new HttpError('Only confirmed users can write comments. Check your email.', 403);
        }

        const { parent_id, file } = payload;
        if (parent_id && !(await isActualParent(parent_id))) {
            throw new HttpError('Trying to reply to unexisting comment', 404);
        }
    
        const result = await Comments.create({
            text: payload.text,
            author_id: user.id,
        }, {
            transaction,
        });

        parent_id && await CommentsRelation.create({
            parent_id,
            child_id: result.id,
        }, {
            transaction,
        });

        file && await FileApplications.create({
            comment_id: result.id,
            key: file.key,
            type: file.type,
        }, {
            transaction,
        });

        await transaction.commit();
    
        return new HandlerResponse('Successfully written comment', 201, {
            id: result.id,
            date: result.createdAt,
            author: {
                login: user.login,
                email: user.email,
            }
        });
    } catch (e) {
        console.error(e);
        await transaction.rollback();
        throw e;
    }
}

async function getApplication(key){
    const result = await FileApplications.findOne({
        where: { key },
    });

    if (!result) {
        throw new HttpError('Such file does not exist', 404);
    }

    return new HandlerResponse('', 200, {});
}


module.exports = {
    getComments,
    writeComment,
}