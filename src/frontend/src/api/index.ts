const url = new URL(window.location.href);
const port = url.port ? `:${url.port}` : "";

const API_BASE = port === ":3000" ? "http://localhost:8080" : "";

export async function getRefreshToken(username: string, password: string) {
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
  return data;
}

export async function getAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

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
  return data.token;
}

export type User = {
  username: string;
  admin: boolean;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let token = localStorage.getItem("accessToken");
  if (!token) {
    token = await getAccessToken();
  }

  const tokenData = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const expiry = tokenData.exp ? tokenData.exp * 1000 : 0;
  const now = Date.now();

  if (now >= expiry) {
    token = await getAccessToken();
  }

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

export async function listUsers(): Promise<User[]> {
  return await request<User[]>("/api/users");
}

export async function createUser(username: string, password: string) {
  return await request<User>("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
}
