const { hasUser } = require('../middleware/guards');
const { getAll, getById, createGame, updateGame, deleteById, bougthByUser } = require('../services/gameService');
const { parseError } = require('../util/parser');

const gameController = require('express').Router();

gameController.get('/create', hasUser(), (req, res) => {

    res.render('create', {
        title: 'Create Page'
    });
});

gameController.post('/create', async (req, res) => {
    const game = {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
        genre: req.body.genre,
        platform: req.body.platform,       
        owner: req.user._id

    };

    try {
        await createGame(game);
        res.redirect('/game/catalog');
    } catch (error) {
        res.render('create', {
            title: 'Create Page',
            errors: parseError(error),
            body: game
        })
    }
})

gameController.get('/catalog', async (req, res) => {


    const games = await getAll();


    res.render('catalog', {
        title: 'Catalog Page',
        games,
        user: req.user
    });


});

gameController.get('/404', (req, res) => {
    res.render('404', {
        title: 'Not found'
    });
});

gameController.get('/:id', async (req, res) => {
    const game = await getById(req.params.id);
    
 
    if (req.user) {
        game.isOwner = game.owner.toString() == req.user._id.toString();
     
        game.bough = game.boughtBy.map(x => x.toString()).includes(req.user._id.toString());

        if(game.boughtBy.map(x => x.toString()).includes(req.user._id.toString())){
               game.isBougth = true;
        }

    }else {
        game.isVisitor = true;
    }
    

    res.render('details', {
        title: game.name,
        game
    });

});

gameController.get('/:id/delete', async (req, res) => {
    const game = await getById(req.params.id);

    if (game.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/game/catalog');
});

gameController.get('/:id/edit', async (req, res) => {
    const game = await getById(req.params.id);

    if (game.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit Game',
        game
    });
});

gameController.post('/:id/edit', async (req, res) => {
    const game = await getById(req.params.id);

    if (game.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    try {

        await updateGame(req.params.id, req.body);
        res.redirect(`/game/${req.params.id}`);

    } catch (error) {
        res.render('edit', {
            title: 'Edit Book',
            errors: parseError(error),
            game: req.body
        });
    }

});

gameController.get('/:id/bougth', async (req, res) =>{
    const game = await getById(req.params.id);

    
    if (game.owner.toString() != req.user._id.toString() && game.boughtBy.map(x => x.toString()).includes(req.user._id.toString()) == false) {
        await bougthByUser(req.params.id, req.user._id);
    }


    return res.redirect(`/game/${req.params.id}`);
})

module.exports = gameController;