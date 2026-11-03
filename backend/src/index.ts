import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import prisma from "./lib/prisma.js";
import authRoutes from "./auth/auth.routes.js";
import cookieParser from "cookie-parser";




const app = express();
const PORT = process.env.PORT || 3000;

async function cleanupExpiredSessions() {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    console.log(`Cleaned up ${result.count} expired sessions.`);
  } catch (error) {
    console.error("Session cleanup error:", error);
  }
}

void cleanupExpiredSessions();

setInterval(cleanupExpiredSessions, 60 * 60 * 1000);


app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected",
    });
  } catch {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Kanonisert API running on port ${PORT}`);
});



