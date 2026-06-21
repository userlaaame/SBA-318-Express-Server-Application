//custom middleware #2 the gatekeeper
export default function validateCreature(req, res, next) {
    const { name, type } = req.body;
    if (!name || !type) {
        const err = new Error('Both "name" and "type" are required'); 
        err.status = 400;
        return next(err);//The actual check: if either field is missing, reject.
    }
    next();
};