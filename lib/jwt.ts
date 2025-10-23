import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "24h";
const RESET_TOKEN_EXPIRY = "1h";
if (!JWT_SECRET) {
  throw new Error("❌ Missing JWT_SECRET in environment variables");
}
export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};

export const generateResetToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email, type: "reset" }, JWT_SECRET, {
    expiresIn: RESET_TOKEN_EXPIRY,
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
};

export const verifyResetToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      type: string;
    };
    if (decoded.type !== "reset") return null;
    return decoded;
  } catch {
    return null;
  }
};
