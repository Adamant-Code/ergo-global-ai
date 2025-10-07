import "dotenv/config";
import connectPgSimple from "connect-pg-simple";
import session, { SessionOptions } from "express-session";

const sessionStore = new (connectPgSimple(session))({
  tableName: "sessions",
  createTableIfMissing: false,
  conObject: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production",
  },
});

const sessionOptions: SessionOptions = {
  resave: true,
  store: sessionStore,
  saveUninitialized: true,
  name: "adminjs.session",
  secret: process.env.SESSION_SECRET || "",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 /** 24 hours */,
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "strict" : "lax",
  },
};

export default sessionOptions;
