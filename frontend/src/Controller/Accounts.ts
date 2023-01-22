import { AccountsBase } from "../Data/Accounts/AccountsBase";
import { AccountsSync } from "../Data/Accounts/AccountsSync";

function getAccountsBackend(): AccountsBase {
  return new AccountsSync();
}

export class AccountsController {
  async signup(inputUser: string, inputPassword: string) {
    await getAccountsBackend().signup(inputUser, inputPassword);
  }
  isLoggedIn(): boolean {
    return getAccountsBackend().isLoggedIn();
  }
  getAccessToken(): string {
    return getAccountsBackend().getAccessToken();
  }
  async deleteAccount() {
    await getAccountsBackend().deleteAccount();
  }
  async updatePassword(newPassword: string) {
    await getAccountsBackend().updatePassword(newPassword);
  }
  getUsername() {
    return getAccountsBackend().getUsername();
  }
  async logout() {
    await getAccountsBackend().logout();
  }
  async login(inputUser: string, inputPassword: string) {
    await getAccountsBackend().login(inputUser, inputPassword);
  }
}
