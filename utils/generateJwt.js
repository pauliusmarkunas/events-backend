import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { JWT_SECRET } = process.env;

export function generateJwtToken(user) {
  const { first_name, last_name, email, id } = user;
  // console.log({ first_name, last_name, email, id });
  return `Bearer ${jwt.sign({ first_name, last_name, email, id }, JWT_SECRET, {
    expiresIn: "30min",
  })}`;
}
