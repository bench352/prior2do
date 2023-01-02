import LocalStorageOnly from "./LocalStorageOnly";
import { getServerAddress } from "./StorageBackend";
import { getAccessToken } from "./Accounts";
import { Task } from "./StorageBackend";

const localStore = require("store");

export class LocalAndSync extends LocalStorageOnly {
  async getTasks(): Promise<Task[]> {
    const response = await fetch("http://" + getServerAddress() + "/tasks", {
      method: "GET",
      headers: { Authorization: "Bearer " + getAccessToken() },
    });
    if (response.ok) {
      let remoteData = await response.json();
      let olderTasks: Task[];
      let newerTasks: Task[];
      let localLastUpdated: number = this.localGetLastUpdatedTimestamp();
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
        for (const task of newerTasks) {
          if (tasksIdsToAdd.has(task.id)) {
            await this.remoteAddTask(task);
          } else if (tasksIdsIntersects.has(task.id)) {
            await this.remoteUpdateTask(task);
          }
        }
      }
      return this.localGetTasks();
    } else {
      alert(await response.text());
      return this.localGetTasks();
    }
  }
  async addTask(task: Task) {
    this.localAddTask(task);
    this.localSetLastUpdatedTimestamp();
    await this.remoteAddTask(task);
  }
  async remoteAddTask(task: Task) {
    const response = await fetch("http://" + getServerAddress() + "/tasks", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessToken(),
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      alert(await response.text());
    }
  }

  async updateTask(taskToUpdate: Task) {
    this.localUpdateTask(taskToUpdate);
    this.localSetLastUpdatedTimestamp();
    await this.remoteUpdateTask(taskToUpdate);
  }

  async remoteUpdateTask(taskToUpdate: Task) {
    const response = await fetch("http://" + getServerAddress() + "/tasks", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + getAccessToken(),
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(taskToUpdate),
    });
    if (!response.ok) {
      alert(await response.text());
    }
  }
  async deleteTaskById(id: string) {
    this.localDeleteTaskById(id);
    this.localSetLastUpdatedTimestamp();
    await this.remoteDeleteTaskById(id);
  }
  async remoteDeleteTaskById(id: String) {
    const response = await fetch(
      "http://" + getServerAddress() + "/tasks/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + getAccessToken(),
        },
      }
    );
    if (!response.ok) {
      alert(await response.text());
    }
  }
}
