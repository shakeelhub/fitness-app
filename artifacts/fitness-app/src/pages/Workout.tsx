import { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { CyberButton } from "@/components/CyberButton";
import { Play, Pause, Square, CheckCircle, Camera } from "lucide-react";
import { usePoseDetection } from "@/hooks/use-pose-detection";
import { motion, AnimatePresence } from "framer-motion";

export default function Workout() {
  const [isActive, setIsActive] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [time, setTime] = useState(0);

  const { isLoaded, isDetecting, repCount, feedback, startDetection, stopDetection, resetReps } = usePoseDetection("webcam-video", "webcam-canvas");

  // Simple Timer
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleCamera = async () => {
    if (showCamera) {
      setShowCamera(false);
      stopDetection();
      const video = document.getElementById('webcam-video') as HTMLVideoElement;
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    } else {
      setShowCamera(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('webcam-video') as HTMLVideoElement;
        if (video) {
          video.srcObject = stream;
          video.play();
          if (isLoaded) startDetection();
        }
      } catch (err) {
        console.error("Camera error:", err);
        setShowCamera(false);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto flex flex-col">
      <header className="flex justify-between items-center mb-8 mt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">ACTIVE PROTOCOL</h1>
          <p className="text-muted-foreground font-mono mt-1 text-sm">UPPER BODY HYPERTROPHY</p>
        </div>
        <div className="text-right">
          <div className="font-display text-4xl text-primary neon-text tabular-nums">{formatTime(time)}</div>
          <div className="text-xs tracking-widest text-muted-foreground">ELAPSED TIME</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Main Exercise View */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GlassCard className="flex-1 min-h-[400px] flex flex-col relative overflow-hidden p-0 border-primary/20">
            {showCamera ? (
              <div className="absolute inset-0 bg-black">
                <video id="webcam-video" className="absolute inset-0 w-full h-full object-cover opacity-50" playsInline muted />
                <canvas id="webcam-canvas" className="absolute inset-0 w-full h-full object-cover z-10" />
                
                {/* HUD Overlay for Camera */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full text-xs font-bold uppercase flex items-center gap-2 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE
                  </span>
                  {!isLoaded && <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs backdrop-blur-md">Loading AI...</span>}
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-black to-card">
                 {/* exercise demo image realistic unspash photo of person doing pushups */}
                <img 
                  src="https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&h=600&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen grayscale" 
                  alt="Exercise demo" 
                />
                <div className="relative z-10 text-center">
                  <h2 className="text-6xl font-display font-black mb-4">PUSH UPS</h2>
                  <p className="text-xl text-muted-foreground max-w-md mx-auto">Keep your core engaged and lower until your chest nearly touches the floor.</p>
                </div>
              </div>
            )}

            {/* Rep Counter Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20 flex justify-between items-end">
              <div>
                <p className="text-sm font-bold tracking-widest text-primary mb-1">AI FEEDBACK</p>
                <p className="text-2xl font-sans text-white">{feedback}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tracking-widest text-muted-foreground mb-1">REPS</p>
                <div className="text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-t from-secondary to-white leading-none">
                  {repCount} <span className="text-3xl text-white/30">/ 15</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Controls */}
          <div className="flex gap-4">
            <CyberButton 
              variant="secondary" 
              className="flex-1"
              onClick={toggleCamera}
            >
              <Camera className="w-5 h-5" /> {showCamera ? "HIDE CAM" : "AI TRACKER"}
            </CyberButton>
            
            <CyberButton 
              variant={isActive ? "ghost" : "primary"} 
              className="flex-1"
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? <><Pause className="w-5 h-5" /> PAUSE</> : <><Play className="w-5 h-5 fill-current" /> START</>}
            </CyberButton>
            
            <CyberButton variant="destructive">
              <Square className="w-5 h-5 fill-current" />
            </CyberButton>
          </div>
        </div>

        {/* Sidebar Plan */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold tracking-widest text-lg border-b border-white/10 pb-2">UPCOMING</h3>
          
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { name: "PUSH UPS", sets: 3, reps: 15, status: "active" },
              { name: "DUMBBELL ROWS", sets: 3, reps: 12, status: "pending" },
              { name: "OVERHEAD PRESS", sets: 3, reps: 10, status: "pending" },
              { name: "BICEP CURLS", sets: 3, reps: 15, status: "pending" },
              { name: "TRICEP EXTENSIONS", sets: 3, reps: 15, status: "pending" },
            ].map((ex, i) => (
              <GlassCard 
                key={i} 
                className={`p-4 transition-all ${
                  ex.status === 'active' 
                    ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,255,255,0.1)]' 
                    : 'border-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-display font-bold">{ex.name}</h4>
                  {ex.status === 'active' && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                </div>
                <div className="flex gap-4 text-sm font-mono text-muted-foreground">
                  <span>SETS: {ex.sets}</span>
                  <span>REPS: {ex.reps}</span>
                </div>
              </GlassCard>
            ))}
          </div>

          <CyberButton fullWidth className="mt-auto bg-green-500 text-black hover:bg-green-400">
            <CheckCircle className="w-5 h-5" /> COMPLETE WORKOUT
          </CyberButton>
        </div>
        
      </div>
    </div>
  );
}
