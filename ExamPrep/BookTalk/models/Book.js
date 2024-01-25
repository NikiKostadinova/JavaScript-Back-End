const { Schema, model, Types} = require('mongoose');

const URL_PATTERN = /^https?:\/\/.+$/i;

const bookSchema = new Schema({
    title: { type: String, required: true, minlength: [2, 'Title must be at least 2 charcters long']},
    author: { type: String, required: true, minlength: [5, 'Author must be at least 5 charcters long']},
    genre: { type: String, required: true, minlength: [3, 'Genre must be at least 3 charcters long']},
    stars: { type: Number, required: true, min: [1, 'Stars must be between 1 and 5'], max: [5, 'Stars must be between 1 and 5']},
    imageUrl: {
        type: String, required: true, validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Image URL is not valid'
        }
    },
    review: { type: String, required: true, minlength: [10, 'Book review must be at least 10 charcters long']},
    wishList: { type: [Types.ObjectId], ref: 'User', default: []},
    owner: { type: Types.ObjectId, ref: 'User', required: true}
});

bookSchema.index({ title: 1}, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Book = model('Book', bookSchema);

module.exports = Book;