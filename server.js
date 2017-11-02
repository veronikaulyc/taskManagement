var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var routes = require('./server/routes/index');
var tasks = require('./server/routes/taskRouter');
var lists = require('./server/routes/listRouter');

var port = 3000;
var app = express();

// Parsers for POST data
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, './dist', 'favicon.ico')));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', routes);
app.use('/api/tasks',tasks);
app.use('/api/lists',lists);


// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.listen(port,function(){
  console.log('Server started on port '+port);
});
