import express from "express"

const app = express();
const port = 3000;
//listening here
app.listen(port, () => {
    console.log("Listening on port: " + port);
})
//making the route here
app.get("/", (req, res) => {
    res.send("It works");
})
