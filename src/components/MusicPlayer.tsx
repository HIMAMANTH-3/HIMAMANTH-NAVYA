'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Show player after a delay
    const t = setTimeout(() => setVisible(true), 3000);

    // Create audio element programmatically
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    // Using a free romantic piano piece from a CDN
    audio.src = 'https://open.spotify.com/track/6O1VWYPfl85dDeKiaCJKza?si=BU57ZXU6Rpm6u5EBBsOWjQ';
    audioRef.current = audio;

    return () => {
      clearTimeout(t);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 glass-strong px-4 py-3 rounded-2xl"
          style={{
            background: 'rgba(36, 0, 70, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 79, 163, 0.3)',
            boxShadow: '0 0 20px rgba(255, 79, 163, 0.2)',
          }}
        >
          {/* Musical note animation */}
          {playing && (
            <div className="flex items-end gap-px h-5">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ background: '#ff4fa3' }}
                  animate={{ height: ['4px', '16px', '4px'] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          )}
          {!playing && (
            <span style={{ color: '#ff4fa360', fontSize: '18px' }}>♫</span>
          )}

          <div className="flex flex-col">
            <p className="text-xs tracking-widest uppercase" style={{ color: '#ffc2e280', fontFamily: 'Inter' }}>
              {playing ? 'Playing' : 'Music'}
            </p>
            <p className="text-xs" style={{ color: '#ffc2e2', fontFamily: 'Dancing Script, cursive' }}>
              Love Melody
            </p>
          </div>

          {/* Volume slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className="w-16 accent-pink-400 hidden sm:block"
            style={{ accentColor: '#ff4fa3' }}
          />

          {/* Play/Pause Button */}
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: playing
                ? 'linear-gradient(135deg, #ff4fa3, #240046)'
                : 'rgba(255, 79, 163, 0.2)',
              border: '1px solid #ff4fa360',
              boxShadow: playing ? '0 0 15px #ff4fa380' : 'none',
              color: 'white',
              fontSize: '14px',
              cursor: 'none',
            }}
          >
            {playing ? '⏸' : '▶'}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
