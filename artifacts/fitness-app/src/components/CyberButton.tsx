import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  fullWidth?: boolean;
}

export function CyberButton({ 
  children, 
  variant = "primary", 
  fullWidth, 
  className,
  ...props 
}: CyberButtonProps) {
  const baseClasses = "relative font-display font-bold tracking-widest uppercase transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 group clip-path-slant-btn px-6 py-4";
  
  const variants = {
    primary: "bg-primary text-black hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]",
    secondary: "bg-secondary text-white hover:bg-white hover:text-secondary hover:shadow-[0_0_20px_rgba(157,0,255,0.6)]",
    destructive: "bg-destructive/20 text-destructive border border-destructive hover:bg-destructive hover:text-white",
    ghost: "bg-transparent text-primary border border-primary/30 hover:bg-primary/10 hover:border-primary"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseClasses, variants[variant], fullWidth && "w-full", className)}
      {...props}
    >
      {/* Diagonal scanline effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[45deg] group-hover:animate-[shimmer_1.5s_infinite]" />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
