require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// Import Firebase config (ensure it loads first)
require("./config/firebase");

const youtubeRoutes = require("./routes/youtubeRoutes");
const searchQueriesRoute = require("./routes/searchQueries");
const gettingPermissionIds = require("./routes/permissionRoutes");
const processedRoutes = require("./routes/processedRoutes.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173" }
});

// CORS Configuration
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
}));

app.use(express.json());

const runCommand = (command, workingDir = path.join(__dirname, "..")) => {
    const process = exec(command, { cwd: workingDir });

    process.stdout.on("data", (data) => {
        console.log(data);
        
        // Check for special JSON progress format
        const lines = data.toString().split('\n');
        for (const line of lines) {
            if (line.startsWith('PROGRESS_JSON:')) {
                try {
                    const jsonStr = line.substring('PROGRESS_JSON:'.length);
                    const progressData = JSON.parse(jsonStr);
                    io.emit("progress-data", progressData);
                } catch (e) {
                    console.error("Error parsing progress JSON:", e);
                }
            } else if (line.trim()) {
                io.emit("terminal-output", line);
            }
        }
    });

    process.stderr.on("data", (data) => {
        console.error(data);
        io.emit("terminal-output", data);
    });

    process.on("close", (code) => {
        io.emit("terminal-output", `Process exited with code ${code}`);
    });
};


// API to start AI server
app.get("/start-ai", (req, res) => {
    const aiPath = path.join(__dirname, "../ai");

    const command = process.platform === "win32"
        ? `.venv\\Scripts\\activate && python main.py`
        : `source .venv/bin/activate && python main.py`;

    runCommand(command, aiPath);
    res.json({ message: "AI server started..." });
});


// Routes
app.use("/api/youtube", youtubeRoutes);
app.use("/api/search-queries", searchQueriesRoute);
app.use("/api/permissions", gettingPermissionIds);
app.use("/api/processed", processedRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
