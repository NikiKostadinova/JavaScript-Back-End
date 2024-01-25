const { body, validationResult} = require('express-validator');
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');

const authController = require('express').Router();

authController.get('/register', (req, res) => {

    
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register', 

body('username').isLength({ min: 5}).withMessage('Username must be at least 5 charcters long'),
body('email').isLength({ min: 10}).withMessage('Email must be at least 10 charcters long'),
body('password').isLength({ min: 4}).withMessage('Password must be at least 4 charcters long'),


async (req, res) => {
    try {
        const { errors } = validationResult(req);
        if (errors.length > 0) {
            console.log (errors);
            throw errors;
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match');
        }
        const token = await register(req.body.username, req.body.email, req.body.password);

        //TODO assignment if register creates session
        res.cookie('token', token);
        res.redirect('/'); 
    } catch (error) {

        const errors = parseError(error);
        //TODO ass error display to actual template from assignment
        res.render('register', {
            title: 'Register Page',
            errors,
            body: {
                email: req.body.email,
                username: req.body.username
            }
        });
    }
});

authController.get('/login', (req, res) => {
    
    res.render('login', {
        title: 'Login Page'
    });
});

authController.post('/login', async (req, res) => {
    try {
       const token = await login(req.body.username, req.body.password);

       res.cookie('token', token);
       res.redirect('/'); 
    } catch (error) {
        const errors = parseError(error);
        //TODO ass error display to actual template from assignment
        res.render('login', {
            title: 'Login Page',
            errors,
            body: {
                username: req.body.username
            }
        });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token'),
    res.redirect('/')
})

module.exports = authController;