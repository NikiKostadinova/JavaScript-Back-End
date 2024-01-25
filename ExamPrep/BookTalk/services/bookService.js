const Book = require("../models/Book");


async function getAll() {
    return Book.find({}).lean();
}

async function createBook(book){
    return Book.create(book);;
}

async function getById(id) {
    return Book.findById(id).lean();
}

async function updateBook(id, book){
    const existing = await Book.findById(id);

    existing.title = book.title;
    existing.author = book.author;
    existing.genre = book.genre;
    existing.stars = book.stars;
    existing.imageUrl = book.imageUrl;
    existing.review = book.review;

    return existing.save();

}

async function getUserWishList(userId){
    return await Book.find({ wishList: userId }).lean();
}

async function wished(bookId, userId){
    const book = await Book.findById(bookId);

    book.wishList.push(userId);
    await book.save();
}

async function deleteById(id){
    return Book.findByIdAndDelete(id);
}

module.exports = {
    getAll,
    getById,
    deleteById,
    createBook,
    updateBook,
    wished,
    getUserWishList
}