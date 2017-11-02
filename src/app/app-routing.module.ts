import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskDetailComponent }  from './task-detail.component';
import { TaskNewComponent }  from './task-new.component';
import { ListNewComponent }  from './list-new.component';
import { FiltersComponent} from './filters.component';

const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'detail/:id', component: TaskDetailComponent },
  { path: 'tasks',  component: FiltersComponent },
  { path: 'task-new', component: TaskNewComponent },
  {path: 'list-new', component: ListNewComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
