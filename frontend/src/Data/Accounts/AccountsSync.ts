import { AccountsBase } from "./AccountsBase";
import { SettingsController } from "../../Controller/Settings";

export class AccountsSync extends AccountsBase {
  settingsCon = new SettingsController();
  async signup(inputUser: string, inputPassword: string) {
    try {
      const response = await fetch(
        "http://" + this.settingsCon.getServerAddress() + "/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            username: inputUser,
            password: inputPassword,
          }),
        }
      );
      let result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail);
      }
    } catch (error: any) {
      if (error instanceof TypeError) {
        throw new Error("Failed to connect to Prior2Do Sync server.");
      } else {
        throw new Error(error.message);
      }
    }
  }
  async login(inputUser: string, inputPassword: string) {
    try {
      const response = await fetch(
        "http://" + this.settingsCon.getServerAddress() + "/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: inputUser,
            password: inputPassword,
          }),
        }
      );
      let result = await response.json();
      if (response.ok) {
        this.setAccessToken(result["access_token"]);
        this.setUsername(inputUser);
      } else {
        throw new Error("Login error: " + result.detail + "");
      }
    } catch (error) {
      throw new Error("Failed to connect to Prior2Do Sync server.");
    }
  }
  async updatePassword(newPassword: string) {
    try {
      const response = await fetch(
        "http://" + this.settingsCon.getServerAddress() + "/users",
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + this.getAccessToken(),
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        }
      );
      if (response.ok) {
        await this.login(this.getUsername(), newPassword);
      } else {
        throw new Error(
          "Error when updating password: " + (await response.text())
        );
      }
    } catch (error) {
      throw new Error("Failed to connect to Prior2Do Sync server.");
    }
  }
  async deleteAccount() {
    try {
      const response = await fetch(
        "http://" + this.settingsCon.getServerAddress() + "/users",
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + this.getAccessToken(),
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          "Delete account error: " + (await response.text()) + ""
        );
      }
    } catch (error) {
      throw new Error("Failed to connect to Prior2Do Sync server.");
    }
  }
}
