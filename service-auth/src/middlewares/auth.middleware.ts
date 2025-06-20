import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  account?: {
    id: number;
    email: string;
    role?: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken<{ id: number; email: string; role?: string }>(token);

    if (!payload) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    req.account = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Authentication failed" });
  }
};