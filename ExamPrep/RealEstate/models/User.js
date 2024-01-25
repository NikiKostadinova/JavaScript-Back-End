const { Schema, model, Types} = require('mongoose');
const { isEmail } = require('validator');

//TODO add User properties and validatation according to assignment
const userSchema = new Schema({
    name: { type: String, required: true, unique: true, validate: {
        validator: (value) => firstAndLastName(value),
        message: 'Please enter correct first name and last name'
    }},
    username: {type: String, required: [true, 'Username is required'], milength: [5, 'Username must be atleast 5 characters long']},
    hashedPassword: { type: String, required: true, milength: [4, 'Password must be at least 4 characters long']}
});

function firstAndLastName(str){
    return /^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(str);
}

userSchema.index({ username: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;