import { createSignal } from "solid-js";

const isDevMode = () => {
  const url = new URL(window.location.href);
  return url.port === "3000" && url.hostname === "localhost";
};

const API_BASE = isDevMode() ? "http://localhost:8080" : "";

export type User = {
  username: string;
  admin: boolean;
};

class APIClient {
  isLoggedIn: () => boolean;
  setIsLoggedIn: (value: boolean) => void;

  constructor() {
    const [isLoggedIn, setIsLoggedIn] = createSignal<boolean>(false);

    this.isLoggedIn = isLoggedIn;
    this.setIsLoggedIn = setIsLoggedIn;

    if (localStorage.getItem("accessToken")) {
      this.setIsLoggedIn(true);
    } else if (localStorage.getItem("refreshToken")) {
      this.#getAccessToken()
        .then(() => this.setIsLoggedIn(true))
        .catch(() => this.setIsLoggedIn(false));
    } else {
      this.setIsLoggedIn(false);
    }
  }

  async #getSessionToken(username: string, password: string): Promise<void> {
    const response = await fetch(API_BASE + "/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem("refreshToken", data.token);
  }

  async #getAccessToken(): Promise<void> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    console.log(refreshToken);

    const response = await fetch(API_BASE + "/api/users/@me/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.token);
  }

  async #ensureAccessToken(): Promise<string> {
    let token = localStorage.getItem("accessToken");
    if (!token) {
      await this.#getAccessToken();
      return;
    }

    const tokenData = token ? JSON.parse(atob(token.split(".")[1])) : {};
    const expiry = tokenData.exp ? tokenData.exp * 1000 : 0;
    const now = Date.now();

    if (now >= expiry) {
      await this.#getAccessToken();
    }
  }

  async #request<T>(path: string, options?: RequestInit): Promise<T> {
    await this.#ensureAccessToken();
    const token = localStorage.getItem("accessToken");

    const resp = await fetch(API_BASE + path, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) {
      throw new Error(`API request failed: ${resp.statusText}`);
    }

    return await resp.json();
  }

  async login(username: string, password: string) {
    this.logout();

    await this.#getSessionToken(username, password);
    await this.#getAccessToken();

    this.setIsLoggedIn(true);
  }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  async createUser(username: string, password: string): Promise<User> {
    return await this.#request<User>("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  }

  async updateUser(username: string, password: string): Promise<User> {
    return await this.#request<User>(`/api/users/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
  }

  async deleteUser(username: string): Promise<void> {
    await this.#request<void>(`/api/users/${username}`, {
      method: "DELETE",
    });
  }

  async listUsers(): Promise<User[]> {
    return await this.#request<User[]>("/api/users");
  }
}

export const API = new APIClient();
