import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "motion/react";

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glowColor?: string;
}

export function ParallaxCard({ children, className = "", style = {}, glowColor = "transparent" }: ParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for rotation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for fluid feel
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { damping: 25, stiffness: 180 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { damping: 25, stiffness: 180 });

  // Glow position motion values
  const glowX = useSpring(useMotionValue(0), { damping: 30, stiffness: 200 });
  const glowY = useSpring(useMotionValue(0), { damping: 30, stiffness: 200 });

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Relative mouse coordinates from -0.5 to 0.5
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(relativeX);
    y.set(relativeY);

    // Absolute pixel coords for glow effect
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative perspective ${className}`}
    >
      {/* Dynamic Glow Overlay */}
      {glowColor !== "transparent" && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[32px] mix-blend-screen transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${glowX}px ${glowY}px, ${glowColor}, transparent 80%)`,
            opacity: isHovered ? 0.35 : 0,
          }}
        />
      )}
      <div style={{ transform: "translateZ(15px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}
