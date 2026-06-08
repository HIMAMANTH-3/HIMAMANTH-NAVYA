'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CakeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true]);
  const [allBlown, setAllBlown] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const frameRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    color: string; size: number; life: number; maxLife: number; type: 'firework' | 'petal';
  }>>([]);

  const blowCandle = (i: number) => {
    setCandlesLit((prev) => {
      const next = [...prev];
      next[i] = false;
      if (next.every((v) => !v)) {
        setAllBlown(true);
        setTimeout(() => triggerFireworks(), 500);
      }
      return next;
    });
  };

  const triggerFireworks = () => {
    setShowFireworks(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const colors = ['#ff4fa3', '#ffc2e2', '#ffd700', '#9b59b6', '#ff80c0', '#b76e79'];

    for (let b = 0; b < 20; b++) {
      setTimeout(() => {
        const bx = Math.random() * canvas.width;
        const by = Math.random() * canvas.height * 0.6;
        for (let p = 0; p < 40; p++) {
          const angle = (p / 40) * Math.PI * 2;
          const speed = Math.random() * 5 + 2;
          particlesRef.current.push({
            x: bx, y: by,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 2,
            life: 0, maxLife: 80 + Math.random() * 40,
            type: 'firework',
          });
        }
        for (let r = 0; r < 5; r++) {
          particlesRef.current.push({
            x: Math.random() * canvas.width, y: -10,
            vx: (Math.random() - 0.5) * 2, vy: Math.random() * 2 + 1,
            color: '#ff4fa3', size: Math.random() * 10 + 6,
            life: 0, maxLife: 200, type: 'petal',
          });
        }
      }, b * 300);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx; p.y += p.vy; p.life++;
        if (p.type === 'firework') { p.vy += 0.1; p.vx *= 0.98; }
        else { p.vx += Math.sin(time * 0.001 + p.x) * 0.05; }
        const alpha = 1 - p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        if (p.type === 'firework') {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color; ctx.shadowBlur = 8; ctx.shadowColor = p.color; ctx.fill();
        } else {
          ctx.translate(p.x, p.y); ctx.rotate(p.life * 0.05);
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        return p.life < p.maxLife;
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const reset = () => {
    setCandlesLit([true, true, true, true, true]);
    setAllBlown(false);
    setShowFireworks(false);
    particlesRef.current = [];
  };

  return (
    <section id="cake" className="relative section-padding overflow-hidden" style={{ zIndex: 1 }}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: showFireworks ? 50 : -1 }} />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: '#ff4fa380', fontFamily: 'Inter' }}>
            Make A Wish
          </p>
          <h2
            className="font-playfair text-5xl md:text-7xl mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(135deg, #ffd700, #ff4fa3, #ffc2e2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px #ff4fa340)',
            }}
          >
            Celebration Time 🎊
          </h2>
          <p style={{ color: 'rgba(255,194,226,0.6)', fontFamily: 'Dancing Script, cursive', fontSize: '20px' }}>
            {allBlown
              ? '🎉 Your wish is on its way — today is YOURS! 🎉'
              : 'Click each candle, make a wish, and celebrate YOU'}
          </p>
        </motion.div>

        {/* Cake */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative"
          >
            {/* Candles */}
            <div className="flex gap-6 justify-center mb-2 relative z-10">
              {candlesLit.map((lit, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center cursor-none"
                  onClick={() => lit && blowCandle(i)}
                  whileHover={lit ? { scale: 1.2 } : {}}
                  whileTap={lit ? { scale: 0.9 } : {}}
                >
                  <AnimatePresence>
                    {lit && (
                      <motion.div initial={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0, y: -10 }} transition={{ duration: 0.3 }} style={{ marginBottom: '2px' }}>
                        <motion.div
                          animate={{ scaleX: [1, 0.8, 1.1, 0.9, 1], scaleY: [1, 1.2, 0.9, 1.1, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ width: '12px', height: '20px', background: 'radial-gradient(ellipse at bottom, #ffd700, #ff6b00, #ff4fa3)', borderRadius: '50% 50% 40% 40%', boxShadow: '0 0 10px #ffd700, 0 0 20px #ff6b00', transformOrigin: 'bottom center' }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!lit && (
                    <motion.div initial={{ opacity: 1, y: 0, scale: 1 }} animate={{ opacity: 0, y: -20, scale: 2 }} transition={{ duration: 1 }}
                      style={{ width: '8px', height: '15px', background: 'rgba(200,200,200,0.3)', borderRadius: '50%', filter: 'blur(4px)', marginBottom: '2px' }}
                    />
                  )}
                  <div style={{
                    width: '14px', height: '50px',
                    background: lit ? 'linear-gradient(135deg, #ffc2e2, #ff4fa3, #ffc2e2)' : 'linear-gradient(135deg, #888, #aaa)',
                    borderRadius: '3px 3px 0 0',
                    boxShadow: lit ? '0 0 8px #ff4fa360' : 'none',
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', top: '8px', left: '2px', width: '3px', height: '12px', background: '#ffc2e2', borderRadius: '0 0 3px 3px', opacity: 0.5 }} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Top tier */}
            <div style={{ width: '200px', height: '70px', background: 'linear-gradient(135deg, #ff80c0, #ff4fa3, #d4006d)', borderRadius: '10px 10px 0 0', margin: '0 auto', position: 'relative', boxShadow: '0 -4px 20px rgba(255,79,163,0.4)' }}>
              {[15, 40, 65, 90, 115, 140, 165].map((x, i) => (
                <div key={i} style={{ position: 'absolute', top: '-12px', left: `${x}px`, width: '18px', height: '20px', background: '#ffc2e2', borderRadius: '0 0 50% 50%' }} />
              ))}
              <p className="absolute inset-0 flex items-center justify-center text-white text-sm tracking-wider" style={{ fontFamily: 'Dancing Script, cursive', textShadow: '0 0 10px rgba(255,255,255,0.5)', fontSize: '18px' }}>
                Navya Jiii ✨
              </p>
            </div>

            {/* Middle tier */}
            <div style={{ width: '280px', height: '80px', background: 'linear-gradient(135deg, #240046, #3a005f, #240046)', margin: '0 auto', position: 'relative', borderLeft: '2px solid rgba(255,79,163,0.3)', borderRight: '2px solid rgba(255,79,163,0.3)' }}>
              {[20, 60, 100, 140, 180, 220, 255].map((x, i) => (
                <div key={i} style={{ position: 'absolute', top: '50%', left: `${x}px`, width: '10px', height: '10px', background: '#ff4fa3', borderRadius: '50%', transform: 'translateY(-50%)', boxShadow: '0 0 6px #ff4fa3' }} />
              ))}
            </div>

            {/* Bottom tier */}
            <div style={{ width: '340px', height: '90px', background: 'linear-gradient(135deg, #ff4fa3, #d4006d, #ff4fa3)', borderRadius: '0 0 20px 20px', margin: '0 auto', position: 'relative', boxShadow: '0 10px 40px rgba(255,79,163,0.5)' }}>
              {[20, 55, 90, 125, 160, 195, 230, 265, 300].map((x, i) => (
                <div key={i} style={{ position: 'absolute', top: '-10px', left: `${x}px`, width: '20px', height: '18px', background: '#ffc2e2', borderRadius: '0 0 50% 50%' }} />
              ))}
              <p className="absolute inset-0 flex items-center justify-center text-white" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '15px', textShadow: '0 0 10px rgba(255,255,255,0.5)', textAlign: 'center', padding: '0 12px' }}>
                Happy Best Friend Day, Navya Jiii ✦
              </p>
            </div>

            {/* Plate */}
            <div style={{ width: '380px', height: '16px', background: 'linear-gradient(135deg, #b76e79, #c9a0a0, #b76e79)', borderRadius: '0 0 50px 50px', margin: '0 auto', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }} />
          </motion.div>

          {allBlown && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-12 text-center">
              <motion.button className="btn-luxury" onClick={reset} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Light Again ✦
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
