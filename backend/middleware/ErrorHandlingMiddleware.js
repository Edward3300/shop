const ResponseError = require('../errors/ResponseError');

module.exports = function (err, req, res, next) {
   
    if (err instanceof ResponseError) {
        return res.status(err.status).json({message: err.message});
    }
    return res.status(500).json({message: "Связь с сервером прервано."});
    
}