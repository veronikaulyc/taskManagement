export class Task {
  constructor(
  public name: string,
  public priority: string,
  public isDone: boolean,
  public dueDate?: Date,
  public description?: string,
  public startDate?: Date,
  public executionTime?: number,
  public units?: string,
  public _id?: string,
  public listNameId?: string

  ){}

}
