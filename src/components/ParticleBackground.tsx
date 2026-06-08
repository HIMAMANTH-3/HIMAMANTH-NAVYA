'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  size: number; color: string; opacity: number;
}

interface FloatingHeart {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  rotation: number; rotSpeed: number;
  life: number; maxLife: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);
  const heartsRef = useRef<FloatingHeart[]>([]);
  const frameRef = useRef<number>(0);
  const scrollRef = useRef(0);

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

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouse);

    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll);

    const colors = ['#ff4fa3', '#ffc2e2', '#b76e79', '#ffffff', '#ff80c0', '#d4a0ff'];

    // Initialize stars
    starsRef.current = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 3,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -Math.random() * 0.15 - 0.05,
      vz: 0,
      size: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random(),
    }));

    // Spawn floating hearts periodically
    const spawnHeart = () => {
      heartsRef.current.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 1.5 + 0.5),
        size: Math.random() * 18 + 8,
        opacity: 1,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        life: 0,
        maxLife: Math.random() * 180 + 120,
      });
    };
    const heartInterval = setInterval(spawnHeart, 800);

    const drawSmallHeart = (
      ctx: CanvasRenderingContext2D,
      cx: number, cy: number,
      size: number, rotation: number, alpha: number
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      const s = size / 30;
      ctx.beginPath();
      ctx.moveTo(0, -s * 10);
      ctx.bezierCurveTo(s * 11, -s * 22, s * 30, -s * 5, 0, s * 15);
      ctx.bezierCurveTo(-s * 30, -s * 5, -s * 11, -s * 22, 0, -s * 10);
      ctx.fillStyle = '#ff4fa3';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff4fa3';
      ctx.fill();
      ctx.restore();
    };

    const drawBg = (ctx: CanvasRenderingContext2D, t: number) => {
      const scroll = scrollRef.current;
      const totalH = document.body.scrollHeight || canvas.height;
      const scrollPct = scroll / Math.max(totalH - canvas.height, 1);

      // Background gradient shifts as user scrolls
      const r1 = Math.floor(36 + scrollPct * 30);
      const g1 = 0;
      const b1 = Math.floor(70 + scrollPct * 20);
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2 + (mouseRef.current.x - canvas.width / 2) * 0.05,
        canvas.height / 2 + (mouseRef.current.y - canvas.height / 2) * 0.05,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      bgGrad.addColorStop(0, `rgb(${r1}, ${g1}, ${b1})`);
      bgGrad.addColorStop(0.4, '#0d0221');
      bgGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    let time = 0;
    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBg(ctx, time);

      // Stars with twinkle
      starsRef.current.forEach((s) => {
        s.x += s.vx + (mouseRef.current.x / canvas.width - 0.5) * 0.3;
        s.y += s.vy;
        s.opacity = 0.2 + 0.8 * Math.abs(Math.sin(time * 1.5 + s.x * 0.01));
        if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.opacity * 0.8;
        ctx.shadowBlur = s.size > 1.5 ? 6 : 0;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      // Floating hearts
      heartsRef.current = heartsRef.current.filter((h) => {
        h.x += h.vx + Math.sin(time * 2 + h.x * 0.01) * 0.4;
        h.y += h.vy;
        h.rotation += h.rotSpeed;
        h.life++;
        const progress = h.life / h.maxLife;
        h.opacity = progress < 0.1 ? progress * 10 : progress > 0.8 ? (1 - progress) * 5 : 1;
        if (h.life >= h.maxLife) return false;
        drawSmallHeart(ctx, h.x, h.y, h.size, h.rotation, h.opacity * 0.6);
        return true;
      });

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearInterval(heartInterval);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
