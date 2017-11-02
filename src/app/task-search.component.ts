import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { TaskSearchService } from './task-search.service';
import { Task } from './task';

@Component({
  selector: 'task-search',
  templateUrl: './task-search.component.html',
  styleUrls: [ './task-search.component.css' ],
  providers: [TaskSearchService]
})
export class TaskSearchComponent implements OnInit {
  tasks: Observable<Task[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private taskSearchService: TaskSearchService,
    private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.tasks = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.taskSearchService.search(term)
        .map(tasks => {
         const regex = new RegExp(term, 'gi');
         for (let task of tasks){
           task.name = task.name.replace(regex, `<span class="hl">${term}</span>`);
           if (task.name.length > 53){
             task.name = task.name.slice(0,49)+"...";
         }
         }
         return tasks;

})
        // or the observable of empty tasks if there was no search term
        : Observable.of<Task[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<Task[]>([]);
      });
  }




  gotoDetail(task: Task): void {
    let link = ['/detail', task._id];
    this.router.navigate(link);
  }
}
