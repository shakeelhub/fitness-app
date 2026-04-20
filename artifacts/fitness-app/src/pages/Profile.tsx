import { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { CyberButton } from "@/components/CyberButton";
import { User, Activity, Target, Utensils, X, Loader2 } from "lucide-react";
import { useGetUserProfile, useUpsertUserProfile } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

interface MealItem {
  meal: string;
  items: { food: string; quantity: string; calories: string }[];
  totalCalories: string;
}

interface DietPlan {
  dailyCalories: string;
  protein: string;
  carbs: string;
  fat: string;
  meals: MealItem[];
  note: string;
}

export default function Profile() {
  const { data: profile, isLoading } = useGetUserProfile();
  const updateProfile = useUpsertUserProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    age: 25,
    fitnessLevel: "beginner" as "beginner" | "intermediate" | "advanced",
    goals: [] as string[],
    preferredWorkouts: [] as string[]
  });

  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [dietLoading, setDietLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        age: profile.age || 25,
        fitnessLevel: profile.fitnessLevel || "beginner",
        goals: profile.goals || [],
        preferredWorkouts: profile.preferredWorkouts || []
      });
    }
  }, [profile]);

  // lock body scroll when modal open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showModal]);

  const GOALS = ["Muscle Gain", "Weight Loss", "Endurance", "Flexibility", "Strength"];
  const WORKOUTS = ["Hypertrophy", "HIIT", "Cardio", "Calisthenics", "Powerlifting"];

  const toggleArrayItem = (arrayName: 'goals' | 'preferredWorkouts', item: string) => {
    setFormData(prev => {
      const arr = prev[arrayName];
      return {
        ...prev,
        [arrayName]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
      };
    });
  };

  const handleSave = () => {
    updateProfile.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "PROFILE UPDATED", description: "Your calibration parameters have been saved." });
      },
      onError: () => {
        toast({ title: "ERROR", description: "Failed to update profile.", variant: "destructive" });
      }
    });
  };

  const generateDietPlan = async () => {
    setDietLoading(true);
    setDietPlan(null);
    setShowModal(true);

    try {
      const prompt = `You are a professional sports nutritionist. Generate a detailed daily meal plan for:
- Name: ${formData.name || "User"}
- Age: ${formData.age}
- Fitness Level: ${formData.fitnessLevel}
- Goals: ${formData.goals.join(", ") || "General fitness"}
- Preferred Workouts: ${formData.preferredWorkouts.join(", ") || "Mixed"}

Return ONLY a valid JSON object in this exact format, no extra text:
{
  "dailyCalories": "2400 kcal",
  "protein": "180g",
  "carbs": "280g",
  "fat": "65g",
  "meals": [
    {
      "meal": "Breakfast",
      "items": [
        { "food": "Oats", "quantity": "80g", "calories": "300 kcal" },
        { "food": "Eggs", "quantity": "3 whole", "calories": "210 kcal" }
      ],
      "totalCalories": "510 kcal"
    },
    {
      "meal": "Mid-Morning Snack",
      "items": [
        { "food": "Banana", "quantity": "1 medium", "calories": "90 kcal" }
      ],
      "totalCalories": "90 kcal"
    },
    {
      "meal": "Lunch",
      "items": [],
      "totalCalories": "700 kcal"
    },
    {
      "meal": "Pre-Workout",
      "items": [],
      "totalCalories": "200 kcal"
    },
    {
      "meal": "Dinner",
      "items": [],
      "totalCalories": "600 kcal"
    }
  ],
  "note": "One line personalized tip based on their goals"
}`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer API_KEY_HERE`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed: DietPlan = JSON.parse(clean);
      setDietPlan(parsed);
    } catch (err) {
      toast({ title: "ERROR", description: "Failed to generate diet plan. Try again.", variant: "destructive" });
      setShowModal(false);
    } finally {
      setDietLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center font-display tracking-widest animate-pulse text-primary">INITIALIZING PROFILE...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">

      {/* ── MODAL OVERLAY ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-green-400/30 bg-[#0a0a0f] shadow-[0_0_60px_rgba(74,222,128,0.15)]">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0f]">
              <div className="flex items-center gap-3">
                <Utensils className="w-5 h-5 text-green-400" />
                <h2 className="font-display tracking-widest text-lg text-green-400">NUTRITION PROTOCOL</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-muted-foreground hover:text-white hover:border-white/30 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <p className="text-xs text-muted-foreground font-mono mb-6">
                Personalized for {formData.name || "Operative"} · {formData.age}y · {formData.fitnessLevel} · {formData.goals.join(", ") || "General fitness"}
              </p>

              {dietLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-green-400" />
                  <p className="font-mono text-muted-foreground text-sm tracking-widest animate-pulse">CALCULATING MACROS...</p>
                  <p className="font-mono text-muted-foreground/50 text-xs">Analyzing your profile parameters</p>
                </div>
              ) : dietPlan ? (
                <>
                  {/* Macro Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {[
                      { label: "CALORIES", value: dietPlan.dailyCalories, color: "text-green-400", border: "border-green-400/20" },
                      { label: "PROTEIN", value: dietPlan.protein, color: "text-blue-400", border: "border-blue-400/20" },
                      { label: "CARBS", value: dietPlan.carbs, color: "text-yellow-400", border: "border-yellow-400/20" },
                      { label: "FAT", value: dietPlan.fat, color: "text-orange-400", border: "border-orange-400/20" },
                    ].map(macro => (
                      <div key={macro.label} className={`bg-black/40 rounded-xl p-4 border ${macro.border} text-center`}>
                        <p className="text-xs text-muted-foreground font-mono tracking-widest mb-1">{macro.label}</p>
                        <p className={`font-display font-bold text-xl ${macro.color}`}>{macro.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Meals */}
                  <div className="space-y-3">
                    {dietPlan.meals.map((meal, i) => (
                      <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                        <div className="bg-white/5 px-4 py-3 flex justify-between items-center">
                          <span className="font-display font-bold tracking-wider text-sm text-white">{meal.meal}</span>
                          <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{meal.totalCalories}</span>
                        </div>
                        <div className="divide-y divide-white/5">
                          {meal.items.map((item, j) => (
                            <div key={j} className="px-4 py-3 flex justify-between items-center">
                              <span className="font-sans text-sm text-white/80">{item.food}</span>
                              <div className="flex gap-4 text-xs font-mono">
                                <span className="text-muted-foreground">{item.quantity}</span>
                                <span className="text-green-400/70">{item.calories}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tip */}
                  {dietPlan.note && (
                    <div className="mt-6 p-4 rounded-xl bg-green-400/5 border border-green-400/20">
                      <p className="text-sm font-mono text-green-400/80">💡 {dietPlan.note}</p>
                    </div>
                  )}

                  {/* Regenerate button */}
                  <button
                    onClick={generateDietPlan}
                    className="mt-6 w-full py-3 rounded-xl border border-green-400/30 text-green-400/70 font-mono text-xs tracking-widest hover:border-green-400/60 hover:text-green-400 transition-all"
                  >
                    ↻ REGENERATE PLAN
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <header className="mb-10 mt-4">
        <h1 className="text-4xl md:text-5xl font-display font-black text-white">OPERATIVE <span className="text-secondary neon-text">PROFILE</span></h1>
        <p className="text-muted-foreground font-mono mt-2">Calibrate your physical parameters for optimal Diet Plan.</p>
      </header>

      <div className="space-y-8">
        {/* Basic Info */}
        <GlassCard className="p-6 border-white/10">
          <h2 className="font-display tracking-widest text-lg mb-6 flex items-center gap-2 border-b border-white/10 pb-2">
            <User className="w-5 h-5 text-primary" /> IDENTIFICATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-muted-foreground">CALLSIGN (NAME)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 font-sans text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-muted-foreground">AGE CYCLES</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 font-sans text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </GlassCard>

        {/* Fitness Level */}
        <GlassCard className="p-6 border-white/10">
          <h2 className="font-display tracking-widest text-lg mb-6 flex items-center gap-2 border-b border-white/10 pb-2">
            <Activity className="w-5 h-5 text-secondary" /> CURRENT CAPABILITY
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["beginner", "intermediate", "advanced"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFormData({...formData, fitnessLevel: level})}
                className={`p-4 rounded-xl text-left transition-all relative overflow-hidden border ${
                  formData.fitnessLevel === level
                    ? 'border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(157,0,255,0.2)]'
                    : 'border-white/10 bg-black/30 hover:border-white/30'
                }`}
              >
                {formData.fitnessLevel === level && (
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent pointer-events-none" />
                )}
                <h3 className="font-display font-bold uppercase tracking-wider relative z-10">{level}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-1 relative z-10">
                  {level === "beginner" && "Less than 6 months exp."}
                  {level === "intermediate" && "Consistent training."}
                  {level === "advanced" && "Peak performance state."}
                </p>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Goals & Preferences */}
        <GlassCard className="p-6 border-white/10">
          <h2 className="font-display tracking-widest text-lg mb-6 flex items-center gap-2 border-b border-white/10 pb-2">
            <Target className="w-5 h-5 text-accent" /> DIRECTIVES & MODALITIES
          </h2>
          <div className="mb-6">
            <label className="text-xs font-bold tracking-widest text-muted-foreground block mb-3">PRIMARY OBJECTIVES</label>
            <div className="flex flex-wrap gap-2">
              {GOALS.map(goal => (
                <button
                  key={goal}
                  onClick={() => toggleArrayItem('goals', goal)}
                  className={`px-4 py-2 rounded-full font-mono text-sm border transition-all ${
                    formData.goals.includes(goal)
                      ? 'border-accent bg-accent/20 text-white shadow-[0_0_10px_rgba(255,0,128,0.3)]'
                      : 'border-white/10 bg-black text-muted-foreground hover:border-white/30'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest text-muted-foreground block mb-3">PREFERRED MODALITIES</label>
            <div className="flex flex-wrap gap-2">
              {WORKOUTS.map(workout => (
                <button
                  key={workout}
                  onClick={() => toggleArrayItem('preferredWorkouts', workout)}
                  className={`px-4 py-2 rounded-full font-mono text-sm border transition-all ${
                    formData.preferredWorkouts.includes(workout)
                      ? 'border-primary bg-primary/20 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                      : 'border-white/10 bg-black text-muted-foreground hover:border-white/30'
                  }`}
                >
                  {workout}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <CyberButton fullWidth onClick={handleSave} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "SAVING..." : "SAVE CALIBRATION"}
          </CyberButton>

          <button
            onClick={generateDietPlan}
            disabled={dietLoading}
            className="w-full py-4 rounded-xl border border-green-400/50 bg-green-400/10 text-green-400 font-display tracking-widest font-bold text-sm hover:bg-green-400/20 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Utensils className="w-5 h-5" /> GENERATE DIET PLAN
          </button>
        </div>
      </div>
    </div>
  );
}