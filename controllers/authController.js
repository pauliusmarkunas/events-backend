import pool from "../utils/pgConnection.js";
import { encryptPassword, checkPassword } from "../utils/passwordCrypt.js";
// import { generateJwtToken } from "../utilities/generateJwt.js";

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

// export async function login(req, res) {
//   const { username, password } = req.body;

//   try {
//     const userQuery = await pool.query(
//       "select username, password_hash, id, is_admin from users where username = $1",
//       [username]
//     );

//     if (userQuery.rows.length === 0) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const user = userQuery.rows[0];

//     const isPasswordCorrect = await checkPassword(password, user.password_hash);

//     if (!isPasswordCorrect) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (isPasswordCorrect === true) {
//       const token = generateJwtToken(user);

//       res.cookie("token", token, {
//         httpOnly: true,
//         sameSite: "none",
//         secure: true,
//         maxAge: 15 * 60 * 1000, //15 min
//       });
//     }

//     res.status(200).json({ message: "Login successful" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// export function logout(req, res) {
//   res.cookie("token", null, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none",
//   });

//   res.status(200);
// }

// export function getUserInfo(req, res) {
//   const { user } = req.body;
//   res.status(200).json(user);
// }
