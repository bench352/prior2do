import {SettingsController} from "../../Controller/Settings";

export abstract class AccountsBase {
    settingsCon = new SettingsController();

    abstract signup(inputUser: string, inputPassword: string): Promise<any>;

    abstract login(inputUser: string, inputPassword: string): any;

    abstract updatePassword(newPassword: string): any;

    abstract deleteAccount(): any;

    getAccessToken(): string {
        return localStorage.getItem("p2d.accessToken") || "";
    }

    setAccessToken(token: string): any {
        localStorage.setItem("p2d.accessToken", token);
    }

    getUsername(): string {
        return localStorage.getItem("p2d.username") || "";
    }

    setUsername(newUsername: string): any {
        localStorage.setItem("p2d.username", newUsername);
    }

    isLoggedIn(): boolean {
        if (this.settingsCon.getIsSyncEnabled()) {
            return localStorage.getItem("p2d.accessToken") !== null;
        } else {
            return false;
        }
    }

    logout() {
        localStorage.removeItem("p2d.accessToken");
    }
}
