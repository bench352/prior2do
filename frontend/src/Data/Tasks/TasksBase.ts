import { Task } from "../schemas";

const localStore = require("store");
const { v4: uuidv4 } = require("uuid");

export abstract class TasksBase {
  abstract getTasks(): Promise<Task[]>;
  abstract getTaskById(id: string): Promise<Task>;
  abstract addTask(task: Task): any;
  abstract updateTask(taskToUpdate: Task): any;
  abstract deleteTaskById(id: string): any;
  abstract cleanupCompleted(): any;

  localGetTasks(): Task[] {
    return localStore.get("p2d.tasks");
  }
  localAddTask(task: Task) {
    let tasks = this.localGetTasks();
    tasks.push(task);
    this.updateTasksLocalStorage(tasks);
  }
  localUpdateTask(taskToUpdate: Task) {
    let tasks = this.localGetTasks();
    const updatedTasks = tasks.map((task: Task) =>
      task.id === taskToUpdate.id ? taskToUpdate : task
    );
    this.updateTasksLocalStorage(updatedTasks);
  }
  updateTasksLocalStorage(tasks: Task[]) {
    localStore.set("p2d.tasks", tasks);
  }
  getNewUniqueId(): string {
    return uuidv4();
  }
  localDeleteTaskById(id: string) {
    let tasks = this.localGetTasks();
    const updatedTasks = tasks.filter((task: Task) => task.id !== id);
    this.updateTasksLocalStorage(updatedTasks);
  }
}
