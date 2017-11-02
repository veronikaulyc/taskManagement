var mongoose = require('mongoose');

var taskListSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
      },
    isDone: Boolean,
    dueDate: Date,
    priority: String,
    date: { type: Date, default: Date.now }

})
var TaskLists = mongoose.model('TaskList', taskListSchema);

module.exports = TaskLists;
