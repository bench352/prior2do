import { WorkSession } from "../Data/schemas";
import { WorkSessionsBase } from "../Data/WorkSessions/WorkSessionsBase";
import { WorkSessionsLocalStorage } from "../Data/WorkSessions/WorkSessionsLocalStorage";

function getWorkSessionsBackend(): WorkSessionsBase {
  return new WorkSessionsLocalStorage();
}

export class WorkSessionsController {
  async createWorkSession(workSession: WorkSession) {
    await getWorkSessionsBackend().createWorkSession(workSession);
  }
  async getAllWorkSessions(): Promise<WorkSession[]> {
    return await getWorkSessionsBackend().localGetWorkSessions();
  }
  async getWorkSessionsByTaskId(taskId: string): Promise<WorkSession[]> {
    return await getWorkSessionsBackend().getWorkSessionsByTaskId(taskId);
  }
  async getWorkSessionById(id: string): Promise<WorkSession> {
    return await getWorkSessionsBackend().getWorkSessionById(id);
  }
  async updateWorkSession(workSession: WorkSession) {
    await getWorkSessionsBackend().updateWorkSession(workSession);
  }
  async deleteWorkSession(id: string) {
    await getWorkSessionsBackend().deleteWorkSession(id);
  }
}
