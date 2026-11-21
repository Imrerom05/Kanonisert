import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();


router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const workId = Number(req.body.workId);

    if (!Number.isInteger(workId) || workId <= 0) {
      return res.status(400).json({
        error: "A valid work ID is required.",
      });
    }

    const item = await prisma.readingListItem.upsert({
      where: {
        userId_workId: {
          userId: req.userId!,
          workId,
        },
      },
      update: {},
      create: {
        userId: req.userId!,
        workId,
      },
    });

    return res.status(201).json({
      message: "Book added to reading list.",
      item,
    });
  } catch (error) {
    console.error("Add to reading list error:", error);

    return res.status(500).json({
      error: "Could not add book to reading list.",
    });
  }
});

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const items = await prisma.readingListItem.findMany({
      where: {
        userId: req.userId!,
      },
      orderBy: {
        addedAt: "desc",
      },
    });

    return res.json(items);
  } catch (error) {
    console.error("Reading list error:", error);

    return res.status(500).json({
      error: "Could not load reading list.",
    });
  }
});


router.patch("/:workId", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const workId = Number(req.params.workId);
    const status = req.body.status;

    const validStatuses = ["WANT_TO_READ", "READING", "READ"];

    if (
      !Number.isInteger(workId) ||
      workId <= 0 ||
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        error: "Invalid work ID or reading status.",
      });
    }

    const item = await prisma.readingListItem.updateMany({
      where: {
        userId: req.userId!,
        workId,
      },
      data: {
        status,
      },
    });

    if (item.count === 0) {
      return res.status(404).json({
        error: "Book not found in your reading list.",
      });
    }

    return res.json({
      message: "Reading status updated.",
    });
  } catch (error) {
    console.error("Reading status update error:", error);

    return res.status(500).json({
      error: "Could not update reading status.",
    });
  }
});


router.delete("/:workId", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const workId = Number(req.params.workId);

    if (!Number.isInteger(workId) || workId <= 0) {
      return res.status(400).json({
        error: "Invalid work ID.",
      });
    }

    const result = await prisma.readingListItem.deleteMany({
      where: {
        userId: req.userId!,
        workId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        error: "Book not found in your reading list.",
      });
    }

    return res.json({
      message: "Book removed from reading list.",
    });
  } catch (error) {
    console.error("Remove from reading list error:", error);

    return res.status(500).json({
      error: "Could not remove book from reading list.",
    });
  }
});

export default router;