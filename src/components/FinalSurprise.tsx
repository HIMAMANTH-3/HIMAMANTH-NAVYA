'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinalSurprise() {
  const [heartOpen, setHeartOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const itemsRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; rotation: number; rotSpeed: number; emoji: string;
  }>>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const emojis = ['🎉', '✨', '⭐', '🎊', '💫', '🌟', '🤍', '🎈'];

    const spawn = () => {
      for (let i = 0; i < 3; i++) {
        itemsRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 20,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 2 + 1),
          size: Math.random() * 24 + 10,
          opacity: 1,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.04,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        });
      }
    };
    const spawnInterval = setInterval(spawn, 300);

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      itemsRef.current = itemsRef.current.filter((h) => {
        h.x += h.vx + Math.sin(time * 0.001 + h.y * 0.01) * 0.3;
        h.y += h.vy;
        h.rotation += h.rotSpeed;
        const progress = 1 - h.y / canvas.height;
        h.opacity = Math.max(0, Math.min(1, progress * 3));
        if (h.y < -60) return false;
        ctx.save();
        ctx.globalAlpha = h.opacity * 0.8;
        ctx.font = `${h.size}px serif`;
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation);
        ctx.fillText(h.emoji, -h.size / 2, h.size / 2);
        ctx.restore();
        return true;
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearInterval(spawnInterval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section id="final" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ zIndex: 1 }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: '#ff4fa380', fontFamily: 'Inter' }}>
            The Grand Finale
          </p>
          <h2
            className="font-playfair text-4xl md:text-6xl mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(135deg, #ff4fa3, #ffc2e2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            A Message From The Heart
          </h2>
        </motion.div>

        <div className="flex flex-col items-center">
          <motion.div
            onClick={() => setHeartOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-none relative"
            animate={!heartOpen ? { scale: [1, 1.05, 1] } : {}}
            transition={!heartOpen ? { duration: 2, repeat: Infinity } : {}}
          >
            <svg width="240" height="220" viewBox="0 0 240 220" style={{ filter: 'drop-shadow(0 0 30px #ff4fa3) drop-shadow(0 0 60px #ff4fa380)' }}>
              <defs>
                <radialGradient id="hg3" cx="50%" cy="40%">
                  <stop offset="0%" stopColor="#ff80c0" />
                  <stop offset="50%" stopColor="#ff4fa3" />
                  <stop offset="100%" stopColor="#240046" />
                </radialGradient>
                <radialGradient id="hg4" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#ff4fa3" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ff4fa3" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="120" cy="110" rx="120" ry="110" fill="url(#hg4)" />
              <path d="M120,195 C80,160 20,130 20,75 C20,40 50,15 85,15 C100,15 112,22 120,33 C128,22 140,15 155,15 C190,15 220,40 220,75 C220,130 160,160 120,195Z" fill="url(#hg3)" />
              <path d="M80,30 C90,25 105,28 112,40 C105,35 88,35 80,30Z" fill="rgba(255,255,255,0.3)" />
            </svg>

            {!heartOpen && (
              <motion.p
                className="mt-4 text-sm tracking-widest uppercase"
                style={{ color: 'rgba(255,79,163,0.6)', fontFamily: 'Inter' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Click to Open 🎉
              </motion.p>
            )}
          </motion.div>

          <AnimatePresence>
            {heartOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, type: 'spring', stiffness: 60 }}
                className="mt-12 max-w-2xl"
              >
                <div
                  className="p-10 md:p-16 rounded-3xl relative"
                  style={{ background: 'rgba(36, 0, 70, 0.7)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,79,163,0.4)', boxShadow: '0 0 80px rgba(255,79,163,0.2)' }}
                >
                  <span className="absolute -top-6 left-8 text-8xl" style={{ color: '#ff4fa320', fontFamily: 'Playfair Display, serif' }}>"</span>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="text-2xl md:text-3xl leading-relaxed mb-8"
                    style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#ffc2e2', textShadow: '0 0 20px rgba(255,194,226,0.3)' }}
                  >
                    Not everyone gets a best friend like you.<br />
                    I got the best one — <span style={{ color: '#ffd700', textShadow: '0 0 15px #ffd700' }}>Navya Jiii</span>.<br />
                    And I&apos;m never letting go.
                  </motion.p>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #ff4fa3, transparent)', marginBottom: '24px' }}
                  />

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}>
                    <p className="text-2xl mb-2" style={{ fontFamily: 'Dancing Script, cursive', color: '#ff4fa3', textShadow: '0 0 15px #ff4fa3' }}>
                      Happy Best Friend Day, Navya Jiii 🎉
                    </p>
                    <p className="text-sm tracking-[0.3em] uppercase" style={{ color: 'rgba(255,194,226,0.5)', fontFamily: 'Inter' }}>
                      08 · June · Best Friend Day
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
