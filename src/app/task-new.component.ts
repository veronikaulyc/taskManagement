import { Component, DoCheck } from '@angular/core';
import { Location } from '@angular/common';
import { Task } from './task';
import { TaskService } from './task.service';
import * as helpers from './helpers';


@Component({
  selector: 'my-task-form',
  templateUrl: './task-detail.component.html',
  styleUrls: [ './task-detail.component.css' ]
})
export class TaskNewComponent implements DoCheck{

constructor(
  private taskService: TaskService,
  private location: Location
   ) { }

  priorities = helpers.priorities;
  periods = helpers.period;
  task = new Task('New task', this.priorities[0], false);
  isNew = true;
  oldStart = undefined;
  oldDue = undefined;
  oldEx = undefined;
  oldUnit = undefined;

  ngDoCheck() {
    const start = this.task.startDate;
    const due = this.task.dueDate;
    const ex = this.task.executionTime;
    const unit = this.task.units;
    let change = 0;
    if (start!= this.oldStart) { change = 1; }
    if (due!= this.oldDue) { change = 2; }
    if (ex!= this.oldEx) { change = 3; }
    if (unit!= this.oldUnit) { change = 4; }

    if (change){
      if (start && due && !ex){
        const ex = (Date.parse(due.toString()) - Date.parse(start.toString())) / 60000;
        if (ex > 0) {
          this.oldEx = helpers.calPeriod(ex).executionTime;
          this.oldUnit = helpers.calPeriod(ex).units;
          this.task.executionTime = this.oldEx;
          this.task.units = this.oldUnit;
        }

      }
      if (!start && due && ex && unit){
        this.task.startDate = new Date(Date.parse(due.toString()) - ex * helpers.calMiliSec(this.task.units));
        this.oldStart = this.task.startDate;
      }
      if (start && !due && ex && unit){
        this.oldDue = new Date(Date.parse(start.toString()) + ex * helpers.calMiliSec(this.task.units));
        this.task.dueDate = this.oldDue;
      }
      if (start && due && ex && unit){

        if (change === 1) {
          this.oldStart = this.task.startDate;
          this.oldDue = new Date(Date.parse(start.toString()) + ex * helpers.calMiliSec(this.task.units));
          this.task.dueDate = this.oldDue;
        }
        if (change === 2) {
          this.oldDue = this.task.dueDate;
          const ex = (Date.parse(due.toString()) - Date.parse(start.toString())) / 60000;
          if (ex > 0) {
            this.oldEx = helpers.calPeriod(ex).executionTime;
            this.oldUnit = helpers.calPeriod(ex).units;
            this.task.executionTime = this.oldEx;
            this.task.units = this.oldUnit;
          }
        }
        if (change === 3 || change === 4){
          this.oldUnit = this.task.units;
          this.oldEx = this.task.executionTime;
          this.oldDue = new Date(Date.parse(start.toString()) + ex * helpers.calMiliSec(this.task.units));
          this.task.dueDate = this.oldDue;
        }

      }

      this.oldDue = this.task.dueDate;
      this.oldStart = this.task.startDate;
      this.oldUnit = this.task.units;
      this.oldEx = this.task.executionTime;
    }
   }

  createNew(): void{
    console.log(JSON.stringify(this.task));
    this.taskService.create(this.task);
    }

    goBack(): void {
      this.location.back();
    }

    save(): void{}
}
