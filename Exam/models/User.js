const { Schema, model} = require('mongoose');

//TODO add User properties and validatation according to assignment
const userSchema = new Schema({
    username: { type: String, required: true, unique: true, minlength: [5, 'Username must be at least 5 characters long']},
    email: { type: String, required: true, minlength: [10, 'Email must be at least 10 characters long'] },
    hashedPassword: { type: String, required: true, minlength: [4, 'Password must be at least 4 characters long']}
});

userSchema.index({ username: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;