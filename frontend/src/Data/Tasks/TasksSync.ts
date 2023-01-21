import { getAccessToken } from "../../components/storage/Accounts";
import { TaskV0 } from "../../components/storage/StorageBackend";
import { TasksBase } from "./TasksBase";
import { getLocalLastUpdatedTimestamp,localSetLastUpdatedTimestamp } from "../Timestamps";

const localStore = require("store");

export class TasksSync extends TasksBase {
  cleanupCompleted() {
    throw new Error("Method not implemented.");
  }
  async getTasks(): Promise<TaskV0[]> {
    try {
      const response = await fetch("http://" + getServerAddress() + "/tasks", {
        method: "GET",
        headers: { Authorization: "Bearer " + getAccessToken() },
      });
      if (response.ok) {
        let remoteData = await response.json();
        let olderTasks: TaskV0[];
        let newerTasks: TaskV0[];
        let localLastUpdated: number = getLocalLastUpdatedTimestamp();
        let remoteLastUpdated: number = remoteData["lastUpdated"];
        let olderTasksAreLocalTasks = false;
        if (localLastUpdated > remoteLastUpdated) {
          olderTasks = remoteData["tasks"] as TaskV0[];
          newerTasks = localStore.get("p2d.tasks") as TaskV0[];
        } else {
          olderTasks = localStore.get("p2d.tasks") as TaskV0[];
          newerTasks = remoteData["tasks"] as TaskV0[];
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
          let tasksToAdd = [] as TaskV0[];
          let tasksToUpdate = [] as TaskV0[];
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
  async addTask(task: TaskV0) {
    this.localAddTask(task);
    localSetLastUpdatedTimestamp();
    await this.remoteAddTask(task);
  }
  async remoteAddTask(task: TaskV0) {
    const response = await fetch("http://" + getServerAddress() + "/tasks", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessToken(),
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify([task]),
    });
    if (!response.ok) {
      alert(await response.text());
    }
  }

  async remoteBulkAddTask(tasks: TaskV0[]) {
    const response = await fetch("http://" + getServerAddress() + "/tasks", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessToken(),
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(tasks),
    });
    if (!response.ok) {
      alert(await response.text());
    }
  }

  async updateTask(taskToUpdate: TaskV0) {
    this.localUpdateTask(taskToUpdate);
    localSetLastUpdatedTimestamp();
    await this.remoteUpdateTask(taskToUpdate);
  }

  async remoteUpdateTask(taskToUpdate: TaskV0) {
    const response = await fetch("http://" + getServerAddress() + "/tasks", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + getAccessToken(),
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify([taskToUpdate]),
    });
    if (!response.ok) {
      alert(await response.text());
    }
  }

  async remoteBulkUpdateTask(tasks: TaskV0[]) {
    const response = await fetch("http://" + getServerAddress() + "/tasks", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + getAccessToken(),
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
