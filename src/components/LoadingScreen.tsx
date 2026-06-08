'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  color: string;
}

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [heartScale, setHeartScale] = useState(1);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const rotationRef = useRef(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const colors = ['#ff4fa3', '#ffc2e2', '#b76e79', '#ffffff', '#ff80c0'];
    particlesRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random(),
      speed: Math.random() * 0.3 + 0.1,
      drift: (Math.random() - 0.5) * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      progressRef.current += Math.random() * 3 + 1;
      if (progressRef.current >= 100) {
        progressRef.current = 100;
        clearInterval(progressInterval);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 800);
        }, 500);
      }
      setProgress(Math.floor(progressRef.current));
    }, 60);

    // Heartbeat scale
    let hbTime = 0;
    const hbInterval = setInterval(() => {
      hbTime += 0.05;
      const s = 1 + 0.08 * Math.sin(hbTime * 2) * Math.sin(hbTime);
      setHeartScale(s);
    }, 16);

    const drawHeart = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      rotation: number,
      scale: number,
      time: number
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      // Glow layers
      for (let i = 3; i >= 0; i--) {
        const glowSize = size + i * 18;
        const glowAlpha = 0.06 - i * 0.01;
        const gradient = ctx.createRadialGradient(0, 0, glowSize * 0.3, 0, 0, glowSize);
        gradient.addColorStop(0, `rgba(255, 79, 163, ${glowAlpha + 0.04})`);
        gradient.addColorStop(1, 'rgba(255, 79, 163, 0)');

        ctx.beginPath();
        // Heart path
        const s2 = glowSize / 30;
        ctx.moveTo(0, -s2 * 10);
        ctx.bezierCurveTo(s2 * 11, -s2 * 22, s2 * 30, -s2 * 5, 0, s2 * 15);
        ctx.bezierCurveTo(-s2 * 30, -s2 * 5, -s2 * 11, -s2 * 22, 0, -s2 * 10);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Main heart
      const s = size / 30;
      const heartGrad = ctx.createLinearGradient(0, -size, 0, size);
      heartGrad.addColorStop(0, '#ff80c0');
      heartGrad.addColorStop(0.5, '#ff4fa3');
      heartGrad.addColorStop(1, '#240046');

      ctx.beginPath();
      ctx.moveTo(0, -s * 10);
      ctx.bezierCurveTo(s * 11, -s * 22, s * 30, -s * 5, 0, s * 15);
      ctx.bezierCurveTo(-s * 30, -s * 5, -s * 11, -s * 22, 0, -s * 10);
      ctx.fillStyle = heartGrad;
      ctx.shadowBlur = 40;
      ctx.shadowColor = '#ff4fa3';
      ctx.fill();

      // Shine
      ctx.beginPath();
      ctx.moveTo(-s * 8, -s * 16);
      ctx.bezierCurveTo(-s * 4, -s * 20, s * 2, -s * 18, s * 3, -s * 12);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.shadowBlur = 0;
      ctx.fill();

      ctx.restore();
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      bgGrad.addColorStop(0, '#240046');
      bgGrad.addColorStop(0.5, '#0d0221');
      bgGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Particles (stars)
      particlesRef.current.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        p.opacity = 0.3 + 0.7 * Math.abs(Math.sin(time * 0.001 + p.x));
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.x = Math.random() * canvas.width;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Rotating heart
      rotationRef.current += 0.008;
      drawHeart(
        ctx,
        canvas.width / 2,
        canvas.height / 2 - 60,
        80,
        rotationRef.current,
        heartScale,
        time
      );

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(progressInterval);
      clearInterval(hbInterval);
      window.removeEventListener('resize', resize);
    };
  }, [onComplete, heartScale]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />
          
          <div className="relative z-10 flex flex-col items-center gap-8 mt-48">
            {/* Loading text */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="font-dancing text-2xl text-blush tracking-widest text-glow-soft"
                 style={{ color: '#ffc2e2', textShadow: '0 0 15px #ffc2e280, 0 0 30px #ff4fa360' }}>
                Happy Best Friend Day! 🎉
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-64 h-px bg-white/10 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #ff4fa3, #ffc2e2, #ff4fa3)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s linear infinite',
                  boxShadow: '0 0 10px #ff4fa3',
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <motion.p
              className="text-sm tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255, 194, 226, 0.6)', fontFamily: 'Inter, sans-serif' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {progress}%
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
