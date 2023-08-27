import {Task} from "../schemas";
import {TasksBase} from "./TasksBase";

export default class TasksLocalStorage extends TasksBase {
    async getTaskById(id: string): Promise<Task> {
        for (const task of this.localGetTasks()) {
            if (task.id === id) return task;
        }
        throw new Error(`Task with id [${id}] not found!`);
    }

    async getTasks(): Promise<Task[]> {
        return this.localGetTasks();
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
        const updatedTasks = tasks.filter((task: Task) => task.completed === false);
        this.updateTasksLocalStorage(updatedTasks);
    }

    removeTagAssociation(tagId: string) {
        let tasks = this.localGetTasks();
        const updatedTasks = tasks.map((task) => {
            return task.tagId === tagId ? {...task, tagId: null} : task;
        });
        this.updateTasksLocalStorage(updatedTasks);
    }
}
