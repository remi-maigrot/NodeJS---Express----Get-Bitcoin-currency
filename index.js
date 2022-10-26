const express = require('express');
const session = require('express-session');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3000;
let liste = ["harry potter", "avatar", "spiderman"];
let bitcoin = 0;

async function getBitcoin() {
    const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
    return response;
}

bitcoin = getBitcoin();

app.use('/static', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "iqH&7^l0308T%8c",
    resave: false,
    saveUninitialized: true,
}));

const logRequest = (req, res, next) => {
    const date = new Date().toLocaleTimeString();
    const methode = req.method;
    const url = req.originalUrl;
    console.log(`> ${date} - ${methode} ${url}`);
    next();
}

app.get('/', logRequest, (req, res) => {
    if (!req.session.vues) {
        req.session.vues = 0;
    }
    req.session.vues++;
    res.send(`Hello vous avez consulté cette page ${req.session.vues} fois !`);
});

app.get(`/bonjour/:name`, (req, res) => {
    const name = req.params.name;
    res.send(`Bonjour ${name}`);
});

app.get('/yo', (req, res) => {
    const prenom = req.query.prenom;
    const nom = req.query.nom;
    res.send(`Yo ${prenom} ${nom}`);
});

app.post('/form', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (password === "1234") {
        res.send("Connexion réussie");
    } else {
        res.redirect('/page');
    }
});

app.get('/view/:id', (req, res) => {
    const book = liste[req.params.id];
    res.send(`You reading ${book} !`);
});

app.get('/page', (req, res) => {
    res.sendFile(path.join(__dirname, "views/page.html"));
});

app.get('/bitcoin', (req, res) => {
    res.send(`Le bitcoin vaut : ${bitcoin}`);
});

app.use((req, res) => {
    res.status(404).send("Erreur 404 : page introuvable");
});

app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});