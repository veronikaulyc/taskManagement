import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Task } from './task';
import { TaskList } from './taskList';
import { TaskService } from './task.service';
import { ListService } from './list.service';
import * as helpers from './helpers';

@Component({
  selector: 'my-list-form',
  templateUrl: './list.component.html',
  styleUrls: [ './task-detail.component.css' ]
})
export class ListNewComponent {

constructor(
  private listService: ListService,
  private taskService: TaskService,
  private location: Location
   ) { }

  priorities = helpers.priorities;
  list = new TaskList('', this.priorities[0], false);
  tasks: Task[] = [];
  task = new Task('Item Name', this.priorities[0], false);
  isNew = true;
  exists = false;

  checkExists(name: string): void{
    this.listService.getCount({"name": name})
    .then(count => this.exists = (count > 0));
  }

  createNew(): void{
    console.log(JSON.stringify(this.list));
    this.listService.create(this.list);
    this.tasks.forEach(t => {
      t.priority = this.list.priority;
      t.listNameId = this.list.name;
      if (this.list.dueDate) { t.dueDate = this.list.dueDate; }
      this.taskService.create(t)});
    }

    addTask(): void{
      const newTask = new Task (this.task.name, this.priorities[0], false);
      console.log('list duedate',this.list.dueDate);
      console.log('new task', JSON.stringify(newTask));
      console.log('tasks array', this.tasks);
      this.tasks.push(newTask);
      this.tasks.sort( (a: Task, b:Task) => helpers.compareTasks(a, b, 'name', 1) );
      this.task.name = "Item Name";
    }

    delete(task: Task): void{
    (task._id) ? this.taskService
      .delete(task._id)
      .then(() => {
        this.tasks = this.tasks.filter(h => h !== task);
        }):
        this.tasks = this.tasks.filter(h => h !== task);
    }
    goBack(): void {
      this.location.back();
    }

    save(): void{}


}
