import cv2
import json
import sys

def calculate_similarity(ref_detections, target_detections):
    """Calculate similarity based on class matches."""
    ref_classes = {d['class'] for d in ref_detections}
    target_classes = {d['class'] for d in target_detections}
    intersection = ref_classes.intersection(target_classes)
    return len(intersection) / len(ref_classes) if len(ref_classes) > 0 else 0

def compare_frames(target_frames, reference_data, yolo, threshold=0.5):
    """Compare target frames against reference data and return a list of boolean values.
    
    Args:
        target_frames: List of paths to target frame images
        reference_data: List of reference frame detection results
        yolo: YOLODetector instance
        threshold: Similarity threshold
        
    Returns:
        List of boolean values indicating whether each frame is copied or not
    """
    is_copied = []
    total_frames = len(target_frames)

    # Send initial progress report
    progress_json = {
        "type": "progress",
        "task": "comparing_frames",
        "current": 0,
        "total": total_frames,
        "percent": 0
    }
    print(f"PROGRESS_JSON:{json.dumps(progress_json)}", flush=True)

    for i, frame_path in enumerate(target_frames):
        frame = cv2.imread(frame_path)
        if frame is None:
            is_copied.append(False)
            continue

        target_detections = yolo.detect(frame)
        max_similarity = max(calculate_similarity(ref, target_detections) for ref in reference_data)
        is_copied.append(max_similarity >= threshold)

        # Update progress every 10 frames or at the last frame
        if i % 10 == 0 or i == total_frames - 1:
            progress_percent = min(99, int((i / total_frames) * 100))
            progress_json = {
                "type": "progress",
                "task": "comparing_frames",
                "current": i,
                "total": total_frames,
                "percent": progress_percent
            }
            print(f"PROGRESS_JSON:{json.dumps(progress_json)}", flush=True)

    # Send final progress update
    final_progress = {
        "type": "progress",
        "task": "comparing_frames",
        "current": total_frames,
        "total": total_frames,
        "percent": 100,
        "compared_frames": len(is_copied)
    }
    print(f"PROGRESS_JSON:{json.dumps(final_progress)}", flush=True)

    return is_copied
