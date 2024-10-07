import "dotenv/config";
import jwt from "jsonwebtoken";
import AsyncLock from "async-lock";
import { InputError, AccessError } from "./error";

const lock = new AsyncLock();
const JWT_SECRET = process.env.TOKEN_SECRET;

export const userLock = (callback) =>
  new Promise((resolve, reject) => {
    lock.acquire("userAuthLock", callback(resolve, reject));
  });

/* 
  Auth Functions
*/

export const register = (email, password) =>
  userLock((resolve, reject) => {
    const name = email.split("@")[0];
    const token = jwt.sign({ email }, JWT_SECRET, { algorithm: "HS256" });
    resolve({ token, name });
  });
