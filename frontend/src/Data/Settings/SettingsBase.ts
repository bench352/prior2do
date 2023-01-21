import { appVersion } from "../../Const";
const localStore = require("store");

export abstract class SettingsBase {
  getIsWelcomeShown(): boolean {
    return localStore.get("p2d.hideWelcomeMsg") == null;
  }
  hideWelcomeMessage() {
    localStore.set("p2d.hideWelcomeMsg", true);
  }

  getIsSyncEnabled() {
    return localStore.get("p2d.syncEnabled") === true;
  }
  setIsSyncEnabled(enabled: boolean) {
    localStore.set("p2d.syncEnabled", enabled);
  }
  getServerAddress(): string {
    let addr = localStorage.getItem("p2d.syncServerIP");
    return addr ? addr : "";
  }
  setServerAddress(addr: string) {
    localStorage.setItem("p2d.syncServerIP", addr);
  }
  async getServerConnectionStatus(): Promise<string> {
    try {
      const response = await fetch("http://" + this.getServerAddress());
      let result = await response.text();
      if (result === '"prior2do-backend"') {
        return "Connection success!";
      } else {
        return "The configured domain is not a Prior2Do Sync Server";
      }
    } catch (error) {
      return "Failed to connect to Prior2Do Sync server.";
    }
  }
  isReleaseDialogShown(): boolean {
    if (localStorage.getItem("p2d.lastViewedVersion") === null) {
      return true;
    } else if (localStorage.getItem("p2d.lastViewedVersion") !== appVersion) {
      return true;
    } else {
      return false;
    }
  }
  markCurrentVersionViewed() {
    localStorage.setItem("p2d.lastViewedVersion", appVersion);
  }
}
