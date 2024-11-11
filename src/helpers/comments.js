const { Comments, CommentsRelation, FileApplications, Users } = require('../services/db');
const { CommentPayload } = require('../helpers/utils');
const HttpError = require('./error');

async function getChildren(comment_id) {
    const children = (await Comments.findAll({
        include: [{
            model: CommentsRelation,
            where: {
                parent_id: comment_id,
            },
            attributes: [],
        }, {
            model: FileApplications,
            required: false,
            attributes: ['key', 'type'],
        }, {
           model: Users,
           required: false,
           attributes: ['login', 'email', 'homepage'], 
        }],
    }))?.map(el => el.toJSON());

    const childrenPayload = [];

    for (let child of children) {
        const comment = new CommentPayload({
            id: child.id,
            text: child.text,
            date: child.createdAt,
            author: child.UserModel,
            children: await getChildren(child.id, child.author_login),
            attachedFiles: child.FileAppModels,
        });
        childrenPayload.push(comment);
    }

    return childrenPayload;
}

const isActualParent = async (id) => !!(await Comments.findByPk(id));

const deleteById = async (id) => await Comments.destroy({ where: { id }});

const CRITERIAS = {
    EMAILS: 1,
    LOGINS: 2,
    DATES: 3,
};

const ORDERS = {
    ASC: 1,
    DESC: 2,
}

const getOrderCondition = (criteria, order) => {
    const fieldMapping = {
        [CRITERIAS.EMAILS]: 'email',
        [CRITERIAS.LOGINS]: 'login',
        [CRITERIAS.DATES]: 'createdAt'
    };

    const orderMapping = {
        [ORDERS.ASC]: 'ASC',
        [ORDERS.DESC]: 'DESC'
    };

    const field = fieldMapping[criteria];
    const sortOrder = orderMapping[order];

    if (!field || !sortOrder) {
        throw new HttpError('Unknown sort criteria or order values', 400);
    }
    if (field === 'login' || field === 'email') {
        return [Users, field, sortOrder];
    }

    return [field, sortOrder];
};

module.exports = {
    getChildren,
    isActualParent,
    deleteById,
    getOrderCondition,
    CRITERIAS,
    ORDERS,
}