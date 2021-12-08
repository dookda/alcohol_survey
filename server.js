const express = require("express");
const app = express();
const port = 4000;


const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.options('*', cors());


// const whk = require('./service/webhook');
// app.use(whk);

app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

const api = require('./service/api');
app.use(api);

app.use('/', express.static('www'))

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})