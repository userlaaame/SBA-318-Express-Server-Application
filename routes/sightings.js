const express = require('express');
const router = express.Router();
const validateCreature = require('../middleware/validateCreature');
let creatures = require('../data/sightings');

// TODO (later phase): this router was copied from creatures.js and is only partly
// adapted to sightings. Still to do:
//   - data/sightings.js must exist for the require above to work
//     (e.g. { id, creatureId, location, date } objects)
//   - rename the `creatures` variable -> `sightings` for clarity
//   - GET '/:id' and POST below still use creature fields/messages
//     (name, type, habitatId, danger, "Creature not found", newCreature) —
//     rewrite them to use sighting fields, so a POST here adds a *sighting* not a creature
//   - swap validateCreature for a sightings-specific validator
// NOTE: the GET '/' filter (s.creatureId) is already correct for sightings — it just
// needs matching data to filter against.

//GET all and query-parameter filter
router.get('/', (req, res) => {
    let results = [...creatures];
    if (req.query.creatureId) {
        results = results.filter(s => s.creatureId === Number(req.query.creatureId));
    }
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

module.exports = router;