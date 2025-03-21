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
    const [serverStatus, setServerStatus] = useState(localStorage.getItem("serverStarted") === "true" ? "running" : "loading");

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

    useEffect(() => {
        if (Object.keys(progressData).length > 0) {
            setServerStatus("running");
            localStorage.setItem("serverStarted", "true");
        } else {
            setServerStatus("stopped");
            localStorage.setItem("serverStarted", "false");
        }
    }, [progressData]);

    const startAI = async () => {
        setIsStarting(true);
        setProgressData({});
        setLogs([]);
        await fetch("http://localhost:5000/start-ai");
        setIsStarting(false);
        setServerStatus("running");
        localStorage.setItem("serverStarted", "true");
    };

    const stopAI = async () => {
        setIsStarting(true);
        setProgressData({});
        setLogs([]);
        await fetch("http://localhost:5000/stop-ai");
        setIsStarting(false);
        setServerStatus("stopped");
        localStorage.setItem("serverStarted", "false");
    };

    const getButtonText = () => {
        if (isStarting) return "Processing...";
        if (serverStatus === "loading") return "Loading . .. ...";
        return serverStatus === "running" ? "Stop AI Server" : "Start AI Server";
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
                    onClick={serverStatus === "running" ? stopAI : startAI}
                    whileTap={{ scale: 0.9 }}
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    disabled={isStarting || serverStatus === "loading"}
                >
                    <FaBrain /> {getButtonText()}
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
                    {logs.length > 0 ? (
                        <div style={{ maxHeight: "45vh", overflowY: "auto", paddingRight: "0" }}>
                            {logs.map((log, index) => (
                                <div style={{ fontSize: "0.8em" }} key={`log-${index}`}>{log}</div>
                            ))}
                        </div>
                    ) : (
                        <p>No logs available...</p>
                    )}
                </ContainerTwo>
            </div>
            <p style={{ color: "gray", marginTop: "0.5em" }}>
                We are team <span style={{ fontWeight: "bold" }}>Tech-NO-Logic</span>
            </p>
        </div>
    );
}
