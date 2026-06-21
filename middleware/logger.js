//custom middleware #1 it prints one line for every request that comes through, then lets the request continue.
module.exports = function logger(req, res, next) {
    console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl}`);// a timestamp in standard UTC format
    next();
};// every incoming request should be logged regardless of where it's headed. 