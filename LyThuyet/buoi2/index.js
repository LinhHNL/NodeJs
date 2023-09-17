const express = require('express');

const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

app.listen(3000);

const tours = [
    { id: 0, name: 'Vuon Hoa Mat Duoc', cost: 100.99 },
    { id: 1, name: 'Co cung Tran Thu', cost: 50.95 },
]

app.get('/api/tours', (req, res) => res.json(tours))

app.get("/api/find/:name", (req, res) => {
    
    let name = req.params.name;
    let check = false;
    tours.forEach((elementTour) => {
        if (elementTour.name === name) {
            res.json(elementTour);
            check = true;
        }
    });
    if (check == false){
        res.status(404).send("There aren't any tours");
    }
})

app.get("/api/add/:name/:cost", (req, res) => {
    const newT = {id: tours[tours.length - 1].id + 1, name: req.params.name, cost: req.params.cost};
    tours.push(newT);
    res.json(tours);
})