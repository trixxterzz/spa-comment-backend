const { Router } = require('express');
const comments = require('./comment');
const auth = require('./auth');

const router = Router();

router.use('/comments/', comments);
router.use('/auth/', auth);

module.exports = router;