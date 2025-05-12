import pool from "../utils/pgConnection.js";
import { encryptPassword, checkPassword } from "../utils/passwordCrypt.js";
import { generateJwtToken } from "../utils/generateJwt.js";
import dotenv from "dotenv";
dotenv.config();
const IS_PRODUCTION = process.env.IS_PRODUCTION === "production";

export async function register(req, res) {
  const { email, password, firstName, lastName } = req.body;

  try {
    // checks if email already in use
    const userExist = await pool.query(
      "select * from organizers where email = $1",
      [email]
    );

    if (userExist.rowCount > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await encryptPassword(password);

    // saves user data
    const result = await pool.query(
      "insert into organizers (email, password_hash, first_name, last_name) values ($1, $2, $3, $4)",
      [email, hashedPassword, firstName, lastName]
    );

    if (result.rowCount > 0) {
      res.status(200).json({
        message: "Organizer created successfully",
        result: result.rows[0],
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server Error`, error: error.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "select * from organizers where email = $1 and deleted_at IS NULL",
      [email]
    );

    if (user.rowCount === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userData = user.rows[0];

    const isPasswordCorrect = await checkPassword(
      password,
      userData.password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateJwtToken(userData);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export function getUserInfo(req, res) {
  res.status(200).json(req.user);
}

// different approach: use bearer header with jwt...
