var https = require('https');
var fs = require('fs');
const express = require('express');
const app = express();

// var https_options = {
//     key: fs.readFileSync("/etc/apache2/ssl/private.key"),
//     cert: fs.readFileSync("/etc/apache2/ssl/public.crt"),
//     ca: fs.readFileSync('/etc/apache2/ssl/intermediate.crt')
// };

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.options('*', cors());

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

// var server = https.createServer(https_options, app);
var port = process.env.PORT || 4000;
app.listen(port, function () {
    console.log('listening on port ' + port);
});

//app.listen(3100, () => {
//    console.log('running on http://localhost:3100..')
//});
// app.use(express.static(__dirname + '/www'));

