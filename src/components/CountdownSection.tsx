'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Best Friend Day: June 8 every year
function getTargetDate() {
  const now = new Date();
  const year = now.getFullYear();
  // June 8 (month index 5)
  let target = new Date(year, 5, 8, 0, 0, 0);
  // If today is already past June 8, count to next year
  if (now > target && !(now.getMonth() === 5 && now.getDate() === 8)) {
    target = new Date(year + 1, 5, 8, 0, 0, 0);
  }
  return target;
}

function isBFFDayToday() {
  const now = new Date();
  return now.getMonth() === 5 && now.getDate() === 8; // June 8
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const isToday = isBFFDayToday();

      if (isToday) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true });
        return;
      }

      const target = getTargetDate();
      const diff = target.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isToday: false });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }}>
      <div
        className="relative rounded-2xl flex items-center justify-center"
        style={{
          width: 'clamp(70px, 15vw, 110px)',
          height: 'clamp(70px, 15vw, 110px)',
          background: 'linear-gradient(135deg, rgba(36,0,70,0.8), rgba(13,2,33,0.9))',
          border: '1px solid rgba(255,79,163,0.3)',
          boxShadow: '0 0 20px rgba(255,79,163,0.15), 0 0 50px rgba(255,79,163,0.05), inset 0 0 20px rgba(255,79,163,0.05)',
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ background: 'radial-gradient(circle, rgba(255,79,163,0.2) 0%, transparent 70%)' }}
        />
        <motion.span
          key={value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ff4fa3, #ffc2e2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 10px #ff4fa3)',
          }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </div>
      <p className="mt-3 text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(255,194,226,0.5)', fontFamily: 'Inter' }}>
        {label}
      </p>
    </motion.div>
  );
}

export default function CountdownSection() {
  const { days, hours, minutes, seconds, isToday } = useCountdown();

  return (
    <section id="countdown" className="relative section-padding" style={{ zIndex: 1 }}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: '#ff4fa380', fontFamily: 'Inter' }}>
            {isToday ? '🎉 It\'s Happening Right Now' : 'Mark Your Calendar'}
          </p>
          <h2
            className="font-playfair text-5xl md:text-6xl mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(135deg, #ff4fa3, #ffc2e2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px #ff4fa340)',
            }}
          >
            {isToday ? '🎊 TODAY IS THE DAY 🎊' : 'Next Best Friend Day'}
          </h2>
          <p style={{ color: 'rgba(255,194,226,0.5)', fontFamily: 'Dancing Script, cursive', fontSize: '20px' }}>
            {isToday
              ? 'June 8 — the one day the world officially agrees you deserve all the love'
              : 'Counting every second until we celebrate again'}
          </p>
        </motion.div>

        {/* If today IS BFF Day, show a big celebration display */}
        {isToday ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="flex flex-col items-center gap-6"
          >
            {/* Pulsing celebration badge */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], boxShadow: ['0 0 20px #ff4fa360', '0 0 60px #ff4fa3', '0 0 20px #ff4fa360'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full px-10 py-6"
              style={{
                background: 'linear-gradient(135deg, #ff4fa320, #24004660)',
                border: '2px solid #ff4fa3',
              }}
            >
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#ffc2e2', textShadow: '0 0 20px #ff4fa3' }}>
                🎉 Happy Best Friend Day! 🎉
              </p>
            </motion.div>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontFamily: 'Dancing Script, cursive', fontSize: '22px', color: '#ffc2e2' }}
            >
              Today we celebrate the greatest friendship in the universe
            </motion.p>
          </motion.div>
        ) : (
          /* Countdown timer for future years */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-4 md:gap-8 flex-wrap"
          >
            <CountUnit value={days} label="Days" />
            <span style={{ color: '#ff4fa380', fontSize: '2rem', fontFamily: 'Playfair Display', marginBottom: '2rem' }}>:</span>
            <CountUnit value={hours} label="Hours" />
            <span style={{ color: '#ff4fa380', fontSize: '2rem', fontFamily: 'Playfair Display', marginBottom: '2rem' }}>:</span>
            <CountUnit value={minutes} label="Minutes" />
            <span style={{ color: '#ff4fa380', fontSize: '2rem', fontFamily: 'Playfair Display', marginBottom: '2rem' }}>:</span>
            <CountUnit value={seconds} label="Seconds" />
          </motion.div>
        )}

        {/* Date stamp */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, transparent, #ff4fa360)' }} />
          <p className="text-sm tracking-[0.3em] uppercase" style={{ color: 'rgba(255,79,163,0.6)', fontFamily: 'Inter' }}>
            08 · June · Every Year
          </p>
          <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, #ff4fa360, transparent)' }} />
        </motion.div>
      </div>
    </section>
  );
}
