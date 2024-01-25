const { hasUser } = require('../middleware/guards');
const { getUserWishList } = require('../services/bookService');


const profileController = require('express').Router();

profileController.get('/', hasUser(), async (req, res) => {
    const wishList = await getUserWishList(req.user._id);

    console.log(wishList)
    res.render('profile', {
        title: 'Profile Page',
        user: Object.assign({ wishList }, req.user)
    });
});

module.exports = profileController;