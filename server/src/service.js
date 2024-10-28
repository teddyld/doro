import "dotenv/config";
import jwt from "jsonwebtoken";
import { client } from "./db.js";
import { InputError, AccessError } from "./error.js";
import { transporter, mailTemplate } from "./email.js";
import { defaultBoard } from "./defaultBoard.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const bcrypt = require("bcryptjs");

const saltRounds = 10;
const JWT_SECRET = process.env.TOKEN_SECRET;
const tokenExpiration = 604800; // 7 days

/* 
  Auth Functions
*/

// Return false if the email exists in the DB otherwise, return true
export const isValidEmail = async (email) => {
  const does_exist = await client.query(
    "SELECT EXISTS (SELECT 1 FROM users WHERE user_email = $1) AS exists",
    [email]
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
        [email]
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
          new AccessError("Account could not be created. Try again later.")
        );
      }

      try {
        const validEmail = await isValidEmail(email);

        if (!validEmail) {
          return reject(
            new InputError(
              "The email provided is already associated with an account"
            )
          );
        }

        // Insert user into DB
        const user = await client.query(
          "INSERT INTO users (user_email, user_password) VALUES($1, $2) RETURNING user_id",
          [email, hash]
        );

        const id = user.rows[0].user_id;

        // Create user profile in DB
        await client.query(
          "INSERT INTO profiles (user_id, num_doros, num_hours) VALUES($1, $2, $3)",
          [id, 0, 0]
        );

        // Create default board belonging to user in DB
        await client.query(
          "INSERT INTO boards (board_name, board, user_id) VALUES($1, $2, $3)",
          ["New board 1", defaultBoard, id]
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
          new AccessError("Password could not be changed. Try again later.")
        );
      }

      try {
        // Update password
        const user = await client.query(
          "UPDATE users SET user_password = $1 WHERE user_email = $2 RETURNING user_id",
          [hash, email]
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

export const getDoroActivity = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      // Verify for incorrect token/expired token
      const { id, _ } = jwt.verify(token, JWT_SECRET);

      const user = await client.query(
        "SELECT * FROM profiles WHERE user_id = $1",
        [id]
      );

      const { num_doros, num_hours } = user.rows[0];

      return resolve({ num_doros, num_hours });
    } catch (err) {
      return reject(
        new AccessError(
          "Your current login expired. Login to get your activity data."
        )
      );
    }
  });

export const updateDoroActivity = (token, hours) =>
  new Promise(async (resolve, reject) => {
    try {
      // Verify for incorrect token/expired token
      const { id, _ } = jwt.verify(token, JWT_SECRET);

      // Update number of doros by one and increment hours
      await client.query(
        "UPDATE profiles SET num_doros = num_doros + 1, num_hours = num_hours + $1 WHERE user_id = $2",
        [hours, id]
      );

      return resolve();
    } catch (err) {
      return reject(
        new AccessError(
          "Your current login expired. Login to update and track your activity data."
        )
      );
    }
  });

// Generate a unique board name from the boards owned by the user_id. The retured name starts with "New board" followed by a unique number 1..n
const getUniqueBoardName = async (user_id) => {
  const data = await client.query("SELECT * FROM boards WHERE user_id = $1", [
    user_id,
  ]);

  let uniqueBoardNumber = 1;
  const boardNumbers = [];
  for (const row of data.rows) {
    const words = row.board_name.split(" ");
    if (words.length === 3 && words[0] === "New" && words[1] === "board") {
      const num = parseInt(words[2]);
      if (isNaN(num)) return;
      boardNumbers.push(num);
    }
  }

  while (boardNumbers.includes(uniqueBoardNumber)) {
    uniqueBoardNumber += 1;
  }

  return `New board ${uniqueBoardNumber}`;
};

// Return all boards owned by the user
export const getAllBoardsFromUser = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      // Verify for incorrect token/expired token
      const { id, _ } = jwt.verify(token, JWT_SECRET);

      // Retrieve all boards from user
      const data = await client.query(
        "SELECT * FROM boards WHERE user_id = $1",
        [id]
      );

      const boards = [];
      for (const row of data.rows) {
        boards.push({
          board: row.board,
          name: row.board_name,
        });
      }

      // Sort by name
      boards.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      return resolve({ boards, success: true });
    } catch (err) {
      return resolve({ boards: [], success: false });
    }
  });

// Create a new board in the DB
export const createBoard = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      // Verify for incorrect token/expired token
      const { id, _ } = jwt.verify(token, JWT_SECRET);

      const boardName = await getUniqueBoardName(id);

      await client.query(
        "INSERT INTO boards (board_name, board, user_id) VALUES($1, $2, $3)",
        [boardName, defaultBoard, id]
      );

      return resolve({ boardName, board: defaultBoard });
    } catch (err) {
      return reject(new AccessError("Login to create a new board."));
    }
  });

// Update the board correspondingly in the DB
export const updateBoard = (token, board, boardName) =>
  new Promise(async (resolve, reject) => {
    try {
      // Verify for incorrect token/expired token
      const { id, _ } = jwt.verify(token, JWT_SECRET);

      await client.query(
        "UPDATE boards SET board = $1 WHERE board_name = $2 AND user_id = $3",
        [board, boardName, id]
      );

      return resolve();
    } catch (err) {
      return reject(new AccessError("Could not update board."));
    }
  });

// Update the title of the user's board from boardName to newBoardName
export const updateBoardTitle = (token, boardName, newBoardName) =>
  new Promise(async (resolve, reject) => {
    try {
      // Verify for incorrect token/expired token
      const { id, _ } = jwt.verify(token, JWT_SECRET);

      await client.query(
        "UPDATE boards set board_name = $1 WHERE board_name = $2 and user_id = $3",
        [newBoardName, boardName, id]
      );

      resolve();
    } catch (err) {
      reject(new AccessError("Could not update board title."));
    }
  });

// Delete boardName from user boards
export const deleteBoard = (token, boardName) =>
  new Promise(async (resolve, reject) => {
    try {
      // Verify for incorrect token/expired token
      const { id, _ } = jwt.verify(token, JWT_SECRET);

      await client.query(
        "DELETE FROM boards WHERE board_name = $1 AND user_id = $2",
        [boardName, id]
      );

      resolve();
    } catch (err) {
      reject(new AccessError("Could not delete board."));
    }
  });
