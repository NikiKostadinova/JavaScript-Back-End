
const homeController = require('express').Router();
const gameService = require('../services/gameService')


homeController.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page',
        user: req.user
    });
});

homeController.get('/search', async (req, res) => {
    let name = req.query.name;
    let platform = req.query.platform;

    let game = await gameService.search(name, platform);

    if (game == undefined) {
        game = await gameService.getAll();
    }

    console.log(game);

    res.render('search', { game })
})

module.exports = homeController;
