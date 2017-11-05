const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const TaskLists = require('../models/taskLists');
const config = require('./config'); // get our config file

//connection to the database
mongoose.connect(config.database, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to db");
});

var listRouter = express.Router();
listRouter.use(bodyParser.json());

listRouter.route('/')
.get(function (req, res, next) {
TaskLists.find({})
.sort({date: -1})
.limit(20)
.exec(function (err, list) {
        if (err) throw err;
        res.json(list);
    });
})

.post(function (req, res, next) {
    TaskLists.create(req.body, function (err, list) {
        if (err) throw err;
        res.json(list);
    });
})

.delete(function (req, res, next) {
    TaskLists.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

listRouter.route('/count/')
.post(function (req, res, next) {
    TaskLists.count(req.body, function (err, count) {
        if (err) throw err;
        res.json(count);
    });
});

listRouter.route('/:listId')
.get(function (req, res, next) {
    TaskLists.findById(req.params.listId, function (err, list) {
        if (err) throw err;
        res.json(list);
    });
})

.put(function (req, res, next) {
    TaskLists.findByIdAndUpdate(req.params.listId, {
        $set: req.body
    }, {
        new: true
    }, function (err, list) {
        if (err) throw err;
        res.json(list);
    });
})

.delete(function (req, res, next) {
    TaskLists.findByIdAndRemove(req.params.listId, function (err, resp) {
         if (err) throw err;
        res.json(resp);
    });
});

module.exports = listRouter;
