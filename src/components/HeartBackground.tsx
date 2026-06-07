import React, { useEffect, useState } from 'react';

interface HeartParticle {
  id: number;
  left: string;
  size: number;
  floatDuration: string;
  floatDelay: string;
  rotateDeg: string;
  color: string;
  scale: number;
}

export default function HeartBackground() {
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  useEffect(() => {
    // Generate a set of lovely random particles
    const list: HeartParticle[] = [];
    const colors = [
      'rgba(236, 72, 153, 0.25)', // Rose Pink
      'rgba(139, 92, 246, 0.25)', // Gentle Purple
      'rgba(244, 63, 94, 0.25)',  // Coral Rose
      'rgba(217, 70, 239, 0.20)',  // Soft Magenta
    ];

    for (let i = 0; i < 35; i++) {
      const size = Math.floor(Math.random() * 25) + 12; // 12px to 37px
      const left = `${Math.random() * 100}%`;
      const floatDuration = `${Math.floor(Math.random() * 14) + 14}s`; // 14s to 28s for slow calm flow
      const floatDelay = `${Math.floor(Math.random() * 10) * -1}s`; // Backdated delay so some start halfways
      const rotateDeg = `${Math.floor(Math.random() * 90) - 45}deg`;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const scale = parseFloat((Math.random() * 0.6 + 0.6).toFixed(2));

      list.push({
        id: i,
        left,
        size,
        floatDuration,
        floatDelay,
        rotateDeg,
        color,
        scale,
      });
    }

    setParticles(list);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {particles.map((p) => (
        <svg
          key={p.id}
          className="floating-heart"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--float-duration': p.floatDuration,
            '--float-delay': p.floatDelay,
            '--float-x': `${Math.random() * 160 - 80}px`,
            '--float-scale': p.scale.toString(),
            '--float-rotate': p.rotateDeg,
            '--heart-color': p.color,
          } as React.CSSProperties}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}

      {/* Decorative Background Glows from Immersive UI */}
      <div className="absolute -top-[10%] -left-[10%] w-[45vw] h-[45vw] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none select-none"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[55vw] h-[55vw] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none select-none"></div>

      {/* Sparkling Glow ambient background blur lights */}
      <div className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] rounded-full bg-pink-500/10 blur-[130px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[40vw] h-[40vw] rounded-full bg-violet-600/10 blur-[150px] animate-pulse duration-[5000ms] pointer-events-none" />
    </div>
  );
}
