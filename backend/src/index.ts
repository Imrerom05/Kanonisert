import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import prisma from "./lib/prisma.js";
import authRoutes from "./auth/auth.routes.js";
import cookieParser from "cookie-parser";




const app = express();
const PORT = process.env.PORT || 3000;


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



