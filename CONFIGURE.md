# **CONFIGURE.md: Project Configuration and File Details**

This document provides a detailed explanation of the structure and purpose of each file and folder in the project. It is meant to give developers insight into the roles of different files, which can help in navigating and maintaining the codebase.

---

## **AI-ML Folder**

### 📂 `data/`
This folder holds raw and processed data used for the AI model training and analysis, including the logs and DMCA request data.

- **`raw_videos.csv`**: Contains the metadata for raw YouTube videos, including URLs and video details, to be scraped and analyzed.
- **`processed_videos.json`**: Holds the processed video data, such as results of AI analysis or metadata after scraping.
- **`logs/`**: Logs related to scraping and other data processing activities.
  - **`scraper.log`**: Logs from the scraping process for YouTube videos.
- **`models/`**: Stores AI models, such as pre-trained weights for object detection and audio fingerprinting.
  - **`yolo_weights.onnx`**: Object detection model in ONNX format.
  - **`audio_fingerprint.pkl`**: Audio fingerprinting model in pickle format.
- **`dmca_requests.json`**: Tracks the DMCA takedown requests generated.

---

### 📂 `src/`
This folder contains the source code for the AI-ML processing and related tasks.

- **`api/`**: Manages all the APIs responsible for interacting with YouTube, DMCA requests, and AI model integration.
  - **`youtube_scraper.py`**: Contains functions to scrape YouTube video data for copyright analysis.
  - **`dmca_handler.py`**: Manages DMCA takedown requests by interacting with the YouTube API.
  - **`ai_integration.py`**: Integrates AI models for object detection and audio analysis with the main pipeline.
- **`processing/`**: Handles video downloading, frame extraction, and audio extraction.
  - **`video_downloader.py`**: Downloads YouTube videos based on URLs from the scraped metadata.
  - **`frame_extractor.py`**: Extracts frames from videos for object detection.
  - **`audio_extractor.py`**: Extracts audio from videos for audio fingerprinting and analysis.
- **`ai/`**: Contains AI-related scripts for processing video and audio.
  - **`object_detection.py`**: Uses YOLO to detect Disney characters or logos in video frames.
  - **`audio_analysis.py`**: Analyzes the audio to detect copyrighted sounds using audio fingerprinting.
  - **`feature_extraction.py`**: Extracts important features from videos and audio for further analysis.
- **`storage/`**: Handles storage operations, specifically interacting with the Firestore database.
  - **`firestore_db.py`**: Handles interactions with the Firestore database, such as storing detected violations and video metadata.
- **`main.py`**: The entry point of the AI-ML pipeline, coordinates various processes like video scraping, analysis, and DMCA request generation.
- **`config.py`**: Stores configuration settings like API keys, model paths, and other constants.
- **`utils.py`**: Utility functions used across the project for tasks like logging and data formatting.

---

### 📂 `notebooks/`
This folder holds Jupyter notebooks for exploratory analysis and experimentation.

- **`exploratory_analysis.ipynb`**: A Jupyter notebook for analyzing video data, testing AI models, and visualizing results.

---

### 📂 `tests/`
Contains unit tests for various components of the AI-ML system.

- **`test_scraper.py`**: Tests the functionality of the YouTube scraper.
- **`test_object_detection.py`**: Tests the object detection model for accuracy and performance.
- **`test_firestore_db.py`**: Tests interactions with the Firestore database to ensure proper storage and retrieval.

---

## **Frontend Folder**

### 📂 `public/`
Contains public files that are used in the frontend, such as the main HTML file.

- **`index.html`**: The main HTML file, which is the entry point for the frontend web application.

---

### 📂 `src/`
Contains the source code for the frontend application.

- **`components/`**: Holds all React components used to build the UI.
  - **`Navbar.jsx`**: Contains the navigation bar component of the frontend.
  - **`VideoCard.jsx`**: Displays individual video details, such as status and detected violations.
  - **`DMCAForm.jsx`**: Form component for submitting DMCA takedown requests.
- **`pages/`**: Contains React pages used for routing.
  - **`Home.jsx`**: The homepage displaying an overview of detected violations.
  - **`VideoAnalysis.jsx`**: Displays detailed analysis of a selected video, including detection results and takedown status.
  - **`DMCARequests.jsx`**: Displays submitted DMCA requests and their statuses.
- **`services/`**: Contains service functions to interact with APIs and handle authentication.
  - **`api.js`**: Service for making API calls to the backend.
  - **`auth.js`**: Service to handle authentication logic.
- **`context/`**: Provides global context for managing app-wide state.
  - **`AppContext.js`**: Context provider for sharing data across components.
- **`styles/`**: Stores the application's stylesheets.
  - **`styles.css`**: Global CSS styles for the frontend.
- **`App.jsx`**: The main React component that defines routes and overall structure of the app.
- **`index.js`**: The entry point of the React app, where ReactDOM renders the app.

---

## **Backend Folder**

### 📂 `controllers/`
Contains controllers that handle business logic for routes.

- **`videoController.js`**: Handles logic for processing video-related requests, such as scraping and video data analysis.
- **`aiController.js`**: Controls the AI-related processes such as object detection and audio analysis.
- **`dmcaController.js`**: Manages the logic for generating DMCA takedown requests and interacting with the DMCA service.

---

### 📂 `models/`
Contains database models.

- **`videoModel.js`**: Defines the structure of the video data stored in the database.

---

### 📂 `routes/`
Defines the API routes for the backend.

- **`videoRoutes.js`**: Handles routes related to video processing and analysis.
- **`aiRoutes.js`**: Defines routes for AI tasks such as object detection and audio analysis.
- **`dmcaRoutes.js`**: Manages routes for handling DMCA takedown requests.

---

### 📂 `middleware/`
Contains middleware functions to enhance request processing.

- **`authMiddleware.js`**: Authenticates API requests using JWT.
- **`errorHandler.js`**: Handles errors in the API by providing structured error responses.

---

### 📂 `config/`
Contains configuration files for the backend.

- **`db.js`**: Configures the connection to the Firestore database.

---

### 📂 `services/`
Contains service files for handling complex operations.

- **`aiService.js`**: Handles AI tasks, such as invoking models for analysis.
- **`dmcaService.js`**: Handles DMCA-related tasks, including sending takedown requests.

---

### 📂 `storage/`
Contains storage-related functionalities.

- **`upload.js`**: Handles file uploads, such as video files for analysis.

---

### 📜 `app.js`
The entry point of the backend application that ties everything together and starts the Express server.

### 📜 `.env`
Stores environment variables, including API keys, database credentials, and other sensitive information.

### 📜 `package.json`
Defines the dependencies and scripts for the backend application.

---

This structure provides a scalable and modular approach to managing both AI-ML processing and web development tasks while ensuring clarity and separation of concerns across various components of the project.
