import express from "express";
import ViteExpress from "vite-express";

import "dotenv/config";
import cors from "cors";
import axios from "axios";
import queryString from "query-string";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { InputError, AccessError } from "./error";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  getDoroActivity,
  updateDoroActivity,
} from "./service";

const config = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  redirectUrl: process.env.REDIRECT_URL,
  clientUrl: process.env.CLIENT_URL,
  tokenSecret: process.env.TOKEN_SECRET,
  tokenExpiration: 604800, // 7 days
};

const authParams = queryString.stringify({
  client_id: config.clientId,
  redirect_uri: config.redirectUrl,
  response_type: "code",
  scope: "openid profile email",
  access_type: "offline",
  state: "standard_oauth",
  prompt: "consent",
});

const getTokenParams = (code) =>
  queryString.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: config.redirectUrl,
  });

const app = express();

app.use(
  cors({
    origin: [config.clientUrl],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

const catchErrors = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (err instanceof InputError) {
      res.status(400).send({ error: err.message });
    } else if (err instanceof AccessError) {
      res.status(403).send({ error: err.message });
    } else {
      console.log(err);
      res.status(500).send({ error: "A system error ocurred" });
    }
  }
};

app.get("/auth/url", (_, res) => {
  res.json({
    url: `${config.authUrl}?${authParams}`,
  });
});

app.get("/auth/token", async (req, res) => {
  const { code } = req.query;
  if (!code)
    return res
      .status(400)
      .json({ message: "Authorization code must be provided" });
  try {
    // Get all parameters needed to hit authorization server
    const tokenParam = getTokenParams(code);
    // Exchange authorization code for access token (id token is returned here too)
    const {
      data: { id_token },
    } = await axios.post(`${config.tokenUrl}?${tokenParam}`);
    if (!id_token) return res.status(400).json({ message: "Auth error" });

    // Get user info from id token
    const { email, name, picture } = jwt.decode(id_token);

    // Get token from DB
    let token_db;
    try {
      // Register email if user doesn't exist
      token_db = await register(email, "N/A");
    } catch (err) {
      token_db = await login(email, "N/A");
    }

    // Set cookies for user
    res.cookie("token", token_db.token, {
      maxAge: config.tokenExpiration,
      httpOnly: true,
    });
    return res.json({
      success: true,
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

app.get("/auth/logged_in", (req, res) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    if (!token) return res.json({ loggedIn: false });
    const { id, email } = jwt.verify(token, config.tokenSecret);
    const newToken = jwt.sign({ id, email }, config.tokenSecret, {
      expiresIn: config.tokenExpiration,
    });
    // Reset token in cookie
    res.cookie("token", newToken, {
      maxAge: config.tokenExpiration,
      httpOnly: true,
    });
    res.json({ loggedIn: true, name: email, token: newToken });
  } catch (err) {
    res.json({ loggedIn: false });
  }
});

app.post(
  "/user/login",
  catchErrors(async (req, res) => {
    const { email, password } = req.body;
    const { token } = await login(email, password);
    return res.json({ loggedIn: true, name: email, token: token });
  }),
);

app.post(
  "/user/register",
  catchErrors(async (req, res) => {
    const { email, password } = req.body;
    const { token } = await register(email, password);
    return res.json({ loggedIn: true, name: email, token: token });
  }),
);

app.post("/user/logout", (_, res) => {
  // Clear cookie
  return res.clearCookie("token").json({ loggedIn: false });
});

app.post(
  "/user/forgot-password",
  catchErrors(async (req, res) => {
    const { email } = req.body;
    await forgotPassword(email);
    return res.json({ success: true });
  }),
);

app.put(
  "/user/reset-password/:token",
  catchErrors(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const { email } = jwt.verify(token, config.tokenSecret);
    const { newToken } = await resetPassword(email, password);
    return res.json({ loggedIn: true, name: email, token: newToken });
  }),
);

app.get(
  "/activity/doro-timer/:token",
  catchErrors(async (req, res) => {
    const { token } = req.params;
    const { num_doros, num_hours } = await getDoroActivity(token);
    return res.json({ num_doros, num_hours });
  }),
);

app.put(
  "/activity/doro-timer",
  catchErrors(async (req, res) => {
    const { token, hours } = req.body;
    await updateDoroActivity(token, hours);
    return res.json({ success: true });
  }),
);

ViteExpress.listen(app, 5050, () =>
  console.log("🚀 Server is listening on port 5050..."),
);
