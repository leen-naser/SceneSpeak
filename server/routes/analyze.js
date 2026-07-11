const express = require("express");
const { analyzeImage } = require("../services/gemini");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      image,
      mimeType,
      mode,
      objectQuery,
    } = req.body;

    if (!image || !mimeType || !mode) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const result = await analyzeImage(
      image,
      mimeType,
      mode,
      objectQuery
    );

    res.json({
      description: result,
    });

  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      error: "Failed to analyze image",
    });
  }
});

module.exports = router;