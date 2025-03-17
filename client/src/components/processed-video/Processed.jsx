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
        <div style={{ width: "350px" }} className="container">
            <h3 className="card-header-title">Processed Videos</h3>
            <div className="grid">
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
                                    <p><strong>Copy Percentage:</strong> {video.copyPercentage?.toFixed(2)}%</p>
                                    <p><strong>Status:</strong> {video.copied ? "Copied" : "Not Copied"}</p>
                                    <p><strong>Processed On:</strong> {video.processedAt ? new Date(video.processedAt).toLocaleString() : "Unknown"}</p>
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
