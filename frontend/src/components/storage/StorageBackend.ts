import { isLoggedIn } from "./Accounts";
import { TasksSync } from "../../Data/Tasks/TasksSync";
import TasksLocalStorage from "../../Data/Tasks/TasksLocalStorage";
import { appVersion } from "../../Const";
import { TasksBase } from "../../Data/Tasks/TasksBase";

export interface TaskV0 {
  id: string;
  name: string;
  estHr: number;
  dueDate: Date | null;
  plannedDate: Date | null;
  tag: string;
  completed: boolean;
}
