import { useEffect, useState } from "react";
import io from "socket.io-client";
import { FaBrain } from "react-icons/fa6";

const socket = io("http://localhost:5000");

export default function Terminal() {
    const [logs, setLogs] = useState([]);
    const [progressData, setProgressData] = useState({});
    
    useEffect(() => {
        socket.on("terminal-output", (data) => {
            setLogs((prevLogs) => [...prevLogs, data]);
        });
        
        socket.on("progress-data", (data) => {
            setProgressData(prev => ({
                ...prev,
                [data.task || data.type]: data
            }));
        });
        
        return () => {
            socket.off("terminal-output");
            socket.off("progress-data");
        };
    }, []);
    
    const startAI = async () => {
        // Reset progress data when starting
        setProgressData({});
        setLogs([]);
        await fetch("http://localhost:5000/start-ai");
    };
    
    // Helper function to render a progress bar
    const renderProgressBar = (data) => {
        if (!data) return null;
        
        return (
            <div style={{ marginBottom: "10px" }}>
                <div style={{ color: "#0f0", marginBottom: "5px" }}>
                    {getProgressLabel(data)}
                </div>
                <div style={{ 
                    height: "10px", 
                    backgroundColor: "#111", 
                    borderRadius: "5px",
                    overflow: "hidden"
                }}>
                    <div style={{ 
                        width: `${data.percent}%`, 
                        height: "100%", 
                        backgroundColor: "#0f0",
                        transition: "width 0.3s ease"
                    }} />
                </div>
            </div>
        );
    };
    
    // Get the appropriate label for each progress type
    const getProgressLabel = (data) => {
        switch (data.task || data.type) {
            case "loading":
                return data.message;
            case "extracting_frames":
                return `Extracting frames: ${data.current}/${data.total}`;
            case "processing_frames":
                return `Processing frames: ${data.current}/${data.total}`;
            default:
                return `Progress: ${data.percent}%`;
        }
    };
    
    return (
        <div style={{ width: "490px", height: "80vh", fontFamily: "'Source Code Pro', monospace" }}>
            <div style={{ marginBottom: "0.5em", justifyContent: "space-between" }} className="f-row">
                <h2>Live Terminal Output:</h2>
                <button onClick={startAI} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaBrain /> Start AI Server
                </button>
            </div>
            <div style={{
                backgroundColor: "#000",
                color: "#0f0",
                padding: "10px",
                height: "69vh",
                borderRadius: "0 0 5px 5px",
                overflowY: "auto",
                fontFamily: "'Source Code Pro', monospace",
                fontSize: "14px",
                whiteSpace: "pre-wrap"
            }}>
                {/* Render all active progress bars */}
                {Object.values(progressData).map((data, index) => (
                    <div key={index}>
                        {renderProgressBar(data)}
                    </div>
                ))}
                
                {/* Regular terminal output */}
                {logs.map((log, index) => (
                    <div key={`log-${index}`}>{log}</div>
                ))}
            </div>
            <p style={{ color: "gray", marginTop: "0.5em" }}>
                We are team <span style={{ fontWeight: "bold" }}>Tech-NO-Logic</span>
            </p>
        </div>
    );
}