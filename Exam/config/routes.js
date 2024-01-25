const authController = require("../controllers/authController");
const gameController = require("../controllers/gameController");
const homeController = require("../controllers/homeController");
const { hasUser } = require("../middleware/guards");
const router = require('express').Router();

module.exports = (app) => {
   app.use('/', homeController);
   app.use('/auth', authController);
   app.use('/game', hasUser(), gameController);
   
  
};