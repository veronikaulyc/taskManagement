import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav>
    <a routerLink = '/tasks' routerLinkActive="active">Tasks</a>
    <a routerLink = '/list-new' routerLinkActive="active">New List</a>
    <a routerLink = '/task-new' routerLinkActive="active">New Task</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],


})

export class AppComponent {
  title = 'Task Management';

}
