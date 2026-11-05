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


export default router;