const { fetchYouTubeVideos } = require("../controllers/youtubeController");

// Run YouTube fetcher every 10 minutes
setInterval(async () => {
  console.log("🔄 Fetching new YouTube videos...");
  await fetchYouTubeVideos();
}, 10 * 60 * 1000);
