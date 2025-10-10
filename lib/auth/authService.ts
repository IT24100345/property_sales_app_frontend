import User from "@/types/user";
import { API_URL } from "../config/apiConfig";
import { LoginResponse } from "@/types/auth";

export async function create(
  email: string,
  username: string,
  password: string,
  roles: string[]
): Promise<User> {
  console.log("roles", { email, username, password, roles });

  const signupReq = await fetch(`${API_URL}/auth/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password, roles }),
  });

  const data = await signupReq.json();

  console.log("signupReq", data);

  if (!signupReq.ok) {
    console.error("Signup failed:", data);
  }

  return data;
}

export async function updateUser(user: User): Promise<boolean> {
  console.log("updateUser", user);
  const userReq = await fetch(`${API_URL}/auth/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await userReq.text();
  console.log("userReq", data);
  if (!userReq.ok) {
    console.error("Get current user failed:", data);
  }
  return data === "true";
}

export async function getCurrentUser(jwt: string): Promise<User> {
  console.log("getCurrentUser with jwt:", jwt);

  const data = await (
    await fetch("/api/auth", {
      method: "GET",
      headers: {
        Authorization: jwt,
      },
    })
  ).json();

  console.log("AUTH_ME : ", data);

  if (!data) {
    console.error("Get current user failed:", data);
    throw new Error("Get current user failed");
  }

  return data;
}

export async function loginRequest(
  username: string,
  password: string
): Promise<LoginResponse> {
  
  const loginResponse: LoginResponse = await (
    await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
  ).json();

  if (!loginResponse) {
    console.error("Login failed:", loginResponse);
    throw new Error("Login failed");
  }

  return loginResponse;
}
