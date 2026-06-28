const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/api/books', require('./books'));

router.get('/', (req, res) => {
    res.send('Bookstore API is active. <a href="/auth/github">Login with GitHub</a> to unlock endpoints.');
});

module.exports = router;