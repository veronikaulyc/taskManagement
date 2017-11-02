'use strict';

import { Task } from './task';

//global variables
export const priorities = ["Important and urgent", "Urgent and not important",
"Important and not urgent", "Not important and not urgent"];

export const period = ["days", "hours", "minutes"];


//Date functions
export function calMiliSec(unit: string): number{
  if (unit == "days") {return 1000 * 3600 * 24}
  if (unit == "hours") {return 3600000}
  if (unit == "minutes") {return 60000}
  return -1;
};

export function calPeriod(ex: number): any{
  if (ex >= 1440) {
    return { executionTime : Math.round(ex / 144) / 10, units : "days" };
  }
  else if (ex >= 60){
    return { executionTime: Math.round(ex / 6) / 10, units : "hours" };
  }
  else {
    return { executionTime : Math.round(ex * 10) / 10, units : "minutes"};
  }
};

//Tasks
export function compareTasks(a: Task, b:Task, condition: string, order: number) : number {
  if (a[condition] > b[condition]) {
    return order;
  }
  if (a[condition] < b[condition]) {
    return -order;
  }
  else {
    return 0;
  }
}

//Objects
export function isEmpty(obj) : boolean{
  for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

export function objIndex(ar, condition: string, value): number{
  ar.forEach(item => {
    if (Object.keys(item)[0] == condition && item[Object.keys(item)[0]] == value) {
      return ar.indexOf(item);
    }
  });
  return -1;
}
