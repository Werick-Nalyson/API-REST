const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

const JWTsecret = "senhaminhaadmin";

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
    ],
    users: [
        {
            id: 1,
            name: "Victor Lima",
            email: "victorlima@gmail.com",
            password: "nodejs"
        },
        {
            id: 2,
            name: "Robert klaus",
            email: "robertklaus@gmail.com",
            password: "nodejs"
        },
        {
            id: 3,
            name: "Werick Nalyson",
            email: "wericknalyson@gmail.com",
            password: "nodejs"
        },
    ]
}

function auth(request, response, next) {
    const authToken = request.headers['authorization'];
    
    if (authToken != undefined) {
        const bearer = authToken.split(' ');
        let token = bearer[1];
        
        jwt.verify(token, JWTsecret, (err, data) => {
            if (err) {
                response.status(401).json({err: "Token inválido!"})
            } else {
                request.token = token;
                request.loggedUser = { id: data.id, email: data.email }
                next();
            }
        });

    } else {
        response.status(401).json({err: "Token inválido!"})
    }

}

app.post('/auth', (request, response) => {
    const { email, password } = request.body;

    if (email != undefined) {
        const user = DB.users.find(user => user.email == email);

        if (user != undefined) {
            if (user.password == password) {

                jwt.sign({ id: user.id, email: user.email }, JWTsecret, {expiresIn: '48h'}, (err, token) => {
                    if (err) {
                        return response.status(400).json({ err: "Falha interna" });        
                    } else {
                        return response.status(200).json({ token: token });
                    }
                });
            } else {
                return response.status(404).json({ err: "Credenciais inválidas" });
            }
        } else {
            return response.status(404).json({ err: "O E-mail enviado não existe na base de dados" });
        }
    } else {
        return response.status(404).json({ err: "O E-mail enviado é inválido" });
    }
});

app.get('/games', auth, (request, response) => {
    return response
        .status(200)
        .json({ user: request.loggedUser, games: DB.games });
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