var express = require('express');
var app = express();
var logger = require('morgan');

app
    .set('port', (process.env.PORT || 5000))
    .use(express['static'](__dirname + '/public'))
    .use(require('harp').mount(__dirname + '/public'))
    .set('views', __dirname + '/public')
    .set('view engine', 'jade')
    .use(logger('combined'))
    .use(require('./app/router'))
    .use(function(req, res) {
        res.send('404 not found');
    })
    .listen(app.get('port'), function() {
        console.log('Node app is running at localhost:' + app.get('port'));
    });
