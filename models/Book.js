const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    publishDate: { type: Date },
    genres: [{ type: String }],
    stockQuantity: { type: Number, default: 0 },
    description: { type: String },
    isBestseller: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);