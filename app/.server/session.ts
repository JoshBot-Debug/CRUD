import { createCookieSessionStorage } from "react-router";
import type { Toast } from "~/types";

const SECURE = import.meta.env.VITE_SECURE_SESSION;

type SessionData = {
  token: string;
  email: string;
};

type SessionFlashData = {
  toast: Toast;
};

const {
  getSession: _getSession,
  commitSession,
  destroySession,
} = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "strict",
    secrets: ["cdb576c5a289994e2384e29509784742"],
    secure: SECURE != "0",
  },
});

type Session = Awaited<ReturnType<typeof _getSession>>;

async function getSession(request: Request): Promise<Session> {
  return await _getSession(request.headers.get("Cookie"));
}

export {
  getSession,
  commitSession,
  destroySession,
  type Session,
  type SessionData,
  type SessionFlashData,
};
