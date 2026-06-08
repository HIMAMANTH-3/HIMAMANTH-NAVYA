'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPING_TEXTS = [
  'Every great adventure starts with a best friend.',
  'You make every ordinary day extraordinary.',
  'Life is genuinely better because you exist.',
  'Today is your day — Happy Best Friend Day! 🎉',
];

export default function HeroSection() {
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Typewriter effect
  useEffect(() => {
    const current = TYPING_TEXTS[textIndex];
    const speed = isDeleting ? 40 : 70;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(current.slice(0, typedText.length + 1));
        if (typedText.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setTypedText(current.slice(0, typedText.length - 1));
        if (typedText.length === 0) {
          setIsDeleting(false);
          setTextIndex((i) => (i + 1) % TYPING_TEXTS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, textIndex]);

  // Generate sparkles
  useEffect(() => {
    setSparkles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ zIndex: 1 }}>
      {/* Sparkles */}
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], rotate: [0, 180, 360] }}
          transition={{ duration: 3 + s.delay, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        >
          <span style={{ fontSize: `${8 + Math.random() * 12}px`, color: '#ff4fa3' }}>✦</span>
        </motion.div>
      ))}

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm tracking-[0.4em] uppercase mb-4"
          style={{ color: '#ffc2e2', fontFamily: 'Inter, sans-serif', fontWeight: 300, textShadow: '0 0 20px #ffc2e260' }}
        >
          ✦ 08 June · Best Friend Day ✦
        </motion.p>

        {/* Name — the star of the show */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.35, type: 'spring', stiffness: 70 }}
          className="mb-4"
        >
          <span
            style={{
              fontFamily: 'Dancing Script, cursive',
              fontSize: 'clamp(3rem, 10vw, 7.5rem)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ffd700, #ff4fa3, #ffc2e2, #ffd700)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 25px #ffd70080) drop-shadow(0 0 50px #ff4fa360)',
              animation: 'gradient-shift 3s ease infinite',
              display: 'inline-block',
              lineHeight: 1.1,
            }}
          >
            Navya Jiii
          </span>
          {/* Underline glow */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #ffd700, #ff4fa3, #ffd700, transparent)',
              boxShadow: '0 0 12px #ffd700, 0 0 24px #ff4fa380',
              borderRadius: '2px',
              marginTop: '4px',
            }}
          />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, type: 'spring', stiffness: 80 }}
          className="font-playfair font-black leading-tight mb-8"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.8rem, 7.5vw, 6.5rem)',
            background: 'linear-gradient(135deg, #ff4fa3, #ffc2e2, #ffffff, #ffc2e2, #ff4fa3)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px #ff4fa380)',
            animation: 'gradient-shift 4s ease infinite',
          }}
        >
          HAPPY BEST<br />
          <span style={{ fontStyle: 'italic' }}>FRIEND DAY</span>{' '}
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-block', WebkitTextFillColor: '#ff4fa3', filter: 'drop-shadow(0 0 20px #ff4fa3)' }}
          >
            🎉
          </motion.span>
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mx-auto mb-8"
          style={{ width: '200px', height: '1px', background: 'linear-gradient(90deg, transparent, #ff4fa3, transparent)', boxShadow: '0 0 10px #ff4fa3' }}
        />

        {/* Typing subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-xl md:text-2xl"
          style={{ fontFamily: 'Dancing Script, cursive', color: '#ffc2e2', textShadow: '0 0 15px #ffc2e280, 0 0 30px #ff4fa340', minHeight: '2em' }}
        >
          {typedText}
          <span className="typewriter-cursor" />
        </motion.p>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-6 text-sm tracking-[0.3em] uppercase"
          style={{ color: 'rgba(255, 194, 226, 0.5)', fontFamily: 'Inter, sans-serif' }}
        >
          Because NAVYA JIII deserves a whole day dedicated to her ✦
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-12"
        >
          <motion.button
            onClick={scrollToNext}
            className="btn-luxury"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Celebrate Together ✦
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: '#ff4fa360', fontSize: '24px' }}>
          ↓
        </motion.div>
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(255,79,163,0.4)', fontFamily: 'Inter' }}>
          Scroll
        </p>
      </motion.div>
    </section>
  );
}
