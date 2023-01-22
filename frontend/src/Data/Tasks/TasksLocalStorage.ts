import { Task } from "../schemas";
import { TasksBase } from "./TasksBase";

export default class TasksLocalStorage extends TasksBase {
  async getTasks(): Promise<Task[]> {
    return this.lo calGetTasks();
  }

  async addTask(task: Task) {
    this.localAddTask(task);
  }

  async updateTask(taskToUpdate: Task) {
    this.localUpdateTask(taskToUpdate);
  }

  async deleteTaskById(id: string) {
    this.localDeleteTaskById(id);

  }
  cleanupCompleted() {
    let tasks = this.localGetTasks();
    const updatedTasks = tasks.filter(
      (task: Task) => task.completed === false
    );
    this.updateTasksLocalStorage(updatedTasks);
  }
}
