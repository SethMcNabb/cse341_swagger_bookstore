const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');

// Simple local middleware to protect endpoints
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ status: 401, message: "Unauthorized access: Please log in via OAuth first." });
};

// Map routes directly to controller functions
router.get('/', booksController.getAllBooks);
router.post('/', ensureAuthenticated, booksController.createBook);
router.put('/:id', ensureAuthenticated, booksController.updateBook);
router.delete('/:id', ensureAuthenticated, booksController.deleteBook);

module.exports = router;