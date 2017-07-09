import { TaskClientPage } from './app.po';

describe('task-client App', () => {
  let page: TaskClientPage;

  beforeEach(() => {
    page = new TaskClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
