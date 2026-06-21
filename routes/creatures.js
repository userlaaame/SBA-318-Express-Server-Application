import express from 'express';
import validateCreature from '../middleware/validatecreature.js';
import creatures from '../data/creatures.js';

const router = express.Router();
//GET all and query-parameter filter
router.get('/', (req, res) => {
    let results = [...creatures];
    const { type, danger } = req.query;
    if (type) results = results.filter(c => c.type === type.toLowerCase());
    if (danger) results = results.filter(c => c.danger === danger.toLowerCase());
    res.json(results);
});

//GET one by route parameter
router.get('/:id', (req, res, next) => {
    const creature = creatures.find(c => c.id === Number(req.params.id));
    if (!creature) {
        const err = new Error('Creature not found');
        err.status = 404;
        return next(err); //this hands to error-handling middleware...hopefully
    }
    res.json(creature);
});

//POST-i want the validation middleware to run only on this route
router.post('/', validateCreature, (req, res) => { //If validation fails, that middleware sends an error response and never calls next(), so the handler below never runs.
    const newCreature = {
        id: creatures.length ? creatures[creatures.length - 1].id + 1 : 1,
        name: req.body.name,
        type: req.body.type.toLowerCase(),
        habitatId: Number(req.body.habitatId) || null,//convert the incoming value to a number; if it's missing or not a number
        danger: req.body.danger || 'unknown' //if danger wasn't provided, default to the string 'unknown'
    };
    creatures.push(newCreature);
    res.status(201).json(newCreature); //201 Created, gimme my points plzzzz
});

//PATCH - handler for updating one existing creature.
// TODO (later phase): add validation here. Unlike POST, this route has no
// validateCreature middleware, so req.body fields (e.g. type casing) go in unchecked.
router.patch('/:id', (req, res, next) => { // the client sends only the fields they want to change, not the whole object.
    const creature = creatures.find(c => c.id === Number(req.params.id)); //converts it so the === comparison against the numeric c.id actually matches.
    if (!creature) {
        const err = new Error('Creature not found');
        err.status = 404;
        return next(err);
    }//If nothing matched, find returns undefined. It builds an Error, tags it with status = 404, and passes it to next(err)
    // TODO (later phase): protect the id before this assign — a client could send
    // { "id": 999 } and overwrite it, breaking the "last id + 1" logic in POST.
    Object.assign(creature, req.body);
    res.json(creature);
});

//DELETE - removes one creature by id.
router.delete('/:id', (req, res, next) => {
    const index = creatures.findIndex(c => c.id === Number(req.params.id));
    if (index === -1) {//You need the array position (not the object itself) because removing an item requires knowing where it sits in the array. 
        const err = new Error('Creature not found');
        err.status = 404;
        return next(err);
    }
    const [removed] = creatures.splice(index, 1);// removes 1 element starting at index, mutating the array in place. 
    res.json(removed);//Responds with the deleted object as JSON (200 OK).
});

export default router;