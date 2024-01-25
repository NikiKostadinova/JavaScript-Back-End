const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /https?:\/\/./i;

const gameSchema = new Schema({
    name: { type: String, required: true, minlength: [4, 'Game name must be at least 4 characters long'] },
    imageUrl: {
        type: String, required: true, validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL'
        }
    },
    price: {
        type: Number, required: true, validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: 'Price must be a positive number'
        }
    },
    description: {
        type: String,
        minlength: [10, 'Game description must be at least 10 characters long'],

    },
    genre: { type: String, minlength: [2, 'Genre must be at least 2 characters long']},
    platform: {
        type: String,
        enum: ["PC", "Nintendo", "PS4", "PS5", "XBOX"]
    },
    boughtBy: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: { type: Types.ObjectId, ref: 'User'}
});

gameSchema.index({ title: 1}, {
    collation: {
        locale: 'en',
        strength: 2
    }
})

const Game = model('Game', gameSchema);

module.exports = Game;