//error handling middleware - the destination for every next(err) 
//Express inspects the function's arity (argument count); a 4-arg 
//function is treated differently and only gets called when something passes an error to next(err). 
module.exports = function errorHandler(err, req, res, next) {
    const status = err.status || 500; // it defaults to 500 Internal Server Error, the generic "something went wrong on the server" code.
    res.status(status).json({ error: err.message });
};