module.exports = (...excludedkeys) => (req, res, next) => {
    if(req.body){
        for(let key in req.body){
            if(excludedkeys.includes(key) == false) {
                req.body[key] = req.body[key].trim();
            }
            
        }
    }

    next();
};