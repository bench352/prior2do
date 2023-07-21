import { WorkSession } from "../schemas";

const localStore = require("store");

export abstract class WorkSessionsBase {
  abstract createWorkSession(workSession: WorkSession): any;
  abstract getAllWorkSessions(): Promise<WorkSession[]>;
  abstract getWorkSessionsByTaskId(taskId: string): Promise<WorkSession[]>;
  abstract getWorkSessionById(id: string): Promise<WorkSession>;
  abstract updateWorkSession(workSession: WorkSession): any;
  abstract deleteWorkSession(id: string): any;
  localGetWorkSessions(): WorkSession[] {
    return localStore.get("p2d.workSessions")||[];
  }
  updateWorkSessionsLocalStorage(workSessions:WorkSession[]){
    localStore.set("p2d.workSessions", workSessions)
  }
}
