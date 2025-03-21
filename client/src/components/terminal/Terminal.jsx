import { useEffect, useState } from "react";
import io from "socket.io-client";
import { FaBrain } from "react-icons/fa6";
import { motion } from "framer-motion";
import { ContainerTwo } from "../cards-and-containers/Container";

const socket = io("http://localhost:5000");

export default function Terminal() {
    const [logs, setLogs] = useState([]);
    const [progressData, setProgressData] = useState({});
    const [isStarting, setIsStarting] = useState(false);
    const [serverStarted, setServerStarted] = useState(false);

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
        setIsStarting(true);
        setProgressData({});
        setLogs([]);
        await fetch("http://localhost:5000/start-ai");
        setIsStarting(false);
        setServerStarted(true);
    };

    const renderProgressBar = (data) => {
        if (!data) return null;

        return (
            <div style={{ marginBottom: "10px" }}>
                <div style={{ marginBottom: "5px" }}>
                    {getProgressLabel(data)}
                </div>
                <div style={{
                    height: "10px",
                    backgroundColor: "#ccc",
                    borderRadius: "5px",
                    overflow: "hidden"
                }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.percent}%` }}
                        transition={{ duration: 0.3 }}
                        style={{
                            height: "100%",
                            backgroundColor: "#9f9f9f"
                        }}
                    />
                </div>
            </div>
        );
    };

    const getProgressLabel = (data) => {
        switch (data.task || data.type) {
            case "loading":
                return data.message;
            case "extracting_frames":
                return `Extracting frames: ${data.current}/${data.total}`;
            case "processing_frames":
                return `Processing frames: ${data.current}/${data.total}`;
            case "comparing_frames":
                return `Comparing frames: ${data.current}/${data.total}`;
            default:
                return `Progress: ${data.percent}%`;
        }
    };

    return (
        <div style={{ width: "490px", fontFamily: "'Source Code Pro', monospace" }}>
            <div style={{ marginBottom: "0.5em", justifyContent: "space-between" }} className="f-row">
                <h3>Live Terminal Output</h3>
                <motion.button
                    onClick={startAI}
                    whileTap={{ scale: 0.9 }}
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    disabled={isStarting}
                >
                    <FaBrain /> {isStarting ? "Starting..." : serverStarted ? "AI Server Started" : "Start AI Server"}
                </motion.button>
            </div>
            <div style={{
                backgroundColor: "#f7f7f7",
                padding: "10px",
                height: "76vh",
                borderRadius: "0 0 5px 5px",
                overflowY: "auto",
                fontFamily: "'Source Code Pro', monospace",
                fontSize: "14px",
                whiteSpace: "pre-wrap"
            }}>
                {Object.values(progressData).map((data, index) => (
                    <div key={index}>
                        {renderProgressBar(data)}
                    </div>
                ))}
                <ContainerTwo>

                    {logs.map((log, index) => (
                        <div key={`log-${index}`}>{log}</div>
                    ))}

                </ContainerTwo>
            </div>
            <p style={{ color: "gray", marginTop: "0.5em" }}>
                We are team <span style={{ fontWeight: "bold" }}>Tech-NO-Logic</span>
            </p>
        </div>
    );
}