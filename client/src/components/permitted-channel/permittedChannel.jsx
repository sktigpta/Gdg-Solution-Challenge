import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import "../css/videos-and-cards.css";

const PermittedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [videoData, setVideoData] = useState({});
  const [newVideoId, setNewVideoId] = useState("");
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const videosRes = await axios.get("http://localhost:5000/api/permissions/permitted-videos");
      setVideos(videosRes.data.permittedVideos);
      videosRes.data.permittedVideos.forEach((video) => fetchVideoDetails(video.videoId));
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
        [videoId]: { title: res.data.title, author: res.data.author_name },
      }));
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  };

  const handleAddVideo = async () => {
    if (!newVideoId.trim()) return alert("Enter a valid video ID!");
    try {
      const res = await axios.post("http://localhost:5000/api/permissions/permitted-videos", {
        videoId: newVideoId,
      });
      setVideos([...videos, { id: res.data.id, videoId: newVideoId }]);
      fetchVideoDetails(newVideoId);
      setNewVideoId("");
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/permissions/permitted-videos/${id}`);
      setVideos(videos.filter((video) => video.id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleToggle = () => setIsHidden(!isHidden);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddVideo();
    }
  };

  return (
    <div className="container">
      <div className="sticky-header">
        <div className="header-content">
          <h3 className="card-header-title">Manage Permitted Videos</h3>
          <span className="video-count">{videos.length}</span>
        </div>
        <button className="toggle-btn"  style={{padding:"0"}}  onClick={handleToggle}>
          {isHidden ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </button>
      </div>

      {!isHidden && (
        <>
          <div className="query-input">
            <input
              type="text"
              placeholder="Enter Video ID"
              value={newVideoId}
              className="search-box"
              onChange={(e) => setNewVideoId(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="grid">
            <ul className="video-list">
              {videos.map((video) => (
                <li key={video.videoId} className="video-item">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                    alt={videoData[video.videoId]?.title || "No title available"}
                    className="video-thumbnail"
                  />
                  <div className="video-info">
                    <p className="video-title">{videoData[video.videoId]?.title || "Untitled Video"}</p>
                    <button onClick={() => handleDeleteVideo(video.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default PermittedVideos;
