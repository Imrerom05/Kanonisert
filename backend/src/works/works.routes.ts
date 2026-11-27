import { Router } from "express";

const router = Router();



router.get("/search", async (req, res) => {
  try {
    const query = req.query.query
    const type = req.query.type

    if (typeof query !== "string" || !query.trim()) {
      return res.status(400).json({
        error: "A search query is required.",
      })
    }

    const validTypes = ["works", "authors", "series"]

    if (type !== undefined && (
      typeof type !== "string" || !validTypes.includes(type)
    )) {
      return res.status(400).json({
        error: "Invalid search type.",
      })
    }

    const params = new URLSearchParams({ query })

    if (typeof type === "string") {
      params.set("type", type)
    }

    const apiResponse = await fetch(
      `https://book-api-os07.onrender.com/search?${params.toString()}`
    )

    if (!apiResponse.ok) {
      throw new Error("Book API request failed.")
    }

    const results = await apiResponse.json()

    return res.json(results)
  } catch (error) {
    console.error("Book search error:", error)

    return res.status(500).json({
      error: "Could not search the library.",
    })
  }
})



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


/**
 * Fetches complete information about an author,
 * including their associated books.
 */
router.get("/authors/:authorId/full", async (req, res) => {
  try {
    const authorId = Number(req.params.authorId)

    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(400).json({
        error: "Invalid author ID.",
      })
    }

    const apiResponse = await fetch(
      `https://book-api-os07.onrender.com/authors/${authorId}/full`
    )

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({
        error: "Could not fetch author details.",
      })
    }

    const author = await apiResponse.json()

    return res.json(author)
  } catch (error) {
    console.error("Full author fetch error:", error)

    return res.status(500).json({
      error: "Could not fetch author details.",
    })
  }
})



/**
 * Fetches complete information about a series,
 * including its associated books.
 */
router.get("/series/:seriesId/full", async (req, res) => {
  try {
    const seriesId = Number(req.params.seriesId)

    if (!Number.isInteger(seriesId) || seriesId <= 0) {
      return res.status(400).json({
        error: "Invalid series ID.",
      })
    }

    const apiResponse = await fetch(
      `https://book-api-os07.onrender.com/series/${seriesId}/full`
    )

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({
        error: "Could not fetch series details.",
      })
    }

    const series = await apiResponse.json()

    return res.json(series)
  } catch (error) {
    console.error("Full series fetch error:", error)

    return res.status(500).json({
      error: "Could not fetch series details.",
    })
  }
})

export default router;