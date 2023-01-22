import { SettingsBase } from "../Data/Settings/SettingsBase";
import { SettingsLocalStorage } from "../Data/Settings/SettingsLocalStrorage";

function getSettingsBackend(): SettingsBase {
  return new SettingsLocalStorage();
}

export class SettingsController {
  getIsWelcomeShown() {
    return getSettingsBackend().getIsWelcomeShown();
  }
  hideWelcomeMessage() {
    return getSettingsBackend().hideWelcomeMessage();
  }
  getIsSyncEnabled() {
    return getSettingsBackend().getIsSyncEnabled();
  }
  setIsSyncEnabled(enabled: boolean) {
    getSettingsBackend().setIsSyncEnabled(enabled);
  }
  getServerAddress() {
    return getSettingsBackend().getServerAddress();
  }
  setServerAddress(address: string) {
    getSettingsBackend().setServerAddress(address);
  }
  async getServerConnectionStatus(): Promise<string> {
    return await getSettingsBackend().getServerConnectionStatus();
  }
  isReleaseDialogShown(): boolean {
    return getSettingsBackend().isReleaseDialogShown();
  }
  markCurrentVersionViewed() {
    getSettingsBackend().markCurrentVersionViewed()
  }
}
