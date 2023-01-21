import { TaskV0 } from "../../components/storage/StorageBackend";
import { TasksBase } from "./TasksBase";

export default class TasksLocalStorage extends TasksBase {
  async getTasks(): Promise<TaskV0[]> {
    return this.localGetTasks();
  }

  async addTask(task: TaskV0) {
    this.localAddTask(task);
  }

  async updateTask(taskToUpdate: TaskV0) {
    this.localUpdateTask(taskToUpdate);
  }

  async deleteTaskById(id: string) {
    this.localDeleteTaskById(id);

  }
  cleanupCompleted() {
    let tasks = this.localGetTasks();
    const updatedTasks = tasks.filter(
      (task: TaskV0) => task.completed === false
    );
    this.updateTasksLocalStorage(updatedTasks);
  }
}
