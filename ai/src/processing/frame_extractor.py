import cv2
import os
import logging

def extract_frames(video_path, output_dir="temp_frames", frame_interval=1):
    """Extracts frames from video with validation and error handling"""
    try:
        os.makedirs(output_dir, exist_ok=True)
        cap = cv2.VideoCapture(video_path)
        frames = []
        frame_count = 0

        if not cap.isOpened():
            raise ValueError(f"Failed to open video: {video_path}")

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            if frame_count % frame_interval == 0:
                # Generate absolute path for clarity
                frame_path = os.path.abspath(
                    os.path.join(output_dir, f"frame_{frame_count:06d}.jpg")
                )

                # Validate frame before saving
                if frame is None or frame.size == 0:
                    logging.warning(f"Skipped empty frame at count {frame_count}")
                    continue

                # Save frame and verify success
                success = cv2.imwrite(frame_path, frame)
                if success:
                    frames.append(frame_path)
                else:
                    logging.error(f"Failed to save frame {frame_count} to {frame_path}")

            frame_count += 1

        cap.release()
        logging.info(f"Extracted {len(frames)} valid frames from {frame_count} total frames")
        return frames

    except Exception as e:
        logging.error(f"Frame extraction failed: {str(e)}")
        if cap.isOpened():
            cap.release()
        raise