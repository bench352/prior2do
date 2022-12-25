// import { BaseStorageBackend } from "./StorageBackend";
import { Task } from "./StorageBackend";

const localStore = require("store");
const FileSaver = require("file-saver");

export default class LocalStorageOnly {
  getTasks() {
    return localStore.get("p2d.tasks");
  }

  getTaskById(id: string): Task {
    let tasks = this.getTasks();
    for (const task of tasks) {
      if (task.id === id) {
        return task;
      }
    }
    throw new Error("Task not found");
  }

  addTask(task: Task): void {
    let tasks = this.getTasks();
    tasks.push(task);
    this.updateTasksLocalStorage(tasks);
  }

  updateTask(taskToUpdate: Task): void {
    let tasks = this.getTasks();
    const updatedTasks = tasks.map((task: Task) =>
      task.id === taskToUpdate.id ? taskToUpdate : task
    );
    this.updateTasksLocalStorage(updatedTasks);
  }

  deleteTaskById(id: number): void {
    let tasks = this.getTasks();
    const updatedTasks = tasks.filter((task: Task) => task.id !== id);
    this.updateTasksLocalStorage(updatedTasks);
  }

  updateTasksLocalStorage(tasks: Task[]) {
    localStore.set("p2d.tasks", tasks);
  }

  getNewUniqueId(): number {
    if (localStore.get("p2d.lastUsedId") == null) {
      localStore.set("p2d.lastUsedId", 0);
      return 0;
    } else {
      let lastUsedId = localStore.get("p2d.lastUsedId");
      localStore.set("p2d.lastUsedId", lastUsedId + 1);
      return lastUsedId + 1;
    }
  }

  isWelcomeMessageShown(): boolean {
    return localStore.get("p2d.hideWelcomeMsg") == null;
  }

  hideWelcomeMessage() {
    localStore.set("p2d.hideWelcomeMsg", "true");
  }

  exportDataToJson() {
    let exportJson = {
      lastUsedId: localStore.get("p2d.lastUsedId"),
      storageType: localStorage.getItem("p2d.storageType"),
      tasks: this.getTasks(),
    };
    var blob = new Blob([JSON.stringify(exportJson)], {
      type: "application/json;charset=utf-8",
    });
    FileSaver.saveAs(blob, "export.json");
  }

  importDataFromJson(jsonFile: string) {
    localStorage.clear();
    let jsonObject = JSON.parse(jsonFile);
    if (jsonObject["lastUsedId"] !== null) {
      localStore.set("p2d.lastUsedId", jsonObject["lastUsedId"]);
    }
    if (jsonObject["storageType"] !== null) {
      localStorage.setItem("p2d.storageType", jsonObject["storageType"]);
    }
    if (jsonObject["tasks"] !== null) {
      localStore.set("p2d.tasks", jsonObject["tasks"]);
    }
  }

  cleanupCompleted() {
    let tasks = this.getTasks();
    const updatedTasks = tasks.filter((task: Task) => task.completed === false);
    this.updateTasksLocalStorage(updatedTasks);
  }
}
