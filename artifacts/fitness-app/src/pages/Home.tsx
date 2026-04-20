import { Link } from "wouter";
import { Play, Flame, Zap, Trophy, ChevronRight, Activity, Dumbbell } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { CyberButton } from "@/components/CyberButton";
import { useGetUserProfile, useGetProgressStats } from "@workspace/api-client-react";

export default function Home() {
  const { data: profile, isLoading: profileLoading } = useGetUserProfile();
  const { data: stats, isLoading: statsLoading } = useGetProgressStats();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <header className="mb-10 mt-6 flex justify-between items-end">
        <div>
          <p className="text-primary font-display font-bold tracking-widest text-sm mb-1">SYSTEM ONLINE</p>
          <h1 className="text-4xl md:text-5xl font-display font-black">
            WELCOME BACK, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
              {profileLoading ? "OPERATIVE" : profile?.name?.toUpperCase() || "OPERATIVE"}
            </span>
          </h1>
        </div>
        <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center bg-black/50 backdrop-blur overflow-hidden">
          <img 
            src="https://i.pinimg.com/474x/14/c5/10/14c5102b10d782313ee01fa24b24f9b7.jpg" 
            alt="Avatar" 
            className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
          />
        </div>
      </header>

      {/* Hero Action */}
      <GlassCard className="p-8 mb-10 border-primary/30 bg-gradient-to-br from-black/80 to-primary/10 relative overflow-hidden">
        <div className="md:w-2/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-wider mb-4 border border-primary/30">
            <Zap className="w-3 h-3" /> TODAY'S DIRECTIVE
          </div>
          <h2 className="text-3xl font-display font-bold mb-3">UPPER BODY CRUSH</h2>
          <p className="text-muted-foreground mb-8 max-w-md">Your AI Coach generated this 45-min hyper-trophy focused session based on your goals and recovery metrics.</p>
          
          <Link href="/workout">
            <CyberButton>
              <Play className="w-5 h-5 fill-current" /> INITIATE SEQUENCE
            </CyberButton>
          </Link>
        </div>
      </GlassCard>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "STREAK", value: statsLoading ? "-" : (stats?.currentStreak || 0), unit: "DAYS", icon: Flame, color: "text-orange-400" },
          { label: "SESSIONS", value: statsLoading ? "-" : (stats?.totalSessions || 0), unit: "TOTAL", icon: Activity, color: "text-primary" },
          { label: "VOLUME", value: statsLoading ? "-" : (stats?.totalReps || 0), unit: "REPS", icon: Dumbbell, color: "text-cyan-400" },
          { label: "RANK", value: "ELITE", unit: "TIER", icon: Trophy, color: "text-yellow-400" },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-5 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color} opacity-80`} />
            </div>
            <div className="mt-auto">
              <div className="text-3xl font-display font-bold">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground tracking-widest font-bold">{stat.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* AI Coach Banner */}
      <Link href="/coach">
        <GlassCard className="p-6 cursor-pointer flex items-center justify-between group overflow-hidden relative border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all duration-300">
          <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/20 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/40 transition-all duration-500" />
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-primary flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <img src={`${import.meta.env.BASE_URL}images/ai-orb.png`} alt="AI" className="w-10 h-10 object-contain" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white">ACCESS AI TRAINER</h3>
              <p className="text-sm text-muted-foreground">Talk to your coach, modify plan or ask for guidance</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-2 transition-transform relative z-10" />
        </GlassCard>
      </Link>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Link href="/progress">
          <GlassCard className="p-5 cursor-pointer hover:border-primary/50 transition-all duration-300 group">
            <Trophy className="w-6 h-6 text-yellow-400 mb-3" />
            <div className="font-display font-bold">PROGRESS</div>
            <div className="text-xs text-muted-foreground">View achievements</div>
          </GlassCard>
        </Link>
        <Link href="/profile">
          <GlassCard className="p-5 cursor-pointer hover:border-primary/50 transition-all duration-300 group">
            <Activity className="w-6 h-6 text-primary mb-3" />
            <div className="font-display font-bold">PROFILE</div>
            <div className="text-xs text-muted-foreground">Update settings</div>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
}
