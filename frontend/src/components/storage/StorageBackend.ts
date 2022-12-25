import LocalStorageOnly from "./LocalStorageOnly";

export interface Task {
  id: number;
  name: string;
  estHr: number;
  dueDate: Date | null;
  plannedDate: Date | null;
  tag: string;
  completed: boolean;
}

export interface TaskWithDue {
  id: number;
  name: string;
  estHr: number;
  dueDate: Date;
  plannedDate: Date | null;
  tag: string;
  completed: boolean;
}

export interface TaskWithPlan {
  id: number;
  name: string;
  estHr: number;
  dueDate: Date | null;
  plannedDate: Date;
  tag: string;
  completed: boolean;
}

// export abstract class BaseStorageBackend {
//   abstract getTasks(): Task[];
//   abstract getTaskById(id: string): Task;
//   abstract addTask(task: Task): void;
//   abstract updateTask(task: Task): void;
//   abstract deleteTaskById(id: string): void;
// }

export function getStorageBackend(): LocalStorageOnly {
  if (localStorage.getItem("p2d.storageType") === null) {
    localStorage.setItem("p2d.storageType", "localStorageOnly");
    localStorage.setItem("p2d.tasks", "[]");
  }
  return new LocalStorageOnly();
}
