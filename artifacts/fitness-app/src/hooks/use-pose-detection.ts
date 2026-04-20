import { useState, useEffect, useRef, useCallback } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

export function usePoseDetection(videoElementId: string, canvasElementId: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState("Ready");
  
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const requestRef = useRef<number>(0);
  const repStateRef = useRef<'UP' | 'DOWN'>('UP');

  // Load MediaPipe
  useEffect(() => {
    const initModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numPoses: 1
        });
        poseLandmarkerRef.current = landmarker;
        setIsLoaded(true);
      } catch (e) {
        console.error("Failed to load MediaPipe model", e);
      }
    };
    initModel();
    
    return () => {
      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close();
      }
    };
  }, []);

  const detectPose = useCallback(() => {
    const video = document.getElementById(videoElementId) as HTMLVideoElement;
    const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement;
    
    if (!video || !canvas || !poseLandmarkerRef.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (video.videoWidth === 0) {
      requestRef.current = requestAnimationFrame(detectPose);
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    let startTimeMs = performance.now();
    
    const renderLoop = () => {
      if (!isDetecting) return;
      
      const nowInMs = performance.now();
      if (nowInMs - startTimeMs > 33) { // ~30fps
        startTimeMs = nowInMs;
        const results = poseLandmarkerRef.current?.detectForVideo(video, nowInMs);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (results && results.landmarks.length > 0) {
          const drawingUtils = new DrawingUtils(ctx);
          for (const landmark of results.landmarks) {
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {
              color: "#00ffff", lineWidth: 4 
            });
            drawingUtils.drawLandmarks(landmark, {
              color: "#ff00ff", lineWidth: 2, radius: 4
            });
          }
          
          // Simple Squat Logic (using hips and knees y-coordinates)
          // indices: 23/24 (hips), 25/26 (knees)
          const landmarks = results.landmarks[0];
          const leftHip = landmarks[23];
          const leftKnee = landmarks[25];
          
          if (leftHip && leftKnee) {
            // Simplified logic: if hip goes down near knee level, it's DOWN
            const distance = leftKnee.y - leftHip.y;
            
            if (distance < 0.1 && repStateRef.current === 'UP') {
              repStateRef.current = 'DOWN';
              setFeedback("Good depth, push up!");
            } else if (distance > 0.25 && repStateRef.current === 'DOWN') {
              repStateRef.current = 'UP';
              setRepCount(prev => prev + 1);
              setFeedback("Nice rep!");
            }
          }
        }
      }
      
      requestRef.current = requestAnimationFrame(renderLoop);
    };
    
    renderLoop();
  }, [videoElementId, canvasElementId, isDetecting]);

  const startDetection = useCallback(() => {
    setIsDetecting(true);
  }, []);

  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);
  
  const resetReps = useCallback(() => {
    setRepCount(0);
    setFeedback("Ready");
  }, []);

  useEffect(() => {
    if (isDetecting) {
      detectPose();
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isDetecting, detectPose]);

  return { isLoaded, isDetecting, repCount, feedback, startDetection, stopDetection, resetReps };
}
