'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REASONS = [
  { emoji: '😂', text: 'You make me laugh until I can\'t breathe and my stomach hurts' },
  { emoji: '🫂', text: 'You give the kind of hugs that actually fix things' },
  { emoji: '🧠', text: 'Your advice is always exactly what I need to hear, even when it\'s hard' },
  { emoji: '🎤', text: 'You sing along to everything and it\'s genuinely the best thing ever' },
  { emoji: '🌙', text: 'You pick up the phone at 2AM without question or judgment' },
  { emoji: '🛡️', text: 'You defend me like it\'s a personal mission and I love that about you' },
  { emoji: '🌟', text: 'You see the best in me even when I\'ve completely given up on myself' },
  { emoji: '🎨', text: 'Your creativity and weird ideas make life 10x more interesting' },
  { emoji: '🍕', text: 'You never judge my food orders. Never. That is rare and powerful.' },
  { emoji: '📱', text: 'Your memes and voice notes are the highlight of my worst days' },
  { emoji: '💎', text: 'You are genuinely one of the rarest people I\'ve ever met' },
  { emoji: '🚀', text: 'You push me to be better without making me feel bad about where I am' },
  { emoji: '🤫', text: 'You take secrets to the grave. The most powerful trait a friend can have.' },
  { emoji: '⚡', text: 'Your energy is infectious — you walk in and the whole room changes' },
  { emoji: '🌻', text: 'You always show up. Not just in the good times — in all of them.' },
  { emoji: '🎯', text: 'You know exactly what to say and when to say absolutely nothing at all' },
  { emoji: '🦋', text: 'You\'ve grown so much and watching that has been genuinely inspiring' },
  { emoji: '☀️', text: 'You bring light into situations that feel completely hopeless' },
  { emoji: '🎵', text: 'Every playlist you\'ve shared has changed how I see the world a little' },
  { emoji: '✨', text: 'You are my person. My best friend. My favourite human on this planet.' },
];

interface HeartParticle {
  id: number; x: number; y: number;
  angle: number; speed: number; size: number;
}

function StarExplosion({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  const particles: HeartParticle[] = Array.from({ length: 16 }, (_, i) => ({
    id: i, x, y,
    angle: (i / 16) * Math.PI * 2,
    speed: 60 + Math.random() * 80,
    size: 10 + Math.random() * 14,
  }));

  useEffect(() => {
    const t = setTimeout(onDone, 1000);
    return () => clearTimeout(t);
  }, [onDone]);

  const emojis = ['🎉', '✨', '⭐', '🌟', '💫'];

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{ position: 'absolute', left: p.x, top: p.y, fontSize: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(p.angle) * p.speed, y: Math.sin(p.angle) * p.speed, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          {emojis[p.id % emojis.length]}
        </motion.div>
      ))}
    </div>
  );
}

export default function ReasonsSection() {
  const [explosions, setExplosions] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleClick = (index: number, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const id = ++idRef.current;
    setExplosions((prev) => [...prev, { id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }]);
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section id="reasons" className="relative section-padding" style={{ zIndex: 1 }}>
      {explosions.map((e) => (
        <StarExplosion key={e.id} x={e.x} y={e.y} onDone={() => setExplosions((prev) => prev.filter((p) => p.id !== e.id))} />
      ))}

      <div className="max-w-6xl mx-auto">
        <div ref={sectionRef} className="section-reveal text-center mb-20">
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: '#ff4fa380', fontFamily: 'Inter' }}>
            Chapter Three
          </p>
          <h2
            className="font-playfair text-5xl md:text-7xl mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(135deg, #ff4fa3, #ffc2e2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px #ff4fa340)',
            }}
          >
            Why You Are My Person
          </h2>
          <p style={{ color: 'rgba(255,194,226,0.5)', fontFamily: 'Inter', fontSize: '14px' }}>
            Tap each card to reveal ✦ {flipped.size} / {REASONS.length} discovered
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {REASONS.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ scale: 1.08, y: -6 }}
              onClick={(e) => handleClick(i, e)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-none"
              style={{
                background: flipped.has(i) ? 'linear-gradient(135deg, #ff4fa320, #24004660)' : 'rgba(36, 0, 70, 0.4)',
                border: `1px solid ${flipped.has(i) ? '#ff4fa380' : 'rgba(255,79,163,0.15)'}`,
                boxShadow: flipped.has(i) ? '0 0 20px #ff4fa330' : '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
              }}
            >
              <AnimatePresence mode="wait">
                {!flipped.has(i) ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-3"
                  >
                    <span style={{ fontSize: '2.5rem' }}>{reason.emoji}</span>
                    <div className="mt-2 text-xs text-center" style={{ color: '#ff4fa360', fontFamily: 'Inter' }}>
                      Tap ✦
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center p-3"
                  >
                    <p className="text-center leading-relaxed" style={{ fontFamily: 'Dancing Script, cursive', fontSize: '13px', color: '#ffc2e2' }}>
                      {reason.text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{ background: 'rgba(255,79,163,0.2)', color: '#ff4fa3', fontFamily: 'Inter', fontSize: '10px', border: '1px solid #ff4fa340' }}
              >
                {i + 1}
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {flipped.size === REASONS.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-16"
            >
              <p className="text-3xl" style={{ fontFamily: 'Dancing Script, cursive', color: '#ffc2e2', textShadow: '0 0 20px #ff4fa360' }}>
                You are all of these and so much more 🎉
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
