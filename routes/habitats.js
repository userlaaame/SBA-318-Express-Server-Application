import express from 'express';
import habitats from '../data/habitats.js';

const router = express.Router();

// TODO (later phase): this router was copied from creatures.js and needs adapting to
// habitats. A habitat only has { id, name, climate } — no type/danger. Still to do:
//   - rename the `creatures` variable -> `habitats` for clarity <- DONE (import + both routes)
//   - FIX GET '/' filter: it filters on type/danger (fields habitats don't have), so
//     ?type=/?danger= always return []. Filter on `climate` instead, e.g.
//       const { climate } = req.query;
//       if (climate) results = results.filter(h => h.climate === climate.toLowerCase());
//        <- DONE (lines 22-23 now filter on climate)
//   - GET '/:id' works, but rename `creature` -> `habitat` and change the
//     "Creature not found" message to "Habitat not found" <- DONE
//   - remove the unused validateCreature import above (no POST route here) <- DONE-ish:
//        commented out on line 2; can delete the line entirely to fully clean up
//   - decide if habitats should stay read-only (GET only) or need full CRUD per the rubric
//        <- STILL OPEN: no POST/PATCH/DELETE here yet — confirm read-only is OK for the SBA

//GET all and query-parameter filter
router.get('/', (req, res) => {
    let results = [...habitats];
    const { climate } = req.query;
    if (climate) results = results.filter(h => h.climate === climate.toLowerCase());
    res.json(results);
});

//GET one by route parameter
router.get('/:id', (req, res, next) => {
    const habitat = habitats.find(h => h.id === Number(req.params.id));
    if (!habitat) {
        const err = new Error('Habitat not found');
        err.status = 404;
        return next(err); //this hands to error-handling middleware...hopefully
    }
    res.json(habitat);
});

export default router;