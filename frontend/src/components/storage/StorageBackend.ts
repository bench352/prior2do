import { isLoggedIn } from "./Accounts";
import { LocalAndSync } from "./LocalAndSync";
import LocalStorageOnly from "./LocalStorageOnly";

export interface Task {
  id: string;
  name: string;
  estHr: number;
  dueDate: Date | null;
  plannedDate: Date | null;
  tag: string;
  completed: boolean;
}

export function getStorageBackend(): LocalStorageOnly {
  if (localStorage.getItem("p2d.syncEnabled") === null) {
    localStorage.setItem("p2d.tasks", "[]");
    localStorage.setItem("p2d.syncEnabled", "false");
    return new LocalStorageOnly();
  } else if (localStorage.getItem("p2d.syncEnabled") === "false") {
    return new LocalStorageOnly();
  } else if (!isLoggedIn()) {
    return new LocalStorageOnly();
  } else {
    return new LocalAndSync();
  }
}

export function isSyncEnabled() {
  return localStorage.getItem("p2d.syncEnabled") === "true";
}

export function getServerAddress(): string {
  let addr = localStorage.getItem("p2d.syncServerIP");
  return addr ? addr : "";
}
export function setServerAddress(addr: string) {
  localStorage.setItem("p2d.syncServerIP", addr);
}

export async function testServerConnection() {
  try {
    const response = await fetch("http://" + getServerAddress());
    let result = await response.text();
    if (result === '"prior2do-backend"') {
      alert("Connection success!");
    } else {
      alert("The configured domain is not a Prior2Do Sync Server");
    }
  } catch (error) {
    alert("Failed to connect to Prior2Do Sync server.");
  }
}
