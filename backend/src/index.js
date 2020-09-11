const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let DB = {
    games: [
        {
            id: 1,
            title: "Call of duty MW",
            year: 2019,
            price: 60
        },
        {
            id: 4,
            title: "Remant",
            year: 2020,
            price: 87
        },
        {
            id: 26,
            title: "Sea of thieves",
            year: 2018,
            price: 40
        }
    ]
}

app.get('/games', (request, response) => {
    return response
        .status(200)
        .json(DB.games);
});

app.get('/games/:id', (request, response) => {
    if (isNaN(request.params.id)) {
        response.statusSend(400);
    } else {

        const { id } = request.params;
        const game = DB.games.find(game => game.id == id);

        if (game != undefined) {
            return response.json(game);
        }

        return response.status(404).send("Not found");
    }
});

app.post('/game', (request, response) => {
    const { title, price, year } = request.body;

    DB.games.push({
        id: 23,
        title,
        year,
        price
    });

    response.status(200).send();
});

app.delete("/game/:id", (request, response) => {
    if (isNaN(request.params.id)) {
        response.sendStatus(400);
    } else {
        const { id } = request.params;
        const index = DB.games.findIndex(g => g.id == parseInt(id));

        if (index == -1) {
            response.status(404).send();
        } else {
            DB.games.splice(index, 1);
            response.status(200).send();
        }
    }
});

app.put("/game/:id", (request, response) => {

    if (isNaN(request.params.id)) {
        response.sendStatus(400);
    } else {
        const { id } = request.params;
        const game = DB.games.find(g => g.id == parseInt(id));

        if (game != undefined) {

            const { title, price, year } = request.body;

            title ? game.title = title : "";
            year ? game.year = year : "";
            price ? game.price = price : "";

            response.status(200).send();

        } else {
            response.status(404).send();
        }
    }

});

app.listen(3333);