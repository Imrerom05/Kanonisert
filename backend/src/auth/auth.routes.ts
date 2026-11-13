import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { z } from "zod";
import {
  createSessionToken,
  hashSessionToken,
  SESSION_DURATION_DAYS,
} from "../utils/session.js";
import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { Prisma } from "@prisma/client";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Please try again in 15 minutes.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many registration attempts. Please try again in 15 minutes.",
  },
});

const router = Router();

router.post("/register", registerLimiter, async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: "Invalid registration details.",
            details: result.error.issues.map((issue) => issue.message),
  });
}


const { email, username, password } = result.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email or username is already taken.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Account created successfully!",
      user,
    });
    } catch (error) {
        if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
        ) {
    return res.status(409).json({
      error: "Email or username is already taken.",
    });
    }

  console.error("Registration error:", error);

  return res.status(500).json({
    error: "Something went wrong during registration.",
  });
}
});


const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username cannot exceed 20 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores."
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
});


const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required."),
  password: z.string().min(1, "Password is required."),
});


router.post("/login", loginLimiter, async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
         return res.status(400).json({
        error: "Invalid login details.",
        details: result.error.issues.map((issue) => ({
        field: issue.path,
        message: issue.message,
        })),
     });
    }

    const { identifier, password } = result.data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email/username or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email/username or password.",
      });
    }

    const token = createSessionToken();
    const tokenHash = hashSessionToken(token);

    const expiresAt = new Date(
        Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
        );

    await prisma.session.create({
        data: {
        tokenHash,
        userId: user.id,
        expiresAt,
    },
    });

    res.cookie("kanonisert_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
        path: "/",
    });

    return res.json({
        message: "Logged in successfully!",
        user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
    },
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Something went wrong during login.",
    });
  }
});


router.get("/me", async (req: Request, res: Response) => {
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
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(401).json({
        error: "Session expired or invalid.",
      });
    }

    return res.json({
      user: session.user,
    });
  } catch (error) {
    console.error("Session check error:", error);

    return res.status(500).json({
      error: "Something went wrong checking your session.",
    });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.kanonisert_session;

    if (token) {
      const tokenHash = hashSessionToken(token);

      await prisma.session.deleteMany({
        where: {
          tokenHash,
        },
      });
    }

    res.clearCookie("kanonisert_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.json({
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      error: "Something went wrong during logout.",
    });
  }
});

export default router;