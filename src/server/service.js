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

      const id = user.rows[0].user_id;

      // Validate plain text password with hashed password in DB
      const db_hash = user.rows[0].user_password;
      const validPassword = bcrypt.compareSync(password, db_hash);

      if (!validPassword) {
        return reject(new InputError("Incorrect email or password."));
      }

      const token = jwt.sign({ id, email }, JWT_SECRET, {
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

        // Insert user into DB
        const user = await client.query(
          "INSERT INTO users (user_email, user_password) VALUES($1, $2) RETURNING user_id",
          [email, hash],
        );

        const id = user.rows[0].user_id;

        // Create user profile in DB
        await client.query(
          "INSERT INTO profiles (user_id, num_doros, num_hours) VALUES($1, $2, $3)",
          [id, 0, 0],
        );

        const token = jwt.sign({ id, email }, JWT_SECRET, {
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
      // Sign a temporary token with the user's email
      const token = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: tokenExpiration,
      });

      // Send email to user
      const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
      const mailOption = {
        from: {
          name: "Doro",
          address: process.env.EMAIL_ID,
        },
        to: [email],
        subject: "Reset password instructions",
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
        // Update password
        const user = await client.query(
          "UPDATE users SET user_password = $1 WHERE user_email = $2 RETURNING user_id",
          [hash, email],
        );

        const id = user.rows[0].user_id;

        // Sign a new token
        const token = jwt.sign({ id, email }, JWT_SECRET, {
          expiresIn: tokenExpiration,
        });

        return resolve({ token });
      } catch (err) {
        return reject(new AccessError("An error occured. Try again later."));
      }
    });
  });

export const getDoroActivity = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await client.query(
        "SELECT * FROM profiles WHERE user_id = $1",
        [id],
      );

      const { num_doros, num_hours } = user.rows[0];

      return resolve({ num_doros, num_hours });
    } catch (err) {
      return reject(
        new AccessError("Could not fetch your activity data. Try again later."),
      );
    }
  });

export const updateDoroActivity = (id, hours) =>
  new Promise(async (resolve, reject) => {
    try {
      // Update number of doros by one and increment hours

      await client.query(
        "UPDATE profiles SET num_doros = num_doros + 1, num_hours = num_hours + $1 WHERE user_id = $2",
        [hours, id],
      );

      return resolve();
    } catch (err) {
      return reject(new AccessError("Could not update your activity data"));
    }
  });
