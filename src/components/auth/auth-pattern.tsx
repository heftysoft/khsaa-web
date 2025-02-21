'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function AuthPattern() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const translateX = useSpring(mouseX, springConfig);
  const translateY = useSpring(mouseY, springConfig);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) * 0.1;
      const moveY = (clientY - window.innerHeight / 2) * 0.1;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-background overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        style={{ x: translateX, y: translateY }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#C9EBFF,transparent)]" />
      </motion.div>
      
      <motion.div
        className="absolute inset-0"
        style={{ x: translateX, y: translateY, scale: 1.2 }}
      >
        <svg className="absolute h-full w-full" aria-hidden="true">
          <defs>
            <pattern
              id="dotted-pattern"
              x="50%"
              y="50%"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              patternTransform="translate(-20 -20)"
            >
              <circle cx="1" cy="1" r="1" className="fill-primary/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
        </svg>
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_-100px,#C9EBFF,transparent)]" />
    </div>
  );
}