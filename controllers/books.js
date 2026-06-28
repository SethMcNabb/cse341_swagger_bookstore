const Book = require('../models/Book');
const mongoose = require('mongoose');

// GET all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });
    }
};

// POST a new book
const createBook = async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ status: 400, message: "Validation Failed", error: error.message });
    }
};

// PUT update a book
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: 400, message: "Invalid ID format specified." });
        }
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedBook) {
            return res.status(404).json({ status: 404, message: "Target book entry not found." });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(400).json({ status: 400, message: "Failed to update record", error: error.message });
    }
};

// DELETE a book
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: 400, message: "Invalid ID format specified." });
        }
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ status: 404, message: "Target book entry not found." });
        }
        res.status(200).json({ status: 200, message: "Book record successfully deleted from inventory." });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Server error during deletion", error: error.message });
    }
};

module.exports = {
    getAllBooks,
    createBook,
    updateBook,
    deleteBook
};