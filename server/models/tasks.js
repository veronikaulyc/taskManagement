var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
    name: String,
    description: String,
    startDate: Date,
    dueDate: Date,
    priority: String,
    executionTime: Number,
    units: String,
    isDone: Boolean,
    listNameId: String,
    date: { type: Date, default: Date.now }

})
var Tasks = mongoose.model('Task', taskSchema);


module.exports = Tasks;
