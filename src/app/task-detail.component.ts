
import { Component, Input, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location}  from '@angular/common';
import { Task } from './task';
import { TaskService } from './task.service';
import * as helpers from './helpers';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: [ './task-detail.component.css' ]
})

export class TaskDetailComponent implements OnInit, DoCheck {
  @Input() task: Task;
  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private location: Location
  ){}


  isNew = false;
  oldStart = undefined;
  oldDue = undefined;
  oldEx = undefined;
  oldUnit = undefined;
  priorities = helpers.priorities;
  periods = helpers.period;

    ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.taskService.getTask(params.get('id')))
        .subscribe((task : Task) =>
          this.task = task
        );
        this.oldStart = this.task.startDate;
        console.log('start',this.task.startDate );
        this.oldDue = this.task.dueDate;
        console.log('due',this.task.dueDate );
        this.oldEx = this.task.executionTime;
        this.oldUnit = this.task.units;
        }

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
      }

    goBack(): void {
      this.location.back();
    }

    save(): void {
      this.taskService.update(this.task)
      .then(() => this.goBack());
    }

    markAsDone(): void {
      this.task.isDone = true;
      this.taskService.update(this.task)
      .then(() => this.goBack());
    }
}
