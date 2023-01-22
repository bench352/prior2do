import { Task } from "../schemas";
import { TasksBase } from "./TasksBase";
import { SettingsController } from "../../Controller/Settings";
import { getLocalLastUpdatedTimestamp,localSetLastUpdatedTimestamp } from "../Timestamps";
import { AccountsController } from "../../Controller/Accounts";

const localStore = require("store");
const accountsCon = new AccountsController();

export class TasksSync extends TasksBase {
  settingsCon=new SettingsController();
  cleanupCompleted() {
    throw new Error("Method not implemented.");
  }
  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch("http://" + this.settingsCon.getServerAddress() + "/tasks", {
        method: "GET",
        headers: { Authorization: "Bearer " + accountsCon.getAccessToken() },
      });
      if (response.ok) {
        let remoteData = await response.json();
        let olderTasks: Task[];
        let newerTasks: Task[];
        let localLastUpdated: number = getLocalLastUpdatedTimestamp();
        let remoteLastUpdated: number = remoteData["lastUpdated"];
        let olderTasksAreLocalTasks = false;
        if (localLastUpdated > remoteLastUpdated) {
          olderTasks = remoteData["tasks"] as Task[];
          newerTasks = localStore.get("p2d.tasks") as Task[];
        } else {
          olderTasks = localStore.get("p2d.tasks") as Task[];
          newerTasks = remoteData["tasks"] as Task[];
          olderTasksAreLocalTasks = true;
        }
        let olderTasksIds: Set<string> = new Set();
        let newerTasksIds: Set<string> = new Set();
        for (const task of olderTasks) {
          olderTasksIds.add(task.id);
        }
        for (const task of newerTasks) {
          newerTasksIds.add(task.id);
        }
        let tasksIdsToDelete: Set<string> = new Set(olderTasksIds);
        for (const id of newerTasksIds) {
          tasksIdsToDelete.delete(id);
        }
        let tasksIdsToAdd: Set<string> = new Set(newerTasksIds);
        for (const id of olderTasksIds) {
          tasksIdsToAdd.delete(id);
        }
        let tasksIdsIntersects: Set<string> = new Set();
        for (const id of olderTasksIds) {
          if (newerTasksIds.has(id)) {
            tasksIdsIntersects.add(id);
          }
        }
        if (olderTasksAreLocalTasks) {
          for (const id of tasksIdsToDelete) {
            this.localDeleteTaskById(id);
          }
          for (const task of newerTasks) {
            if (tasksIdsToAdd.has(task.id)) {
              this.localAddTask(task);
            } else if (tasksIdsIntersects.has(task.id)) {
              this.localUpdateTask(task);
            }
          }
        } else {
          for (const id of tasksIdsToDelete) {
            await this.remoteDeleteTaskById(id);
          }
          let tasksToAdd = [] as Task[];
          let tasksToUpdate = [] as Task[];
          for (const task of newerTasks) {
            if (tasksIdsToAdd.has(task.id)) {
              tasksToAdd.push(task);
            } else if (tasksIdsIntersects.has(task.id)) {
              tasksToUpdate.push(task);
            }
          }
          await this.remoteBulkAddTask(tasksToAdd);
          await this.remoteBulkUpdateTask(tasksToUpdate);
        }
        return this.localGetTasks();
      } else {
        throw new Error(await response.text());
      }
    } catch (error: any) {
      if (error instanceof TypeError) {
        throw new Error("Failed to connect to Prior2Do Sync server.");
      } else {
        throw new Error(error.message);
      }
    }
  }
  async addTask(task: Task) {
    this.localAddTask(task);
    localSetLastUpdatedTimestamp();
    await this.remoteAddTask(task);
  }
  async remoteAddTask(task: Task) {
    const response = await fetch("http://" + this.settingsCon.getServerAddress() + "/tasks", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accountsCon.getAccessToken(),
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify([task]),
    });
    if (!response.ok) {
      alert(await response.text());
    }
  }

  async remoteBulkAddTask(tasks: Task[]) {
    const response = await fetch("http://" + this.settingsCon.getServerAddress() + "/tasks", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accountsCon.getAccessToken(),
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(tasks),
    });
    if (!response.ok) {
      alert(await response.text());
    }
  }

  async updateTask(taskToUpdate: Task) {
    this.localUpdateTask(taskToUpdate);
    localSetLastUpdatedTimestamp();
    await this.remoteUpdateTask(taskToUpdate);
  }

  async remoteUpdateTask(taskToUpdate: Task) {
    const response = await fetch("http://" + this.settingsCon.getServerAddress() + "/tasks", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accountsCon.getAccessToken(),
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify([taskToUpdate]),
    });
    if (!response.ok) {
      alert(await response.text());
    }
  }

  async remoteBulkUpdateTask(tasks: Task[]) {
    const response = await fetch("http://" + this.settingsCon.getServerAddress() + "/tasks", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accountsCon.getAccessToken(),
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(tasks),
    });
    if (!response.ok) {
      alert(await response.text());
    }
  }

  async deleteTaskById(id: string) {
    this.localDeleteTaskById(id);
    localSetLastUpdatedTimestamp();
    await this.remoteDeleteTaskById(id);
  }
  async remoteDeleteTaskById(id: String) {
    const response = await fetch(
      "http://" + this.settingsCon.getServerAddress() + "/tasks/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + accountsCon.getAccessToken(),
        },
      }
    );
    if (!response.ok) {
      alert(await response.text());
    }
  }
}
