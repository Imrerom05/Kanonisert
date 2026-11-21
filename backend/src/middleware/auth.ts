import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";
import { hashSessionToken } from "../utils/session.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.kanonisert_session;

    if (!token) {
      return res.status(401).json({
        error: "Not logged in.",
      });
    }

    const tokenHash = hashSessionToken(token);

    const session = await prisma.session.findFirst({
      where: {
        tokenHash,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        userId: true,
      },
    });

    if (!session) {
      return res.status(401).json({
        error: "Session expired or invalid.",
      });
    }

    req.userId = session.userId;

    return next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(500).json({
      error: "Something went wrong during authentication.",
    });
  }
}