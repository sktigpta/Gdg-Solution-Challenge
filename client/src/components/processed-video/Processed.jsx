import { useEffect, useState } from "react";
import axios from "axios";
import "../css/videos-and-cards.css";

const Processed = () => {
    const [videos, setVideos] = useState([]);
    const [videoData, setVideoData] = useState({});

    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 600000);

        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/processed");
            const processedVideos = response.data?.videos || [];
            setVideos(processedVideos);

            processedVideos.forEach((video) => fetchVideoDetails(video.videoId));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchVideoDetails = async (videoId) => {
        try {
            const res = await axios.get(
                `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
            );
            setVideoData((prev) => ({
                ...prev,
                [videoId]: { title: res.data?.title || "No Title", author: res.data?.author_name || "Unknown" },
            }));
        } catch (error) {
            console.error(`Error fetching details for video ${videoId}:`, error);
        }
    };

    return (
        <div style={{ width: "350px" }}>
            <div className="grid">
                <div className="sticky-header">
                    <div style={{padding: "8px 0"}} className="header-content">
                        <h3 className="card-header-title">Fetched Videos</h3>
                        <span className="video-count">{videos?.length || 0}</span>
                    </div>
                </div>
                <ul className="video-list">
                    {videos.length > 0 ? (
                        videos.map((video) => (
                            <li key={video.videoId} className="video-item">
                                <img
                                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                    alt={videoData[video.videoId]?.title || "No title available"}
                                    className="video-thumbnail"
                                />
                                <div className="video-info">
                                    <p className="video-title">{videoData[video.videoId]?.title || "Untitled Video"}</p>
                                    <p className="video-disc ">Copy Percentage:{video.copyPercentage?.toFixed(2)}%</p>
                                    <p className="video-disc ">Status:{video.copied ? "Copied" : "Not Copied"}</p>
                                    <p className="video-disc ">Processed On:{video.processedAt ? new Date(video.processedAt).toLocaleString() : "Unknown"}</p>
                                    <button>Generate DMCA</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No processed videos available.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Processed;
