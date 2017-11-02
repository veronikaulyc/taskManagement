import { Component, OnInit, Input, DoCheck} from '@angular/core';
import { FiltersDirective } from './filters.directive';
import { ListService } from './list.service';
import * as helpers from './helpers';

@Component({
  selector: 'filters',
  templateUrl: './filters.html',
  styleUrls: [ './app.component.css'],
  providers: [FiltersDirective]
})
export class FiltersComponent implements OnInit, DoCheck{
  constructor(
    private filtersDirective: FiltersDirective,
    private listService: ListService,
  ){}
  isDone : string;
  oldIsDone : string;
  startDateFrom: Date;
  oldStartDateFrom: Date;
  dueDateFrom : Date;
  oldDueDateFrom : Date;
  startDateTo: Date;
  oldStartDateTo: Date;
  dueDateTo : Date;
  oldDueDateTo : Date;
  query = <any>{isDone: false};
  sort = <any>{date: -1};
  queryVersion = 0;
  sortVersion = 0;
  priorities = [];
  selectedPriorities = [];
  lists = [];
  selectedLists = [];

setInitialFilter(){
  if (typeof(this.query["isDone"]) !== "undefined") {
    this.isDone = this.query["isDone"] ? "Done" : "Not Done";
  }
  else{
    this.isDone = "All"
  }
  this.oldIsDone = this.isDone;

  helpers.priorities.forEach(pr => this.priorities.push({
    priority: pr,
    checked: false,
    oldChecked: false
  }));

  this.listService.getLists()
  .then(lists => {
    lists.forEach(l => this.lists.push({
    list: l.name,
    checked: false,
    oldChecked: false
  }))
});
this.startDateFrom = null;
this.oldStartDateFrom = null;
this.dueDateFrom = null;
this.oldDueDateFrom = null;
this.startDateTo = null;
this.oldStartDateTo = null;
this.dueDateTo = null;
this.oldDueDateTo = null;
 }

handleEnter(target): void {
  this.filtersDirective.handleEnter(target);
}

handleLeave(target): void {
  this.filtersDirective.handleLeave(target);
}

sortFunc(e): void{
  this.sort = {};
  this.sort[e.target.name.split(".")[0]] = parseInt(e.target.name.split(".")[1]);
  this.sortVersion++;
}


queryBuilder (condition: string, value): void{

  const obj = {};
  obj[condition] = value;
  const c = (condition == "$or") ? Object.keys(value[0])[0] : condition;
  const queryKey = Object.keys(this.query)[0];
  const queryArray = this.query[queryKey];

  if (value == null){
    if ((queryKey == condition) || (queryKey == "$or" && Object.keys(queryArray[0])[0] == condition)) {
      this.query = {};
    }
    else {
      if (queryKey == "$and"){
        queryArray.forEach(item => {
          if (Object.keys(item)[0] == condition ||
          (Object.keys(item)[0] == "$or" && Object.keys(item[Object.keys(item)[0]])[0] == condition)) {
            queryArray.splice(queryArray.indexOf(item),1);
          }
      });
       if (queryArray.length < 2) {this.query = queryArray[0]};
      }
      }
  }
  else {
    if (helpers.isEmpty(this.query) || (queryKey == c)) {
      this.query = obj;
    }
    else if (queryKey == "$or"){
        c == Object.keys(queryArray[0])[0] ? this.query = obj : this.query = {"$and": [this.query, obj]};
      }
    else if (queryKey == "$and"){
          queryArray.forEach(item => {
            if (c == Object.keys(item)[0] ||
            (Object.keys(item)[0] == "$or" && Object.keys(item[Object.keys(item)[0]])[0] == c)) {
              queryArray.splice(queryArray.indexOf(item),1);
            }
          });
          this.query["$and"].push(obj);
      }
    else {
        this.query = {"$and": [this.query, obj]};
      }
}
}

ngOnInit(){
  this.setInitialFilter();
}
ngDoCheck(){
  if (this.isDone !== this.oldIsDone){
    if (this.isDone == "All") {
      this.queryBuilder("isDone", null);
    }
    if (this.isDone == "Not Done") {
      this.queryBuilder("isDone", false);
    }
    if (this.isDone == "Done") {
      this.queryBuilder("isDone", true);
    }
    this.queryVersion++;
    this.oldIsDone = this.isDone;
  }
  this.priorities.forEach(pr => {
    if (pr.checked !== pr.oldChecked) {
      pr.checked ? this.selectedPriorities.push({"priority": pr.priority}) :
      this.selectedPriorities.splice(helpers.objIndex(this.selectedPriorities,"priority", pr.priority), 1);
      if (this.selectedPriorities.length > 1) {
        this.queryBuilder("$or", this.selectedPriorities);
      }
      else if (this.selectedPriorities.length == 1) {
        this.queryBuilder("priority", this.selectedPriorities[0].priority);
      }
      else {
        this.queryBuilder("priority", null);
      }
      this.queryVersion++;
      pr.oldChecked = pr.checked;
    }
  });
  this.lists.forEach(l => {
    if (l.checked !== l.oldChecked) {
      l.checked ? this.selectedLists.push({"listNameId": l.list}) :
      this.selectedLists.splice(helpers.objIndex(this.selectedLists,"listNameId", l.list),1);
      if (this.selectedLists.length > 1) {
        this.queryBuilder("$or", this.selectedLists);
      }
      else if (this.selectedLists.length == 1) {
        this.queryBuilder("listNameId", this.selectedLists[0].list);
      }
      else {
        this.queryBuilder("listNameId", null);
      }
      this.queryVersion++;
      l.oldChecked = l.checked;
    }
  });
  if (this.dueDateFrom !== this.oldDueDateFrom || this.dueDateTo !== this.oldDueDateTo){
    if (this.dueDateTo == null && this.dueDateFrom == null) {
      this.queryBuilder("dueDate", null);
    }
    else if (this.dueDateTo == null){
      this.queryBuilder("dueDate", {"$gt": this.dueDateFrom});
    }
    else if (this.dueDateFrom == null) {
      this.queryBuilder("dueDate", {"$ls": this.dueDateTo});
    }
    else {
      this.queryBuilder("dueDate", {"$gt": this.dueDateFrom, "$ls" : this.dueDateTo})
    }
    this.queryVersion++;
    this.oldDueDateFrom = this.dueDateFrom;
    this.oldDueDateTo = this.dueDateTo;
  }
  if (this.startDateFrom !== this.oldStartDateFrom || this.startDateTo !== this.oldStartDateTo){
    if (this.startDateTo == null && this.startDateFrom == null) {
      this.queryBuilder("startDate", null);
    }
    else if (this.startDateTo == null){
      this.queryBuilder("startDate", {"$gt": this.startDateFrom});
    }
    else if (this.startDateFrom == null) {
      this.queryBuilder("startDate", {"$ls": this.startDateTo});
    }
    else {
      this.queryBuilder("startDate", {"$gt": this.startDateFrom, "$ls" : this.startDateTo})
    }
    console.log(this.query);
    this.queryVersion++;
    this.oldStartDateFrom = this.startDateFrom;
    this.oldStartDateTo = this.startDateTo;
  }
}
}
