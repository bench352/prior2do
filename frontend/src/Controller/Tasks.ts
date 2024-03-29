import {Task} from "../Data/schemas";
import {TasksBase} from "../Data/Tasks/TasksBase";
import TasksLocalStorage from "../Data/Tasks/TasksLocalStorage";
import {TasksSync} from "../Data/Tasks/TasksSync";

function getTasksBackend(): TasksBase {
    if (localStorage.getItem("p2d.syncEnabled") === null) {
        localStorage.setItem("p2d.tasks", "[]");
        localStorage.setItem("p2d.syncEnabled", "false");
        return new TasksLocalStorage();
    } else if (localStorage.getItem("p2d.syncEnabled") === "false") {
        return new TasksLocalStorage();
    } else {
        return new TasksSync();
    }
}

export class TasksController {
    async getTasks(): Promise<Task[]> {
        console.log("Getting tasks");
        return getTasksBackend().getTasks();
    }

    async getTaskById(id: string): Promise<Task> {
        return await getTasksBackend().getTaskById(id)
    }

    async addTask(task: Task) {
        await getTasksBackend().addTask(task);
    }

    async updateTask(task: Task) {
        await getTasksBackend().updateTask(task);
    }

    async deleteTaskById(id: string) {
        await getTasksBackend().deleteTaskById(id);
    }

    offlineGetTasks() {
        return getTasksBackend().localGetTasks();
    }

    async cleanupCompleted() {
        await getTasksBackend().cleanupCompleted();
    }

    getNewUniqueId() {
        return getTasksBackend().getNewUniqueId();
    }
}
