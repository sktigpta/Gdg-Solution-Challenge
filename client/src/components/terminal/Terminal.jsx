import { useEffect, useState } from "react";
import io from "socket.io-client";
import { FaBrain } from "react-icons/fa6";

const socket = io("http://localhost:5000");

export default function Terminal() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        socket.on("terminal-output", (data) => {
            setLogs((prevLogs) => [...prevLogs, data]); // Append new log line
        });

        return () => socket.off("terminal-output");
    }, []);

    const startAI = async () => {
        await fetch("http://localhost:5000/start-ai");
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
                {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                ))}
            </div>
            <p style={{ color: "gray", marginTop: "0.5em" }}>
                We are team <span style={{ fontWeight: "bold" }}>Tech-NO-Logic</span>
            </p>
        </div>
    );
}
