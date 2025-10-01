import User from "@/types/user";
import { API_URL } from "./config/apiConfig";

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

export async function updateUser(user: User, jwt: string): Promise<User> {
  const userReq = await fetch(`${API_URL}/auth/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: jwt,
    },
    body: JSON.stringify(user),
  });
  const data = await userReq.json();
  console.log("userReq", data);
  if (!userReq.ok) {
    console.error("Get current user failed:", data);
  }
  return data;
}
