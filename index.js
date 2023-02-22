const express = require('express')
const bodyParser = require('body-parser')
const route = require('./router/app');
require('dotenv').config()
const app = express()

const http = require('http');

app.use(express.static('upload'));
app.use(express.static('imagefolder'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use('', route);

app.get('/', (req, res) => {
    res.send("Server Up And Working")
})

const server = http.Server(app);

server.listen(3002, () => { console.log('Server Up And Working',process.env.port) });
