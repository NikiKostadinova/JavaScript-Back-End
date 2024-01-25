const { body, validationResult } = require('express-validator')
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');
const { isGuest } = require('../middleware/guards');

const authController = require('express').Router();

authController.get('/register', isGuest(),  (req, res) => {

   
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register', isGuest(),

body('email').isLength({ min: 10}).withMessage('Email must be at least 10 characters long'),
body('username').isLength({ min: 4}).withMessage('Username must be at least 4 characters long'),
body('password').isLength({ min: 3}).withMessage('Password must be at least 3 characters long'),



async (req, res) => {
    try {
        
        const { errors } = validationResult(req);
        // console.log(errors);
        if (errors.length > 0) {
            throw errors;
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match');
        }
        const token = await register( req.body.email, req.body.username, req.body.password);

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
    //TODO replace with actual view by assignment
    res.render('login', {
        title: 'Login Page'
    });
});

authController.post('/login', async (req, res) => {
    try {
       const token = await login(req.body.email, req.body.password);

       res.cookie('token', token);
       res.redirect('/'); //TODO replace with redirect by assignment
    } catch (error) {
        const errors = parseError(error);
        //TODO ass error display to actual template from assignment
        res.render('login', {
            title: 'Login Page',
            errors,
            body: {
                email: req.body.email
            }
        });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token'),
    res.redirect('/')
})

module.exports = authController;