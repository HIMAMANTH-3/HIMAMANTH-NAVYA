'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });
const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false });
const MusicPlayer = dynamic(() => import('@/components/MusicPlayer'), { ssr: false });

import HeroSection from '@/components/HeroSection';
import StorySection from '@/components/StorySection';
import GallerySection from '@/components/GallerySection';
import ReasonsSection from '@/components/ReasonsSection';
import LoveLetterSection from '@/components/LoveLetterSection';
import CountdownSection from '@/components/CountdownSection';
import CakeSection from '@/components/CakeSection';
import FinalSurprise from '@/components/FinalSurprise';

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleLoadComplete = () => {
    setLoaded(true);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}
      <CustomCursor />
      {showContent && <MusicPlayer />}
      <ParticleBackground />

      <main className="relative" style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        {/* Navigation dots */}
        <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
          {[
            { id: 'hero', label: 'Home' },
            { id: 'story', label: 'Our Story' },
            { id: 'memories', label: 'Memories' },
            { id: 'reasons', label: 'Reasons' },
            { id: 'letter', label: 'Note' },
            { id: 'countdown', label: 'Today' },
            { id: 'cake', label: 'Celebrate' },
            { id: 'final', label: 'Finale' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}
              title={section.label}
              className="group relative flex items-center justify-end gap-2"
              style={{ cursor: 'none' }}
            >
              <span className="opacity-0 group-hover:opacity-100 text-xs tracking-widest uppercase whitespace-nowrap transition-opacity duration-200"
                style={{ color: '#ffc2e2', fontFamily: 'Inter', fontSize: '10px' }}>
                {section.label}
              </span>
              <div className="w-2 h-2 rounded-full transition-all duration-300 group-hover:w-3 group-hover:h-3"
                style={{ background: 'rgba(255, 79, 163, 0.4)', border: '1px solid rgba(255, 79, 163, 0.6)' }} />
            </button>
          ))}
        </nav>

        <HeroSection />
        <SectionDivider />
        <StorySection />
        <SectionDivider />
        <GallerySection />
        <SectionDivider />
        <ReasonsSection />
        <SectionDivider />
        <LoveLetterSection />
        <SectionDivider />
        <CountdownSection />
        <SectionDivider />
        <CakeSection />
        <SectionDivider />
        <FinalSurprise />

        <footer className="relative z-10 text-center py-12 section-padding" style={{ borderTop: '1px solid rgba(255,79,163,0.1)' }}>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '22px', color: '#ffc2e2', textShadow: '0 0 15px rgba(255,194,226,0.3)' }}>
            Made with 🎉 for NAVYA JIII — the world&apos;s greatest best friend
          </p>
          <p className="mt-2 text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(255,79,163,0.3)', fontFamily: 'Inter' }}>
            08 · June · Best Friend Day · Celebrated Every Year
          </p>
        </footer>
      </main>
    </>
  );
}

function SectionDivider() {
  return (
    <div className="relative flex items-center justify-center py-4 mx-auto max-w-xs">
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,79,163,0.2))' }} />
      <span className="mx-4 text-sm" style={{ color: 'rgba(255,79,163,0.4)' }}>✦</span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,79,163,0.2), transparent)' }} />
    </div>
  );
}
