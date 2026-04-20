import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Activity, Dumbbell, User, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Activity, label: "Home" },
    { path: "/workout", icon: Dumbbell, label: "Train" },
    { path: "/coach", icon: MessageSquare, label: "Coach" },
    { path: "/progress", icon: Activity, label: "Stats" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative">
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pb-20 md:pb-0 md:pl-24 overflow-x-hidden">
        <motion.div
          key={location}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Nav (Mobile) / Side Nav (Desktop) */}
      <nav className="fixed bottom-0 inset-x-0 md:inset-y-0 md:right-auto md:w-24 bg-black/80 backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/10 z-50">
        <ul className="flex flex-row md:flex-col justify-around md:justify-center items-center h-20 md:h-full px-4 md:px-0 md:py-12 gap-2 md:gap-8">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path} className="relative group">
                <Link href={item.path} className={cn(
                  "flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                )}>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="absolute -inset-1 bg-primary/30 blur-md rounded-xl" />
                    </motion.div>
                  )}
                  <Icon className="w-6 h-6 relative z-10 mb-1" />
                  <span className="text-[10px] font-display font-bold relative z-10">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
