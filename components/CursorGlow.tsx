import React, { useEffect, useRef } from 'react';

const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const animate = () => {
      // Smooth follow effect
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full z-0 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-500"
      style={{
        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
        marginTop: '-300px',
        marginLeft: '-300px',
        opacity: 1, // Always visible but subtle
      }}
    />
  );
};

export default CursorGlow;