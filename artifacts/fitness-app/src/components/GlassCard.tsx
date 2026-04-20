import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className, glow = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass-panel rounded-2xl relative overflow-hidden group",
        glow && "hover:neon-border transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Subtle top reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {/* Subtle bottom shadow line */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {children}
    </motion.div>
  );
}
