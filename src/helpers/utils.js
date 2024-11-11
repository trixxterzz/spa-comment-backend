const bcrypt = require('bcrypt');

const hashPassword = (password) => bcrypt.hashSync(password, 10);
const comparePasswords = (p1, p2) => bcrypt.compareSync(p1, p2);

function randomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }
  

class HandlerResponse {
    constructor(message, status, data = {}) {
        this.message = message;
        this.status = status;
        this.data = data;
    }
}

class CommentPayload {
    constructor({id, text, date, author, children = [], attachedFiles = []}) {
        this.id = id;
        this.text = text;
        this.date = date;
        this.author = author;
        this.children = children;
        this.attachedFiles = attachedFiles;
    }
}

module.exports = {
    hashPassword,
    comparePasswords,
    randomString,
    HandlerResponse,
    CommentPayload,
}