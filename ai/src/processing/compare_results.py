import cv2
import sys
from tqdm import tqdm

def calculate_similarity(ref_detections, target_detections):
    # Simple similarity based on class matches
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
    
    # Create a tqdm progress bar
    progress_bar = tqdm(total=len(target_frames), 
                        desc="Comparing frames", 
                        bar_format="{desc}: {percentage:3.0f}% |{bar}| {n_fmt}/{total_fmt} frames")
    
    for frame_path in target_frames:
        frame = cv2.imread(frame_path)
        if frame is None:
            is_copied.append(False)
            progress_bar.update(1)
            continue
            
        target_detections = yolo.detect(frame)
        max_similarity = max(calculate_similarity(ref, target_detections) for ref in reference_data)
        is_copied.append(max_similarity >= threshold)
        progress_bar.update(1)
    
    progress_bar.close()
    return is_copied