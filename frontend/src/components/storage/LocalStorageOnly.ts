import { Task } from "./StorageBackend";

const localStore = require("store");
const FileSaver = require("file-saver");
const { v4: uuidv4 } = require("uuid");

export default class LocalStorageOnly {
  async getTasks(): Promise<Task[]> {
    return this.localGetTasks();
  }

  localGetTasks(): Task[] {
    return localStore.get("p2d.tasks");
  }

  async getTaskById(id: string): Promise<Task> {
    let tasks = await this.getTasks();
    for (const task of tasks) {
      if (task.id === id) {
        return task;
      }
    }
    throw new Error("Task not found");
  }

  async addTask(task: Task) {
    this.localAddTask(task);
    this.localSetLastUpdatedTimestamp();
  }

  localAddTask(task: Task) {
    let tasks = this.localGetTasks();
    tasks.push(task);
    this.updateTasksLocalStorage(tasks);
  }

  async updateTask(taskToUpdate: Task) {
    this.localUpdateTask(taskToUpdate);
    this.localSetLastUpdatedTimestamp();
  }

  async localUpdateTask(taskToUpdate: Task) {
    let tasks = this.localGetTasks();
    const updatedTasks = tasks.map((task: Task) =>
      task.id === taskToUpdate.id ? taskToUpdate : task
    );
    this.updateTasksLocalStorage(updatedTasks);
  }

  async deleteTaskById(id: string) {
    this.localDeleteTaskById(id);
    this.localSetLastUpdatedTimestamp();
  }

  localDeleteTaskById(id: string) {
    let tasks = this.localGetTasks();
    const updatedTasks = tasks.filter((task: Task) => task.id !== id);
    this.updateTasksLocalStorage(updatedTasks);
  }

  updateTasksLocalStorage(tasks: Task[]) {
    localStore.set("p2d.tasks", tasks);
  }

  isSyncEnabled(): boolean {
    return localStore.get("p2d.syncEnabled");
  }

  setIsSyncEnabled(value: boolean) {
    localStore.set("p2d.syncEnabled", value);
  }

  getNewUniqueId(): string {
    return uuidv4();
  }

  localGetLastUpdatedTimestamp(): number {
    let result = localStore.get("p2d.lastUpdated");
    return parseInt(result ? result : "0");
  }

  localSetLastUpdatedTimestamp() {
    localStore.set("p2d.lastUpdated", Math.round(Date.now() / 1000));
  }

  isWelcomeMessageShown(): boolean {
    return localStore.get("p2d.hideWelcomeMsg") == null;
  }

  hideWelcomeMessage() {
    localStore.set("p2d.hideWelcomeMsg", "true");
  }

  exportDataToJson() {
    let exportJson = {
      tasks: this.localGetTasks(),
    };
    var blob = new Blob([JSON.stringify(exportJson)], {
      type: "application/json;charset=utf-8",
    });
    FileSaver.saveAs(blob, "export.json");
  }

  importDataFromJson(jsonFile: string) {
    let jsonObject = JSON.parse(jsonFile);
    if (jsonObject["tasks"] !== null) {
      localStore.set("p2d.tasks", jsonObject["tasks"]);
    }
    this.localSetLastUpdatedTimestamp();
  }

  cleanupCompleted() {
    let tasks = this.localGetTasks();
    const updatedTasks = tasks.filter((task: Task) => task.completed === false);
    this.updateTasksLocalStorage(updatedTasks);
    this.localSetLastUpdatedTimestamp();
  }
}
