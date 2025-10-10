

export async function POST(request: Request) {
  console.log(request);
  
  return Response.json({
    id: 1,
    username: "testuser",
    email: "testuser@example.com",
    roles: ["ROLE_USER", "ROLE_ADMIN"],
    jwt: "fake-jwt-token",
  });
}
