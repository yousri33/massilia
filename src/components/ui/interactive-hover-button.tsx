import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ReactNode;
  variant?: 'navy' | 'coral';
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", icon = <ArrowRight size={18} />, variant = 'navy', className, ...props }, ref) => {
  const isCoral = variant === 'coral';
  
  return (
    <button
      ref={ref}
      className={cn(
        "group relative min-w-[14rem] px-8 py-3 cursor-pointer overflow-hidden rounded-full border transition-all duration-500 hover:shadow-xl active:scale-95",
        isCoral 
          ? "bg-white text-coral border-coral/20 hover:border-coral" 
          : "bg-white text-navy border-navy/10 hover:border-navy",
        className,
      )}
      {...props}
    >
      {/* Container for the text sliding effect */}
      <div className="relative z-10 font-bold tracking-tight whitespace-nowrap transition-all duration-500 group-hover:translate-x-12 opacity-100 group-hover:opacity-0 flex items-center justify-center">
        {text}
      </div>

      {/* Hover State Container */}
      <div className={cn(
        "absolute inset-0 z-20 flex items-center justify-center gap-2 text-white -translate-x-12 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 font-bold tracking-tight whitespace-nowrap",
        isCoral ? "bg-coral" : "bg-navy"
      )}>
        {text}
        {icon}
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
