const { hasUser, isGuest } = require('../middleware/guards');
const { createBook, getAll, getById, wished, deleteById, updateBook } = require('../services/bookService');
const { parseError } = require('../util/parser');


const bookController = require('express').Router();

bookController.get('/create', hasUser(), (req, res) => {

    res.render('create', {
        title: 'Create Page'
    });
});



bookController.post('/create', async (req, res) => {
    const book = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        stars: req.body.stars,
        imageUrl: req.body.imageUrl,
        review: req.body.review,
        owner: req.user._id

    };

    try {
        await createBook(book);
        res.redirect('/book/catalog');
    } catch (error) {
        res.render('create', {
            title: 'Create Page',
            errors: parseError(error),
            body: book
        })
    }
})

bookController.get('/catalog', async (req, res) => {


    const books = await getAll();


    res.render('catalog', {
        title: 'Catalog Page',
        books,
        user: req.user
    });


});

bookController.get('/404', (req, res) => {
    res.render('404', {
        title: 'Not found'
    });
});



bookController.get('/:id', async (req, res) => {
    const book = await getById(req.params.id);
    
 
    if (req.user) {
        book.isOwner = book.owner.toString() == req.user._id.toString();
        book.wished = book.wishList.map(x => x.toString()).includes(req.user._id.toString());

        if(book.wishList.map(x => x.toString()).includes(req.user._id.toString())){
               book.isWished = true;
        }

    }else {
        book.isVisitor = true;
    }
    

    res.render('details', {
        title: book.title,
        book
    });

});

bookController.get('/:id/delete', async (req, res) => {
    const book = await getById(req.params.id);

    if (book.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/');
});

bookController.get('/:id/edit', async (req, res) => {
    const book = await getById(req.params.id);

    if (book.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit Course',
        book
    });
});

bookController.post('/:id/edit', async (req, res) => {
    const book = await getById(req.params.id);

    if (book.owner.toString() != req.user._id.toString()) {
        return res.redirect('/auth/login');
    }

    try {

        await updateBook(req.params.id, req.body);
        res.redirect(`/book/${req.params.id}`);

    } catch (error) {
        res.render('edit', {
            title: 'Edit Course',
            errors: parseError(error),
            book: req.body
        });
    }

});

bookController.get('/:id/wish', async (req, res) =>{
    const book = await getById(req.params.id);

    
    if (book.owner.toString() != req.user._id.toString() && book.wishList.map(x => x.toString()).includes(req.user._id.toString()) == false) {
        await wished(req.params.id, req.user._id);
    }


    return res.redirect(`/book/${req.params.id}`);
})


module.exports = bookController;