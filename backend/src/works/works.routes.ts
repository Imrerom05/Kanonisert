import { Router } from "express";

const router = Router();


router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;

    if (typeof query !== "string" || !query.trim()) {
      return res.status(400).json({
        error: "A search query is required.",
      });
    }

    const apiResponse = await fetch(
  `https://book-api-os07.onrender.com/works/search?query=${encodeURIComponent(query)}`
);

if (!apiResponse.ok) {
  throw new Error("Book API request failed.");
}

const works = await apiResponse.json();

return res.json(works);

  } catch (error) {
    console.error("Book search error:", error);

    return res.status(500).json({
      error: "Could not search for books.",
    });
  }
});


router.get("/:workId/full", async (req, res) => {
  try {
    const workId = Number(req.params.workId)

    if (!Number.isInteger(workId) || workId <= 0) {
      return res.status(400).json({
        error: "Invalid work ID.",
      })
    }

    const apiResponse = await fetch(
      `https://book-api-os07.onrender.com/works/${workId}/full`
    )

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({
        error: "Could not fetch work details.",
      })
    }

    const work = await apiResponse.json()

    return res.json(work)
  } catch (error) {
    console.error("Full work fetch error:", error)

    return res.status(500).json({
      error: "Could not fetch work details.",
    })
  }
})


export default router;