import "./Container.css";

const Container = ({ children }) => {

    return (
        <div className="container">{children}</div>
    );
};

const ContainerTwo = ({ children }) => {
    return (
        <div className="containerTwo">{children}</div>
    );
};
const YtCard = ({ videoId, title, publishedAt }) => {
    return (
        <li className="yt-card">
            <img
                src={videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "fallback-image.jpg"}
                alt={title || "No title available"}
                className="video-thumbnail"
            />
            <div className="video-info">
                <p className="video-title">
                    {title?.length > 50 ? title.substring(0, 35) + "..." : title || "Untitled Video"}
                </p>
                <p className="video-date">
                    {publishedAt ? new Date(publishedAt).toLocaleDateString() : "Unknown Date"}
                </p>
            </div>
        </li>
    );
};




export default Container;
export { ContainerTwo , YtCard};
