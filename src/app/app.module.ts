import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here
import { HttpModule } from '@angular/http';
import { DatePickerModule } from "angular-io-datepicker/src/datepicker/index";
import { OverlayModule } from "angular-io-overlay";

import { AppComponent }  from './app.component';
import { TaskDetailComponent } from './task-detail.component';
import { TaskNewComponent } from './task-new.component';
import { TasksComponent }     from './tasks.component';
import { TaskService }         from './task.service';
import { ListService } from './list.service';
import { ListNewComponent } from './list-new.component';
import { FiltersComponent }     from './filters.component';
import { TaskSearchComponent } from './task-search.component';
import { FiltersDirective } from './filters.directive';

import { AppRoutingModule } from './app-routing.module';



@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule, // <-- import the FormsModule before binding with [(ngModel)]
    AppRoutingModule,
    DatePickerModule,
    OverlayModule,

  ],
  declarations: [
    AppComponent,
    TaskDetailComponent,
    TaskNewComponent,
    TasksComponent,
    ListNewComponent,
    TaskSearchComponent,
    FiltersComponent,
    FiltersDirective,
  ],
  providers: [
    TaskService, ListService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
