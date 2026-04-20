import { GlassCard } from "@/components/GlassCard";
import { Activity, Trophy, Flame, Target } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useGetProgressStats } from "@workspace/api-client-react";

export default function Progress() {
  const { data: stats, isLoading } = useGetProgressStats();

  // Mock data for chart if api fails or is empty
  const mockWeeklyData = [
    { day: "MON", minutes: 45 },
    { day: "TUE", minutes: 0 },
    { day: "WED", minutes: 60 },
    { day: "THU", minutes: 30 },
    { day: "FRI", minutes: 45 },
    { day: "SAT", minutes: 90 },
    { day: "SUN", minutes: 0 },
  ];

  const chartData = stats?.weeklyActivity?.length ? stats.weeklyActivity : mockWeeklyData;

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-primary animate-pulse">LOADING METRICS...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-10 mt-4">
        <h1 className="text-4xl md:text-5xl font-display font-black text-white">PERFORMANCE <span className="text-primary neon-text">METRICS</span></h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <GlassCard className="lg:col-span-2 p-6 border-white/10 flex flex-col">
          <h2 className="font-display font-bold tracking-widest mb-6 flex items-center gap-2">
            <Activity className="text-primary w-5 h-5" /> WEEKLY VOLUME (MINUTES)
          </h2>
          <div className="h-64 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 12, fontFamily: 'monospace' }} 
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(0,255,255,0.3)', borderRadius: '8px' }}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? "hsl(180 100% 50%)" : "hsl(240 10% 20%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Badges/Achievements */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-6 border-accent/30 bg-accent/5 flex-1 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/20 blur-3xl rounded-full group-hover:bg-accent/40 transition-all" />
            <h2 className="font-display font-bold tracking-widest mb-6 flex items-center gap-2 text-white">
              <Flame className="text-accent w-5 h-5" /> CURRENT STREAK
            </h2>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-accent to-white">
                {stats?.currentStreak || 5}
              </span>
              <span className="text-xl font-bold tracking-widest text-muted-foreground pb-2">DAYS</span>
            </div>
            <p className="text-sm text-accent/80 font-mono">Personal Best: {stats?.longestStreak || 12} Days</p>
          </GlassCard>

          <GlassCard className="p-6 border-secondary/30 bg-secondary/5 flex-1 relative overflow-hidden group">
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-secondary/20 blur-3xl rounded-full group-hover:bg-secondary/40 transition-all" />
            <h2 className="font-display font-bold tracking-widest mb-6 flex items-center gap-2 text-white">
              <Target className="text-secondary w-5 h-5" /> LIFETIME REPS
            </h2>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-secondary to-white">
                {(stats?.totalReps || 1420).toLocaleString()}
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Badges Section */}
        <div className="lg:col-span-3">
          <h2 className="font-display font-bold tracking-widest mb-6 mt-4 flex items-center gap-2">
            <Trophy className="text-yellow-500 w-5 h-5" /> UNLOCKED DIRECTIVES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard glow className="p-6 text-center flex flex-col items-center">
              <img src={`${import.meta.env.BASE_URL}images/badge-streak.png`} alt="Streak Badge" className="w-24 h-24 mb-4 drop-shadow-[0_0_15px_rgba(255,165,0,0.5)]" />
              <h3 className="font-bold tracking-widest text-sm mb-1">IRON WILL</h3>
              <p className="text-xs text-muted-foreground font-mono">5 Day Streak</p>
            </GlassCard>
            <GlassCard glow className="p-6 text-center flex flex-col items-center">
              <img src={`${import.meta.env.BASE_URL}images/badge-power.png`} alt="Power Badge" className="w-24 h-24 mb-4 drop-shadow-[0_0_15px_rgba(157,0,255,0.5)]" />
              <h3 className="font-bold tracking-widest text-sm mb-1">TITAN CORE</h3>
              <p className="text-xs text-muted-foreground font-mono">Lift 10,000 lbs total</p>
            </GlassCard>
            <GlassCard className="p-6 text-center flex flex-col items-center opacity-40 grayscale">
               <div className="w-24 h-24 mb-4 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
                 <Trophy className="w-8 h-8 text-muted-foreground" />
               </div>
              <h3 className="font-bold tracking-widest text-sm mb-1">CYBORG</h3>
              <p className="text-xs text-muted-foreground font-mono">Complete 50 Workouts</p>
            </GlassCard>
            <GlassCard className="p-6 text-center flex flex-col items-center opacity-40 grayscale">
               <div className="w-24 h-24 mb-4 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
                 <Activity className="w-8 h-8 text-muted-foreground" />
               </div>
              <h3 className="font-bold tracking-widest text-sm mb-1">SPEED DEMON</h3>
              <p className="text-xs text-muted-foreground font-mono">Sub-30min HIIT</p>
            </GlassCard>
          </div>
        </div>

      </div>
    </div>
  );
}
