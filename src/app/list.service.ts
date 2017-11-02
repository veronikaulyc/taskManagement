import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { TaskList } from './taskList';

@Injectable()
export class ListService {
  private listUrl = '/api/lists/';  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

constructor(private http: Http) { }

getLists(): Promise<TaskList[]> {
  return this.http.get(this.listUrl)
             .toPromise()
             .then(
             response => response.json() as TaskList[])
             .catch(this.handleError);
}

  getList(id: string): Promise<TaskList> {
    const url = `${this.listUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as TaskList)
      .catch(this.handleError);
}

update(list: TaskList): Promise<TaskList> {
  const url = `${this.listUrl}/${list._id}`;
  return this.http
  .put(url, JSON.stringify(list), {headers: this.headers})
  .toPromise()
  .then(() => list)
  .catch(this.handleError);
}

create(list: TaskList): Promise<TaskList> {
  return this.http
    .post(this.listUrl, JSON.stringify(list), {headers: this.headers})
    .toPromise()
    .then(res => res.json() as TaskList)
    .catch(this.handleError);
}
delete(id: string): Promise<void> {
  const url = `${this.listUrl}/${id}`;
  return this.http.delete(url, {headers: this.headers})
    .toPromise()
    .then(() => null)
    .catch(this.handleError);
}

getCount(query: object): Promise<number> {
  const url = `${this.listUrl}/count/`;
  return this.http.post(url, JSON.stringify(query), {headers: this.headers})
    .toPromise()
    .then(res => res.json() as number)
    .catch(this.handleError);
}

private handleError(error: any): Promise<any> {
  console.error('An error occurred', error); // for demo purposes only
  return Promise.reject(error.message || error);
}
}
