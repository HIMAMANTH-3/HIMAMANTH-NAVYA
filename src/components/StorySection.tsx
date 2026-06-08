'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TIMELINE = [
  {
    year: 'Once Upon a Time',
    title: 'The Day We Met',
    desc: 'Out of billions of people on this planet, we somehow ended up in each other\'s orbit. The universe really outdid itself that day.',
    emoji: '🌟',
  },
  {
    year: 'The Early Days',
    title: 'When We Just Clicked',
    desc: 'That moment you realise someone just gets you — no explanation needed, no performance required. That happened with you, instantly.',
    emoji: '⚡',
  },
  {
    year: 'The Good Stuff',
    title: 'Every Ridiculous Memory',
    desc: 'Every inside joke, every chaotic plan, every late-night conversation that went way too deep — all stored permanently in my highlight reel.',
    emoji: '😂',
  },
  {
    year: 'Right Now & Always',
    title: 'Today We Celebrate Us',
    desc: 'Best Friend Day exists because the world finally admitted what we already knew — some friendships are just absolutely irreplaceable.',
    emoji: '🎉',
  },
];

function TimelineCard({ item, index }: { item: typeof TIMELINE[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className={`section-reveal flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'} mb-16`}>
      <div className="flex-1">
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`glass-strong p-8 rounded-3xl ${isLeft ? 'text-right' : 'text-left'}`}
          style={{
            background: 'rgba(36, 0, 70, 0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 79, 163, 0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 30px rgba(255,79,163,0.05)',
          }}
        >
          <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'justify-end' : 'justify-start'}`}>
            <span style={{ fontSize: '28px' }}>{item.emoji}</span>
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: '#ff4fa3', fontFamily: 'Inter', fontWeight: 500 }}>
              {item.year}
            </span>
          </div>
          <h3 className="text-2xl mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#ffc2e2', textShadow: '0 0 10px #ffc2e240' }}>
            {item.title}
          </h3>
          <p style={{ color: 'rgba(255, 194, 226, 0.7)', fontFamily: 'Inter', lineHeight: '1.7', fontSize: '15px' }}>
            {item.desc}
          </p>
        </motion.div>
      </div>

      <div className="flex-shrink-0 flex flex-col items-center">
        <motion.div
          whileInView={{ scale: [0, 1.5, 1] }}
          transition={{ duration: 0.6 }}
          className="w-5 h-5 rounded-full border-2"
          style={{ borderColor: '#ff4fa3', background: '#240046', boxShadow: '0 0 15px #ff4fa3' }}
        />
      </div>

      <div className="flex-1" />
    </div>
  );
}

export default function StorySection() {
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
    <section id="story" className="relative section-padding" style={{ zIndex: 1 }}>
      <div className="max-w-4xl mx-auto">
        <div ref={sectionRef} className="section-reveal text-center mb-24">
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: '#ff4fa380', fontFamily: 'Inter' }}>
            Chapter One
          </p>
          <h2
            className="font-playfair text-5xl md:text-7xl mb-6"
            style={{
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(135deg, #ff4fa3, #ffc2e2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px #ff4fa340)',
            }}
          >
            Our Friendship Story
          </h2>
          <p style={{ color: 'rgba(255,194,226,0.5)', fontFamily: 'Dancing Script, cursive', fontSize: '20px' }}>
            The chapters that made us us
          </p>
          <div className="mx-auto mt-4" style={{ width: '100px', height: '1px', background: 'linear-gradient(90deg, transparent, #ff4fa3, transparent)', boxShadow: '0 0 10px #ff4fa3' }} />
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: 'linear-gradient(to bottom, transparent, #ff4fa340, #24004640, transparent)' }} />
          {TIMELINE.map((item, i) => (
            <TimelineCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
