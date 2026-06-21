const express = require('express');
const router = express.Router();
const validateCreature = require('../middleware/validateCreature');
let creatures = require('../data/habitats');

// TODO (later phase): this router was copied from creatures.js and needs adapting to
// habitats. A habitat only has { id, name, climate } — no type/danger. Still to do:
//   - rename the `creatures` variable -> `habitats` for clarity
//   - FIX GET '/' filter: it filters on type/danger (fields habitats don't have), so
//     ?type=/?danger= always return []. Filter on `climate` instead, e.g.
//       const { climate } = req.query;
//       if (climate) results = results.filter(h => h.climate === climate.toLowerCase());
//   - GET '/:id' works, but rename `creature` -> `habitat` and change the
//     "Creature not found" message to "Habitat not found"
//   - remove the unused validateCreature import above (no POST route here)
//   - decide if habitats should stay read-only (GET only) or need full CRUD per the rubric

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

module.exports = router;