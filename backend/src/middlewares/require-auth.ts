import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  org_id: string;
  user_id: string;
  role_id: string;
  user_type_id: string;
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    org_id: string;
    user_id: string;
    role_id: string;
    user_type_id: string;
  };
}

export const requireAuth: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: "Authorization header missing",
    });
    return;
  }

  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Invalid authorization format. Must be Bearer token",
    });
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "resolve-token"
    ) as DecodedToken;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTimestamp) {
      res.status(401).json({
        message: "Token has expired",
      });
      return;
    }

    (req as AuthenticatedRequest).user = {
      org_id: decoded.org_id,
      user_id: decoded.user_id,
      role_id: decoded.role_id,
      user_type_id: decoded.user_type_id,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: error.message || "Invalid token",
      });
      return;
    }
    res.status(500).json({
      message: "Internal server error during authentication",
    });
    return;
  }
};
