const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Tasks = require('../models/tasks');


//connection to the database
mongoose.connect('mongodb://localhost:27017/taskManagement', { useMongoClient: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to db");
});


var taskRouter = express.Router();
taskRouter.use(bodyParser.json());

taskRouter.route('/')
.get(function (req, res, next) {
Tasks.find({})
.sort({date: -1})
.limit(20)
.exec(function (err, task) {
        if (err) throw err;
        res.json(task);
    });
})

.post(function (req, res, next) {
    Tasks.create(req.body, function (err, task) {
        if (err) throw err;
        res.json(task);
    });
})

.delete(function (req, res, next) {
    Tasks.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

taskRouter.route('/count/')
.post(function (req, res, next) {
    Tasks.count(req.body, function (err, count) {
        if (err) throw err;
        res.json(count);
    });
});

taskRouter.route('/filtered/')
.post(function (req, res, next) {
    Tasks.find(req.body.query)
    .sort(req.body.sort)
    .limit(req.body.limit)
    .exec(function (err, task) {
            if (err) throw err;
            res.json(task);
        });
});

taskRouter.route('/search/:term')
.get(function (req, res, next) {
  //console.log('search for '+ req.params.term);
  Tasks.find({name: {$regex: req.params.term, $options:"i"}})
  .sort({date: -1})
  .limit(20)
  .exec(function (err, task) {
          if (err) throw err;
          res.json(task);
      });
      });

taskRouter.route('/:taskId')
.get(function (req, res, next) {
    Tasks.findById(req.params.taskId, function (err, task) {
        if (err) throw err;
        res.json(task);
    });
})

.put(function (req, res, next) {
    Tasks.findByIdAndUpdate(req.params.taskId, {
        $set: req.body
    }, {
        new: true
    }, function (err, task) {
        if (err) throw err;
        res.json(task);
    });
})

.delete(function (req, res, next) {
    Tasks.findByIdAndRemove(req.params.taskId, function (err, resp) {
         if (err) throw err;
        res.json(resp);
    });
});


module.exports = taskRouter;
