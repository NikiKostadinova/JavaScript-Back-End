const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const hotelController = require("../controllers/hotelConttroller");
const profileController = require("../controllers/profileController");
const { hasUser } = require("../middleware/guards");

module.exports = (app) => {
   app.use('/', homeController);
   app.use('/auth', authController);
   app.use('/hotel', hasUser(), hotelController);
   app.use('/profile', profileController);


};