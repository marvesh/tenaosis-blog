export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

const API_URL =
  "https://tenaosis-fastapi-production.up.railway.app";

export async function loginUser(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Invalid email or password"
    );
  }

  return data;
}