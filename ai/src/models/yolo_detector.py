import cv2
import numpy as np
import logging

class YOLODetector:
    def __init__(self, 
                 cfg="src/models/pretrained/yolov4.cfg",
                 weights="src/models/pretrained/yolov4.weights",
                 names="src/models/pretrained/coco.names",
                 input_size=608,
                 conf_threshold=0.5,
                 nms_threshold=0.4):
        """Initialize YOLO Detector"""
        try:
            self.net = cv2.dnn_DetectionModel(cfg, weights)
            self.net.setInputSize(input_size, input_size)
            self.net.setInputScale(1.0 / 255)
            self.net.setInputSwapRB(True)
            
            with open(names, 'r') as f:
                self.classes = f.read().splitlines()
            
            self.conf_threshold = conf_threshold
            self.nms_threshold = nms_threshold
            
        except Exception as e:
            logging.error("Failed to initialize YOLO detector: %s", str(e))
            raise

    def detect(self, frame):
        """Detect objects in a preprocessed frame"""
        if not isinstance(frame, np.ndarray):
            logging.error("Invalid frame format. Expected numpy array.")
            return []

        try:
            # Convert color space if needed (BGR to RGB)
            if frame.shape[2] == 3:  # Ensure 3-channel image
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            classes, confidences, boxes = self.net.detect(
                frame, 
                confThreshold=self.conf_threshold,
                nmsThreshold=self.nms_threshold
            )

            # Handle None or empty detections
            if classes is None or confidences is None or boxes is None:
                return []

            # Ensure outputs are iterable (avoid scalar issues)
            if isinstance(classes, np.ndarray) and classes.ndim == 1:
                classes = classes.reshape(-1, 1)
            if isinstance(confidences, np.ndarray) and confidences.ndim == 1:
                confidences = confidences.reshape(-1, 1)
            if isinstance(boxes, np.ndarray) and boxes.ndim == 1:
                boxes = boxes.reshape(-1, 4)

            return [{
                'class': self.classes[int(cls[0])],  # Ensure correct indexing
                'confidence': float(conf[0]),
                'box': [int(v) for v in box]
            } for cls, conf, box in zip(classes, confidences, boxes)]

        except Exception as e:
            logging.error("Detection failed: %s", str(e))
            return []

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    detector = YOLODetector()
    cap = cv2.VideoCapture(0)  # Use webcam for real-time detection
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        detections = detector.detect(frame)
        for det in detections:
            x, y, w, h = det['box']
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, f"{det['class']} ({det['confidence']:.2f})", (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        cv2.imshow("YOLO Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()