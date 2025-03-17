import React, { useEffect, useState } from "react";
import { TbRefresh } from "react-icons/tb";
import Container from "../cards-and-containers/Container";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import "../css/videos-and-cards.css";

const FetchedVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isHidden, setIsHidden] = useState(true);

    const showError = (message) => {
        setErrorMessage(message);
        console.error(`❌ ERROR: ${message}`);
        setTimeout(() => setErrorMessage(""), 5000);
    };

    const fetchStoredVideos = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/youtube/stored-videos");
            if (!response.ok) throw new Error("Failed to fetch videos");

            const data = await response.json();
            setVideos(Array.isArray(data?.videos) ? data.videos : []);
        } catch (error) {
            showError(error.message);
            setVideos([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStoredVideos();
        const interval = setInterval(fetchStoredVideos, 600000);

        return () => clearInterval(interval);
    }, []);

    const addNewVideos = async () => {
        setRefreshing(true);
        try {
            const response = await fetch("http://localhost:5000/api/youtube/get-videos", { method: "POST" });
            if (!response.ok) throw new Error("Failed to fetch new videos");

            await fetchStoredVideos();
        } catch (error) {
            showError(error.message);
        }
        setRefreshing(false);
    };

    return (
        <Container>
            {errorMessage && <div className="error-banner">{errorMessage}</div>}

            <div className="sticky-header">
                <div className="header-content">
                    <h3 className="card-header-title">Fetched Videos</h3>
                    <span className="video-count">{videos?.length || 0}</span>
                </div>

                <button className="refresh-button" style={{ padding: "0" }} onClick={addNewVideos} disabled={refreshing}>
                    <TbRefresh className={`refresh-icon ${refreshing ? "spinning" : ""}`} />
                </button>

                <button className="toggle-btn" style={{ padding: "0" }} onClick={() => setIsHidden(!isHidden)}>
                    {!isHidden ? <IoIosArrowDown /> : <IoIosArrowUp />}
                </button>
            </div>

            {isHidden && (
                <div className="content">
                    {loading ? (
                        <p>Loading videos...</p>
                    ) : videos.length > 0 ? (
                        <ul className="video-list">
                            {videos.map((video, index) => (
                                <li key={video.videoId || index} className="video-item">
                                    <img
                                        src={video.videoId ? `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg` : "fallback-image.jpg"}
                                        alt={video.title || "No title available"}
                                        className="video-thumbnail"
                                    />
                                    <div className="video-info">
                                        <p className="video-title">
                                            {video.title?.length > 50 ? video.title.substring(0, 35) + "..." : video.title || "Untitled Video"}
                                        </p>
                                        <p className="video-date">
                                            {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : "Unknown Date"}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No videos found.</p>
                    )}
                </div>
            )}
        </Container>
    );
};

export default FetchedVideos;
