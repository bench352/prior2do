import { WorkSession } from "../schemas";
import { WorkSessionsBase } from "./WorkSessionsBase";

export class WorkSessionsLocalStorage extends WorkSessionsBase {
  async getWorkSessionById(id: string): Promise<WorkSession> {
    let foundSession = this.localGetWorkSessions().find(
      (session) => session.id === id
    );
    if (foundSession === undefined) {
      throw new Error("WorkSession not found");
    }
    return foundSession;
  }
  async createWorkSession(workSession: WorkSession) {
    let workSessions = this.localGetWorkSessions();
    workSessions.push(workSession);
    this.updateWorkSessionsLocalStorage(workSessions);
  }
  async getAllWorkSessions(): Promise<WorkSession[]> {
    return this.localGetWorkSessions();
  }
  async getWorkSessionsByTaskId(taskId: string): Promise<WorkSession[]> {
    return (
      this.localGetWorkSessions().filter(
        (session) => session.taskId === taskId
      ) || []
    );
  }
  async updateWorkSession(workSessionToUpdate: WorkSession) {
    let workSessions = this.localGetWorkSessions();
    const updatedWorkSessions = workSessions.map((session) =>
      session.id === workSessionToUpdate.id ? workSessionToUpdate : session
    );
    this.updateWorkSessionsLocalStorage(updatedWorkSessions);
  }
  async deleteWorkSession(id: string) {
    let workSessions = this.localGetWorkSessions();
    const updatedWorkSessions = workSessions.filter(
      (session) => session.id !== id
    );
    this.updateWorkSessionsLocalStorage(updatedWorkSessions);
  }
}
