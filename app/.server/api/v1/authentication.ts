import { eq } from "drizzle-orm";
import db from "../db";
import { users } from "../db/schema";
import { createRouter } from "../router";
import type { HandleRequest } from "../types";
import hash from "../hash";
import { ProblemDocument } from "http-problem-details";
import toast from "../toast";

export const router = createRouter({ prefix: "/v1" });

router("POST", "/authentication.login", async (req: HandleRequest) => {
  const result = await db.select({
    id: users.id,
    firstName: users.firstName,
    password: users.password,
  }).from(users).where(eq(users.email, req.data.email));


  if (!result.length)
    throw new ProblemDocument({
      status: 401,
      detail: "The email or password you have entered is not correct",
    })

  const [user] = result;

  const validPassword = await hash.compair(req.data.password, user.password);

  if (!validPassword) throw new ProblemDocument({
    status: 401,
    detail: "The email or password you have entered is not correct",
  })

  return new Response(toast.success("Authentication", `${user.firstName} logged in`, { token: "Bearer token", email: req.data.email }), {
    status: 200,
    headers: { "content-type": "application/json" }
  })
})


