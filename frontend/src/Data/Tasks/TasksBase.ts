import { TaskV0 } from "../../components/storage/StorageBackend";

const localStore = require("store");
const { v4: uuidv4 } = require("uuid");


export abstract class TasksBase {
    abstract getTasks(): Promise<TaskV0[]>;
    abstract addTask(task: TaskV0): any;
    abstract updateTask(taskToUpdate: TaskV0): any;
    abstract deleteTaskById(id: string): any;
    abstract cleanupCompleted():any;
    
    localGetTasks(): TaskV0[] {
      return localStore.get("p2d.tasks");
    }
    localAddTask(task: TaskV0) {
      let tasks = this.localGetTasks();
      tasks.push(task);
      this.updateTasksLocalStorage(tasks);
    }
    localUpdateTask(taskToUpdate: TaskV0) {
      let tasks = this.localGetTasks();
      const updatedTasks = tasks.map((task: TaskV0) =>
        task.id === taskToUpdate.id ? taskToUpdate : task
      );
      this.updateTasksLocalStorage(updatedTasks);
    }
    updateTasksLocalStorage(tasks: TaskV0[]) {
      localStore.set("p2d.tasks", tasks);
    }
    getNewUniqueId(): string {
      return uuidv4();
    }
    localDeleteTaskById(id: string) {
      let tasks = this.localGetTasks();
      const updatedTasks = tasks.filter((task: TaskV0) => task.id !== id);
      this.updateTasksLocalStorage(updatedTasks);
    }
  }