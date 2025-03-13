const admin = require("firebase-admin");
const db = admin.firestore();

const permittedVideosCollection = db.collection("permitted_videos");
const knownChannelsCollection = db.collection("known_channels");

// 🔹 Fetch all permitted videos
const getPermittedVideos = async (req, res) => {
  try {
    const snapshot = await permittedVideosCollection.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No permitted videos found" });
    }

    const permittedVideos = snapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(),
    }));

    res.status(200).json({ permittedVideos });
  } catch (error) {
    console.error("❌ Error fetching permitted videos:", error.message);
    res.status(500).json({ error: "Failed to retrieve permitted videos" });
  }
};

// 🔹 Fetch all known channels
const getKnownChannels = async (req, res) => {
  try {
    const snapshot = await knownChannelsCollection.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No known channels found" });
    }

    const knownChannels = snapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(),
    }));

    res.status(200).json({ knownChannels });
  } catch (error) {
    console.error("❌ Error fetching known channels:", error.message);
    res.status(500).json({ error: "Failed to retrieve known channels" });
  }
};

// 🔹 Delete a permitted video by ID
const deletePermittedVideo = async (req, res) => {
  const { id } = req.params;
  try {
    await permittedVideosCollection.doc(id).delete();
    res.status(200).json({ message: `Video with ID ${id} deleted successfully` });
  } catch (error) {
    console.error("❌ Error deleting video:", error.message);
    res.status(500).json({ error: "Failed to delete video" });
  }
};

// 🔹 Delete a known channel by ID
const deleteKnownChannel = async (req, res) => {
  const { id } = req.params;
  try {
    await knownChannelsCollection.doc(id).delete();
    res.status(200).json({ message: `Channel with ID ${id} deleted successfully` });
  } catch (error) {
    console.error("❌ Error deleting channel:", error.message);
    res.status(500).json({ error: "Failed to delete channel" });
  }
};

// ✅ Add a new permitted video
const addPermittedVideo = async (req, res) => {
    const { videoId } = req.body;
    if (!videoId) return res.status(400).json({ error: "Video ID is required" });
  
    try {
      const newDoc = await permittedVideosCollection.add({ videoId });
      res.status(201).json({ message: "Video added successfully", id: newDoc.id });
    } catch (error) {
      console.error("❌ Error adding permitted video:", error.message);
      res.status(500).json({ error: "Failed to add video" });
    }
  };
  
  // ✅ Add a new known channel
  const addKnownChannel = async (req, res) => {
    const { channelId } = req.body;
    if (!channelId) return res.status(400).json({ error: "Channel ID is required" });
  
    try {
      const newDoc = await knownChannelsCollection.add({ channelId });
      res.status(201).json({ message: "Channel added successfully", id: newDoc.id });
    } catch (error) {
      console.error("❌ Error adding known channel:", error.message);
      res.status(500).json({ error: "Failed to add channel" });
    }
  };
  
  module.exports = { getPermittedVideos, getKnownChannels, addPermittedVideo, addKnownChannel, deletePermittedVideo, deleteKnownChannel };
  