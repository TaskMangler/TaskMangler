export async function getRefreshToken(username: string, password: string) {
  const response = await fetch("/api/users/login", {
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

  const response = await fetch("/api/users/@me/sessions", {
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
  return data.token;
}

export type User = {
  username: string;
  admin: boolean;
};

export async function listUsers(): Promise<User[]> {
  const resp = await fetch("/api/users", {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  if (!resp.ok) {
    throw new Error(`Failed to list users: ${resp.statusText}`);
  }

  return resp.json();
}

export async function createUser(username: string, password: string) {
  const resp = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken()}`,
    },
    body: JSON.stringify({ username, password }),
  });
  if (!resp.ok) {
    throw new Error(`Failed to create user: ${resp.statusText}`);
  }

  return resp.json();
}
