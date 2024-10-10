import "dotenv/config";
import jwt from "jsonwebtoken";
import { client } from "./db";
import { InputError, AccessError } from "./error";
import { transporter, mailTemplate } from "./email";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const bcrypt = require("bcryptjs");

const saltRounds = 10;
const JWT_SECRET = process.env.TOKEN_SECRET;
const tokenExpiration = 36000;

/* 
  Auth Functions
*/

// Return false if the email exists in the DB otherwise, return true
export const isValidEmail = async (email) => {
  const does_exist = await client.query(
    "SELECT EXISTS (SELECT 1 FROM users WHERE user_email = $1) AS exists",
    [email],
  );

  if (does_exist.rows[0].exists) {
    return false;
  }

  return true;
};

export const login = (email, password) =>
  new Promise(async (resolve, reject) => {
    try {
      const validEmail = await isValidEmail(email);

      if (validEmail) {
        return reject(new InputError("Incorrect email or password."));
      }

      const user = await client.query(
        "SELECT * FROM users WHERE user_email = $1",
        [email],
      );

      const db_hash = user.rows[0].user_password;
      const validPassword = bcrypt.compareSync(password, db_hash);

      if (!validPassword) {
        return reject(new InputError("Incorrect email or password."));
      }

      const token = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: tokenExpiration,
      });

      return resolve({ token });
    } catch (err) {
      return reject(new AccessError("An error occurred. Try again later."));
    }
  });

export const register = (email, password) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        return reject(
          new AccessError("Account could not be created. Try again later."),
        );
      }

      try {
        const validEmail = await isValidEmail(email);

        if (!validEmail) {
          return reject(
            new InputError(
              "The email provided is already associated with an account",
            ),
          );
        }

        await client.query(
          "INSERT INTO users (user_email, user_password) VALUES($1, $2)",
          [email, hash],
        );
        const token = jwt.sign({ email }, JWT_SECRET, {
          expiresIn: tokenExpiration,
        });
        return resolve({ token });
      } catch (err) {
        return reject(new AccessError("An error occured. Try again later."));
      }
    });
  });

export const forgotPassword = (email) =>
  new Promise(async (resolve, reject) => {
    try {
      const token = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: tokenExpiration,
      });

      const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
      const mailOption = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Doro: Reset password instructions",
        text: `Please visit the following link to reset your password: ${url}`,
        html: mailTemplate(url),
      };

      await transporter.sendMail(mailOption);
      return resolve();
    } catch (err) {
      return reject(new AccessError("An error occured. Try again later."));
    }
  });

export const resetPassword = (email, password) =>
  new Promise(async (resolve, reject) => {
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        return reject(
          new AccessError("Password could not be changed. Try again later."),
        );
      }

      try {
        await client.query(
          "UPDATE users SET user_password = $1 WHERE user_email = $2",
          [hash, email],
        );

        const token = jwt.sign({ email }, JWT_SECRET, {
          expiresIn: tokenExpiration,
        });

        return resolve({ token });
      } catch (err) {
        return reject(new AccessError("An error occured. Try again later."));
      }
    });
  });
