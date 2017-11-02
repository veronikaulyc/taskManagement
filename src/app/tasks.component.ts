import { Component, OnInit, Input, DoCheck} from '@angular/core';
import { Router } from '@angular/router';

import { Task } from './task';
import { TaskService } from './task.service';
import { FiltersComponent} from './filters.component';
import * as helpers from './helpers'

@Component({
  selector: 'my-tasks',
  templateUrl: './task.component.html',
  styleUrls: ['./app.component.css'],
})

export class TasksComponent implements DoCheck, OnInit {
  @Input() query: object;
  @Input() sort: object;
  @Input() queryVersion: number;
  @Input() sortVersion: number;
  limit = 20;
  oldQueryVersion = 0;
  oldSortVersion = 0;
  tasks: Task[];
  selectedTask: Task;
  lastChecked: Task;
  count: number;


  constructor(
    private taskService: TaskService,
    private router: Router) { }

  getTasks(): void {
    this.taskService.getFilteredTasks(this.query, this.sort, this.limit)
    .then(tasks => this.tasks = tasks)
    .then(tasks => {
      for (let task of tasks) {
        if (task.name.length > 40){
        task.name = task.name.slice(0,36)+"...";
      }}
    });
  }
  getCount(q: object): void {
    this.taskService.getCount(q)
    .then(count => this.count = count);
  }

  delete(task: Task): void {
  this.taskService
      .delete(task._id)
      .then(() => {
        this.tasks = this.tasks.filter(h => h !== task);
        if (this.selectedTask === task) { this.selectedTask = null; }
      });
}


ngOnInit(){
  this.getTasks();
  this.getCount(this.query);
}

ngDoCheck() {
  if (this.queryVersion !== this.oldQueryVersion) {
    this.getTasks();
    this.getCount(this.query);
    this.oldQueryVersion = this.queryVersion;
  }
  if (this.sortVersion !== this.oldSortVersion) {
    if (this.tasks.length == this.count){
      this.tasks.sort((a: Task, b:Task) => helpers.compareTasks(a, b, Object.keys(this.sort)[0], this.sort[Object.keys(this.sort)[0]])
      );
    }
    else {
      this.getTasks();
    }

    this.oldSortVersion = this.sortVersion;
  }
}

  onSelect(task: Task): void {
    this.selectedTask = task;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedTask._id]);
}

 handleCheck(e: any, task:Task): void {
  let inBetween = false;
  if (e.shiftKey && !task.isDone){
      //loop over every single task
      this.tasks.forEach(t =>{
        if (t == task || t == this.lastChecked){
          inBetween = !inBetween;
        }
        if (inBetween){
          t.isDone = true;
        }
      });

  }
  this.lastChecked = task;
}
saveAll(): void {
  this.tasks.forEach(task => this.taskService.update(task));
  this.getTasks();
  this.getCount(this.query);
}
}
