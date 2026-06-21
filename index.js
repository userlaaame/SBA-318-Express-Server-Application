import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import creatureRoutes from "./routes/creatures.js";
import sightingRoutes from "./routes/sightings.js";
import habitatRoutes from "./routes/habitats.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express(); //Creates the Express application instance
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// View engine + static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //super important for the HTML, don't forget urlencode!!
app.use(logger); //custom middleware #1
app.use('/api/creatures', creatureRoutes);
app.use('/api/habitats', habitatRoutes);
app.use('/api/sightings', sightingRoutes);

app.get('/', async (req, res) => {    //rendered view
    const { default: creatures } = await import('./data/creatures.js'); //dynamic import
    res.render('index', { creatures });
});

//making the route here
app.get("/status", (req, res) => {
    res.send("It works")
});
//listening here
app.listen(port, () => {
    console.log("Listening on port: " + port)
});

app.use(errorHandler);//make sure this is last