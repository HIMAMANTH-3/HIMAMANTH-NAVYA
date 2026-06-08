'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MEMORIES = [
  { emoji: '😂', title: 'Laughing Till We Cried', color: '#ff9a56' },
  { emoji: '🍕', title: 'Late-Night Food Runs', color: '#ff4fa3' },
  { emoji: '🎵', title: 'Our Playlist on Repeat', color: '#9b59b6' },
  { emoji: '📱', title: '3AM Texts That Hit Different', color: '#c67c4e' },
  { emoji: '🌙', title: 'Long Night Convos', color: '#4a90d9' },
  { emoji: '🤡', title: 'Our Unhinged Moments', color: '#e91e8c' },
  { emoji: '🎂', title: 'Every Birthday Together', color: '#ff4fa3' },
  { emoji: '🚗', title: 'Random Drive Sessions', color: '#00b8d9' },
  { emoji: '🦋', title: 'Growing Up Together', color: '#a29bfe' },
  { emoji: '🛒', title: 'Grocery Store Chaos', color: '#e74c3c' },
  { emoji: '⭐', title: 'Stargazing & Big Dreams', color: '#ffd700' },
  { emoji: '🏕️', title: 'Every Plan We Made', color: '#ff6b35' },
];

export default function GallerySection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="memories" className="relative section-padding" style={{ zIndex: 1 }}>
      <div className="max-w-6xl mx-auto">
        <div ref={sectionRef} className="section-reveal text-center mb-20">
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: '#ff4fa380', fontFamily: 'Inter' }}>
            Chapter Two
          </p>
          <h2
            className="font-playfair text-5xl md:text-7xl mb-6"
            style={{
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(135deg, #ffc2e2, #ff4fa3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px #ff4fa340)',
            }}
          >
            Our Best Moments
          </h2>
          <p style={{ color: 'rgba(255, 194, 226, 0.6)', fontFamily: 'Dancing Script, cursive', fontSize: '20px' }}>
            The memories I'll rewind on the worst days
          </p>
          <div className="mx-auto mt-4" style={{ width: '100px', height: '1px', background: 'linear-gradient(90deg, transparent, #ff4fa3, transparent)', boxShadow: '0 0 10px #ff4fa3' }} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MEMORIES.map((memory, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
              onClick={() => setSelected(i)}
              onHoverStart={() => setHoveredIdx(i)}
              onHoverEnd={() => setHoveredIdx(null)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-none group"
              style={{
                background: `linear-gradient(135deg, ${memory.color}20, ${memory.color}05)`,
                border: `1px solid ${memory.color}30`,
                boxShadow: hoveredIdx === i
                  ? `0 20px 60px ${memory.color}40, 0 0 30px ${memory.color}30`
                  : '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, transparent 40%, ${memory.color}15 60%, transparent)` }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <motion.span
                  animate={hoveredIdx === i ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : { scale: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
                >
                  {memory.emoji}
                </motion.span>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={hoveredIdx === i ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 0 }}
                  className="mt-3 text-center text-sm font-medium"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#ffc2e2', textShadow: '0 0 10px rgba(255,194,226,0.5)' }}
                >
                  {memory.title}
                </motion.p>
              </div>
              <motion.span
                className="absolute top-2 right-2 text-xs"
                animate={hoveredIdx === i ? { opacity: 1, scale: 1.2 } : { opacity: 0.3, scale: 1 }}
                style={{ color: memory.color }}
              >
                ✦
              </motion.span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 40 }}
                className="max-w-sm w-full text-center p-12 rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, ${MEMORIES[selected].color}15, rgba(36,0,70,0.9))`,
                  border: `1px solid ${MEMORIES[selected].color}40`,
                  boxShadow: `0 0 60px ${MEMORIES[selected].color}30`,
                  backdropFilter: 'blur(20px)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <span style={{ fontSize: '5rem' }}>{MEMORIES[selected].emoji}</span>
                <h3 className="text-2xl mt-4 mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#ffc2e2' }}>
                  {MEMORIES[selected].title}
                </h3>
                <p style={{ color: 'rgba(255,194,226,0.6)', fontFamily: 'Dancing Script, cursive', fontSize: '18px' }}>
                  A memory I'll treasure forever
                </p>
                <button className="mt-8 btn-luxury" onClick={() => setSelected(null)}>
                  Close ✦
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
