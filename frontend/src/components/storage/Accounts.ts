import { getServerAddress } from "./StorageBackend";

export async function signup(inputUser: string, inputPassword: string) {
  try {
    const response = await fetch("http://" + getServerAddress() + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        username: inputUser,
        password: inputPassword,
      }),
    });
    let result = await response.text();
    if (result === '"signup success"') {
      alert("Signup success!");
    } else {
      alert("Signup error: [" + result + "]");
    }
  } catch (error) {
    alert("Connection error: [" + error + "]");
  }
}

export async function login(
  inputUser: string,
  inputPassword: string
): Promise<boolean> {
  try {
    const response = await fetch("http://" + getServerAddress() + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: inputUser,
        password: inputPassword,
      }),
    });
    if (response.ok) {
      let result = await response.json();
      localStorage.setItem("p2d.accessToken", result["access_token"]);
      localStorage.setItem("p2d.username", inputUser);
      return true;
    } else {
      alert("Login error: " + (await response.text()) + "");
      return false;
    }
  } catch (error) {
    alert("Connection error: [" + error + "]");
    return false;
  }
}

export function getUsername(): string {
  return localStorage.getItem("p2d.username") || "";
}

export function isLoggedIn(): boolean {
  return localStorage.getItem("p2d.accessToken") !== null;
}

export function logout() {
  localStorage.removeItem("p2d.accessToken");
}

export function getAccessToken(): string {
  return localStorage.getItem("p2d.accessToken") || "";
}

export async function deleteAccount(): Promise<boolean> {
  try {
    const response = await fetch("http://" + getServerAddress() + "/users", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    });
    if (response.ok) {
      alert("Account deleted!");
      logout();
      return true;
    } else {
      alert("Delete account error: " + (await response.text()) + "");
      return false;
    }
  } catch (error) {
    alert("Connection error: [" + error + "]");
    return false;
  }
}
