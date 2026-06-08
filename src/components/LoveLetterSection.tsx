'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTER_TEXT = `To my absolute best friend,
Navya Jiii — this one's for you.

Happy Best Friend Day.

I know, I know — it sounds like a made-up holiday. But honestly? It's the most real holiday there is, because it's the only one that's entirely about you.

I've been thinking about what to say, and everything keeps coming out sounding too small for how big this friendship actually is. So let me just be honest:

You are one of the best things that has ever happened to me.

Not in a dramatic way (well, maybe a little dramatic — you know how I am). In the quiet, everyday way that matters more. The way you make hard things feel lighter. The way you laugh at my terrible jokes like they're actually funny. The way you show up — not just when things are good, but when things are a complete disaster.

That's rare. You are rare.

On Best Friend Day, I want you to know:
I see you. I appreciate you. I am genuinely so lucky to have you.

Thank you for being the kind of friend people write about.
Thank you for choosing to stick around.
Thank you for being YOU.

Happy Best Friend Day, you absolute legend.

— Your best friend
  (The better-looking one, obviously)`;

export default function LoveLetterSection() {
  const [opened, setOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => setShowLetter(true), 600);
  };

  return (
    <section id="letter" className="relative section-padding" style={{ zIndex: 1 }}>
      <div className="max-w-3xl mx-auto">
        <div ref={sectionRef} className="section-reveal text-center mb-16">
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: '#ff4fa380', fontFamily: 'Inter' }}>
            Just For You
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
            A Note From Me
          </h2>
          <p style={{ color: 'rgba(255,194,226,0.5)', fontFamily: 'Dancing Script, cursive', fontSize: '18px' }}>
            Click the envelope to open it
          </p>
        </div>

        <div className="flex flex-col items-center">
          {!showLetter && (
            <motion.div className="relative cursor-none" whileHover={{ scale: 1.03, y: -5 }} onClick={handleOpen}>
              <motion.div
                className="relative rounded-2xl overflow-hidden"
                style={{ width: '380px', height: '260px', background: 'linear-gradient(135deg, rgba(36,0,70,0.9), rgba(13,2,33,0.95))', border: '1px solid rgba(255,79,163,0.4)', boxShadow: '0 20px 60px rgba(255,79,163,0.2), 0 0 40px rgba(255,79,163,0.1)' }}
                animate={opened ? { rotateX: 15 } : { rotateX: 0 }}
              >
                <motion.div
                  className="absolute top-0 left-0 right-0"
                  style={{ height: '130px', background: 'linear-gradient(160deg, #240046, #0d0221)', clipPath: 'polygon(0 0, 50% 60%, 100% 0)', borderBottom: '1px solid rgba(255,79,163,0.3)', transformOrigin: 'top center' }}
                  animate={opened ? { rotateX: -180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute bottom-0 left-0 right-0" style={{ height: '130px', clipPath: 'polygon(0 100%, 50% 40%, 100% 100%)', background: 'linear-gradient(0deg, #180033, #240046)', borderTop: '1px solid rgba(255,79,163,0.3)' }} />
                <div className="absolute left-0 top-0 bottom-0" style={{ width: '50%', clipPath: 'polygon(0 0, 100% 50%, 0 100%)', background: 'rgba(36,0,70,0.3)', borderRight: '1px solid rgba(255,79,163,0.15)' }} />
                <div className="absolute right-0 top-0 bottom-0" style={{ width: '50%', clipPath: 'polygon(100% 0, 0 50%, 100% 100%)', background: 'rgba(36,0,70,0.3)', borderLeft: '1px solid rgba(255,79,163,0.15)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="rounded-full flex items-center justify-center"
                    style={{ width: '60px', height: '60px', background: 'radial-gradient(circle, #ff4fa3, #240046)', boxShadow: '0 0 20px #ff4fa3' }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span style={{ fontSize: '24px' }}>🎉</span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.p
                className="mt-6 text-center text-sm tracking-widest uppercase"
                style={{ color: 'rgba(255,79,163,0.6)', fontFamily: 'Inter' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Click to open ✦
              </motion.p>
            </motion.div>
          )}

          <AnimatePresence>
            {showLetter && (
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
                className="w-full rounded-3xl p-8 md:p-12 relative"
                style={{ background: 'rgba(36, 0, 70, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,79,163,0.3)', boxShadow: '0 30px 80px rgba(255,79,163,0.15), 0 0 50px rgba(255,79,163,0.05)' }}
              >
                {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
                  <span key={i} className={`absolute ${pos} text-xs`} style={{ color: '#ff4fa340' }}>✦</span>
                ))}
                <pre className="whitespace-pre-wrap leading-relaxed" style={{ fontFamily: 'Dancing Script, cursive', fontSize: 'clamp(15px, 2vw, 19px)', color: '#ffc2e2', lineHeight: '1.8' }}>
                  {LETTER_TEXT}
                </pre>
                <button className="mt-8 btn-luxury" onClick={() => { setShowLetter(false); setOpened(false); }}>
                  Close ✦
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
