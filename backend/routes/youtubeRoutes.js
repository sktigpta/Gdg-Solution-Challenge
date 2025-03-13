const express = require("express");
const { getYouTubeVideos, getStoredVideos } = require("../controllers/youtubeController");

const router = express.Router();

// Route to fetch new videos from YouTube API and store them in Firebase
router.post("/get-videos", getYouTubeVideos);

// Route to get stored videos from Firebase
router.get("/stored-videos", getStoredVideos);

module.exports = router;
