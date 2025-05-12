import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const { JWT_SECRET } = process.env;

export function authUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded token:", decoded);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}
