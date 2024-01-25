const Game = require('../models/Game');

async function search (name, platform){
    let result = await Game.find().lean();

    if(name){
        return (Game.find({ name: { $regex: name, $options: 'i' } }).lean());
    }
    if (!name && platform) {
        return (Game.find({ platform: platform }).lean());
    }

    return result;
}

async function getAll(){
    return Game.find({}).lean();
}

async function createGame(game){
    return Game.create(game);;
}

async function getById(id) {
    return Game.findById(id).lean();
}

async function updateGame(id, game){
    const existing = await Game.findById(id);

    existing.name = game.name;
    existing.imageUrl = game.imageUrl;
    existing.price = game.price;
    existing.description = game.description;
    existing.genre = game.genre;
    existing.platform = game.platform;    

    return existing.save();
}

async function deleteById(id){
    return Game.findByIdAndDelete(id);
}

async function bougthByUser(gameId, userId){
    const existing = await Game.findById(gameId);
    console.log(existing)
    existing.boughtBy.push(userId);    
    return existing.save();
}

module.exports = {
    getAll,
    getById,
    deleteById,
    createGame,
    updateGame,
    bougthByUser,
    search
   
}