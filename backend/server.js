require("dotenv").config();
const cors = require("cors");
const express = require("express");

// Import Firebase config (ensure it loads first)
require("./config/firebase");

const youtubeRoutes = require("./routes/youtubeRoutes");
const searchQueriesRoute = require("./routes/searchQueries");
const gettingPermissionIds = require("./routes/permissionRoutes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Allow only your frontend
    methods: "GET,POST,DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
}));


// Middleware
app.use(express.json());

// Routes
app.use("/api/youtube", youtubeRoutes);
app.use("/api/search-queries", searchQueriesRoute);
app.use("/api/permissions", gettingPermissionIds);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
