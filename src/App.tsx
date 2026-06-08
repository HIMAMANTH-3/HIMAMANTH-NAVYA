/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Heart, Sparkles, Navigation, Globe, ArrowDown, ChevronRight,
  Music, Volume2, Camera, Calendar, ArrowLeft, RotateCcw, Copy, Share2, Check
} from 'lucide-react';
import { BirthdayWebsiteData } from './types';
import HeartBackground from './components/HeartBackground';
import BirthdayCountdown from './components/BirthdayCountdown';
import ReasonsCards from './components/ReasonsCards';
import MemoryTimeline from './components/MemoryTimeline';
import PhotoGallery from './components/PhotoGallery';
import GiftBoxSurprise from './components/GiftBoxSurprise';
import BackgroundMusicPlayer from './components/BackgroundMusicPlayer';
import LiveCustomizer from './components/LiveCustomizer';

// Gorgeous default preset configuration
const DEFAULT_CRAFT_PRESET: BirthdayWebsiteData = {
  girlfriendName: 'NAVYA JIII 😉🥰',
  birthdate: '2007-04-07',
  coupleName: 'NAVYA JIII & Friends',
  mainGreetingTitle: 'Happy Birthday, Navya Jiii! 🎂❤️',
  mainGreetingSub: 'Celebrating my CHUBBY CUTEYY JIII on her special day! You make every ordinary moment extraordinary.',
  loveLetterText: `To my CHUBBY CUTEYY JIII ❤️😉

Life takes us through many places and many people, but I'm glad it led me to you.

You are the destination of countless smiles, crazy memories, and beautiful moments.

Thank you for being the amazing friend you are. No matter what happens, you'll always be one of the best parts of my journey. 💖✨🫶...`,
  timeline: [
    {
      id: 't-1',
      title: 'Connecting Hearts as Friends 🫶',
      date: 'The Beautiful Beginning',
      description: 'The incredible moment our paths crossed, sparking countless late-night laughs, shared jokes, and the beginning of a beautiful connection.',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 't-2',
      title: 'Countless Crazy Memories 🤪',
      date: 'Our Adventure Loop',
      description: 'No matter where we went, your bubbly energy, cute expressions, and amazing vibe brought the biggest smiles to my face.',
      imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 't-3',
      title: 'Always & Forever Nearby ✨',
      date: 'Every Single Day',
      description: 'Thank you for being the wonderful friend you are. No matter what happens, you\'ll always be one of the best parts of my journey.',
      imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop'
    }
  ],
  reasons: [
    {
      id: 'r-1',
      title: 'Your Bubbly Navya Smile',
      description: 'How your entire face lights up when you smile, making every ordinary moment feel completely custom and joyful.',
      icon: 'Sparkles'
    },
    {
      id: 'r-2',
      title: 'The Sweetest Supportive Heart',
      description: 'The caring, understanding, and incredibly sweet friend that you are—always there with warmth and empathy.',
      icon: 'Heart'
    },
    {
      id: 'r-3',
      title: 'CHUBBY CUTEYY Playfulness',
      description: 'Your adorable chubby cheeks and cute traits that never fail to bring a smile to my face whenever we interact!',
      icon: 'Compass'
    }
  ],
  gallery: [
    {
      id: 'g-1',
      url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
      caption: 'Navya\'s Traditional Grace 🥻✨'
    },
    {
      id: 'g-2',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      caption: 'Cute Heart Crown Vibes 🥰💖'
    },
    {
      id: 'g-3',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
      caption: 'Brightest Smiling Moments ☀️☺️'
    },
    {
      id: 'g-4',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      caption: 'Beautiful Dimples & Laughs 💫💙'
    }
  ],
  giftBoxRevealMessage: 'To my dearest Navya Jiii, on your birthday! You are an absolutely incredible friend and a beautiful soul. I am so grateful to have you in my life. Wishing you the happiest birthday filled with infinite love, smiles, and your favorite sweet treats! My gift to you is this special webpage, sealed with all my highest respect and warmest wishes! Happy Birthday! 💖✨🫶',
  musicTrackUrl: 'https://open.spotify.com/track/6O1VWYPfl85dDeKiaCJKza?si=BU57ZXU6Rpm6u5EBBsOWjQ',
  musicTrackTitle: 'Pet',
  musicArtistName: 'A Perfect Circle'
};

export default function App() {
  const [data, setData] = useState<BirthdayWebsiteData>(DEFAULT_CRAFT_PRESET);
  const [isSharedGiftMode, setIsSharedGiftMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [typedLetter, setTypedLetter] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [letterVisible, setLetterVisible] = useState(false);

  // Check if we are in the live preview / production shared URL context.
  // In the shared live preview, we want the designer sidebar and development badges to be completely hidden for a pure presentation.
  const isLivePreview = typeof window !== 'undefined' && 
    (window.location.hostname.includes('ais-pre-') || 
     (!window.location.hostname.includes('ais-dev-') && 
      !window.location.hostname.includes('localhost') && 
      !window.location.hostname.includes('127.0.0.1'))) &&
    !window.location.search.includes('editor=true') &&
    !window.location.hash.includes('editor');
  
  // Custom Cursor states
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  // Audio quick selection list
  const allTracks = [
    { title: 'Pet (Spotify Edition)', artist: 'A Perfect Circle', url: 'https://open.spotify.com/track/6O1VWYPfl85dDeKiaCJKza?si=BU57ZXU6Rpm6u5EBBsOWjQ' },
    { title: 'Romantic Soft Piano', artist: 'Classic Instrumental', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'Fairytale Acoustic Symphony', artist: 'Whimsical Orchestra', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { title: 'Gentle Moonlight Vibes', artist: 'Lounge Acoustic Guitar', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { title: 'Cozy Rain Cafe', artist: 'Ambient Jazz Duo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  ];

  // URL Hash parser on startup
  useEffect(() => {
    const parseHashData = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#gift=')) {
        try {
          const b64Data = hash.substring(6);
          // Safely decode Unicode / Base64
          const binString = atob(b64Data);
          const uint8Array = new Uint8Array(binString.length);
          for (let i = 0; i < binString.length; i++) {
            uint8Array[i] = binString.charCodeAt(i);
          }
          const decodedJSON = new TextDecoder().decode(uint8Array);
          const parsed = JSON.parse(decodedJSON);
          
          if (parsed && parsed.girlfriendName) {
            setData(parsed);
            setIsSharedGiftMode(true);
            setIsPreviewMode(true);
          }
        } catch (e) {
          console.error("Unable to parse customized URL parameters", e);
        }
      } else {
        // Fallback or read from standard edited drafted changes in localStorage
        const localDraft = localStorage.getItem('romantic_surprise_draft');
        if (localDraft) {
          try {
            setData(JSON.parse(localDraft));
          } catch (_) {}
        }
      }
    };

    parseHashData();

    // Listen for hash variations
    window.addEventListener('hashchange', parseHashData);
    return () => window.removeEventListener('hashchange', parseHashData);
  }, []);

  // Save drafts into localStorage as user makes adjustments in builder
  const handleDataChange = (newData: BirthdayWebsiteData) => {
    setData(newData);
    if (!isSharedGiftMode) {
      localStorage.setItem('romantic_surprise_draft', JSON.stringify(newData));
    }
  };

  // Custom cursor movement listener (desktop only)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest('button, a, [role="button"], input, select, textarea, .card-flip');
      setIsHoveringClickable(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Soft slow scroll driver
  const handleScrollToSurprise = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Slowly typewriter-render her romantic Letter as they scroll near or open present
  useEffect(() => {
    if (!letterVisible) return;
    
    // Typewriter speed configuration
    if (typewriterIndex < data.loveLetterText.length) {
      const timer = setTimeout(() => {
        setTypedLetter((prev) => prev + data.loveLetterText[typewriterIndex]);
        setTypewriterIndex((prev) => prev + 1);
      }, 15); // rapid, elegant typing
      return () => clearTimeout(timer);
    }
  }, [letterVisible, typewriterIndex, data.loveLetterText]);

  // Restart Typewriter
  useEffect(() => {
    setTypedLetter('');
    setTypewriterIndex(0);
  }, [data.loveLetterText]);

  const handleTrackChange = (track: { title: string; artist: string; url: string }) => {
    setData((prev) => ({
      ...prev,
      musicTrackUrl: track.url,
      musicTrackTitle: track.title,
      musicArtistName: track.artist
    }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f071a] select-none text-slate-100 font-sans relative">
      
      {/* Absolute floating romantic trail cursor (Hides on standard mobile touch screens) */}
      <div 
        className="romantic-cursor hidden md:block"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          scale: isHoveringClickable ? '1.5' : '1',
          backgroundColor: isHoveringClickable ? 'rgba(236,72,153, 0.55)' : 'rgba(244, 63, 94, 0.35)',
          boxShadow: isHoveringClickable ? '0 0 14px rgba(236,72,153, 0.6)' : 'none'
        }}
      />

      {/* 1. LEFT COLUMN: THE REAL-TIME BUILDER INPUT PANELS (Hidden in Shared, Live, or Full screen modes) */}
      {!isSharedGiftMode && !isLivePreview && !isPreviewMode && (
        <LiveCustomizer 
          data={data}
          onChange={handleDataChange}
          onPreviewToggle={() => setIsPreviewMode(true)}
          isPreviewMode={isPreviewMode}
        />
      )}

      {/* 2. RIGHT COLUMN / MAIN BODY: THE IMMERSIVE PRESENTATION SCREEN */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scroll-smooth bg-[#0f071a] bg-gradient-to-br from-[#0f071a] via-[#120622] to-[#170626]">
        
        {/* Floating background heart vectors cascading slowly */}
        <HeartBackground />

        {/* Floating Preview Badge to go back to customizer */}
        {!isSharedGiftMode && !isLivePreview && isPreviewMode && (
          <div className="fixed top-4 left-4 z-50 animate-bounce">
            <button
              onClick={() => setIsPreviewMode(false)}
              className="px-4 py-2 bg-pink-600/90 hover:bg-pink-500 rounded-full text-white text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-2xl backdrop-blur-md cursor-pointer transition-colors border border-pink-400/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Surprises Designer
            </button>
          </div>
        )}

        {/* Tiny Discovery badge in custom client modes */}
        {isSharedGiftMode && (
          <div className="fixed top-4 left-4 z-50">
            <a
              href={window.location.origin + window.location.pathname}
              className="px-4 py-2 bg-slate-900/80 hover:bg-pink-900/60 rounded-full text-pink-300 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 shadow-2xl backdrop-blur-md cursor-pointer transition-colors border border-pink-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Create Your Own Surprise
            </a>
          </div>
        )}

        {/* ================= HERO INTRO BANNER ================= */}
        <section 
          id="hero" 
          className="relative min-h-screen flex flex-col justify-center items-center px-4 md:px-8 text-center relative z-10"
        >
          {/* Subtle floral/bokeh top frame */}
          <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#ec4899]/5 to-transparent pointer-events-none" />

          {/* Floating glowing central heart back-illuminated frame */}
          <div className="p-1 px-4 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6 animate-pulse max-w-max flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-pink-300 font-bold">
              Surprise Dedicated To You
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 bg-clip-text text-transparent tracking-tight text-glow-pink pr-2 pl-2">
            {data.girlfriendName ? `Happy Birthday, ${data.girlfriendName}! ❤️` : data.mainGreetingTitle}
          </h1>

          <p className="mt-6 max-w-2xl text-slate-300/90 text-sm md:text-lg leading-relaxed font-light mx-auto px-4">
            {data.mainGreetingSub}
          </p>

          {/* Custom couple indicator */}
          <div className="mt-8 font-handwritten text-3xl md:text-4xl text-pink-300 transform -rotate-1 tracking-wide select-none">
            {data.coupleName}
          </div>

          {/* Animated Pulsating Scroll Down Button */}
          <button 
            onClick={() => {
              setLetterVisible(true);
              handleScrollToSurprise('letter-scroll');
            }}
            className="shimmer-btn mt-12 px-8 py-3.5 rounded-full text-white font-bold tracking-wider hover:scale-105 active:scale-95 duration-200 shadow-xl border border-pink-300/10 cursor-pointer flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white animate-bounce" />
            Open My Surprise
          </button>

          {/* Extra soft indicators */}
          <div className="absolute bottom-6 animate-bounce">
            <ArrowDown className="w-5 h-5 text-pink-400/60" />
          </div>
        </section>

        {/* ================= ROMANTIC TYPEWRITER LOVE LETTER ================= */}
        <section 
          id="letter-scroll" 
          className="py-16 md:py-24 px-4 max-w-4xl mx-auto relative z-10"
        >
          {/* Section banner */}
          <div className="text-center mb-10">
            <span className="font-handwritten text-3xl text-pink-400 block mb-1">A Letter from My Soul</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">Heartfelt Birthday Wishes</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-pink-500 to-violet-600 mx-auto mt-4" />
          </div>

          <div 
            onClick={() => setLetterVisible(true)}
            className="glass-panel-pink rounded-3xl p-6 md:p-10 shadow-2xl border border-pink-500/15 relative overflow-hidden group min-h-[350px] cursor-pointer"
          >
            {/* Background seal watermarks */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-500/5 rounded-full blur-2xl pointer-events-none select-none" />
            
            {/* Romantic scroll visual */}
            <div className="relative font-serif text-slate-200 text-base md:text-lg leading-relaxed whitespace-pre-wrap tracking-wide text-left inline-block content-center selection:bg-pink-900/50">
              {!letterVisible ? (
                <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-pink-500/10 rounded-full animate-pulse">
                    <Heart className="w-8 h-8 text-pink-400 fill-pink-500/30" />
                  </div>
                  <p className="text-sm font-sans tracking-widest uppercase font-bold text-pink-300">Click card to break envelope wax and read</p>
                </div>
              ) : (
                <div className="cursor-blink">
                  {typedLetter}
                  {typewriterIndex < data.loveLetterText.length && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setTypedLetter(data.loveLetterText);
                        setTypewriterIndex(data.loveLetterText.length);
                      }}
                      className="text-xs bg-slate-900/80 hover:bg-pink-950/40 text-pink-300 font-sans font-semibold rounded px-2.5 py-1 ml-4 select-none shrink-0"
                    >
                      Skip typing
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* If typewriter completes typing */}
            {letterVisible && typewriterIndex >= data.loveLetterText.length && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    setTypedLetter('');
                    setTypewriterIndex(0);
                  }}
                  className="text-xs text-slate-500 hover:text-pink-400 flex items-center gap-1 transition-colors mt-2"
                >
                  <RotateCcw className="w-3 h-3" /> Re-read Letter
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ================= COUNTDOWN TIMER ================= */}
        <section className="py-12 md:py-16 px-4 relative z-10">
          <BirthdayCountdown 
            birthdate={data.birthdate} 
            girlfriendName={data.girlfriendName} 
          />
        </section>

        {/* ================= STORY TIMELINE ================= */}
        {data.timeline && data.timeline.length > 0 && (
          <section className="py-16 md:py-24 px-4 relative z-10 bg-black/10 select-none">
            <div className="text-center mb-12">
              <span className="font-handwritten text-3xl text-violet-400 block mb-1">Our Sweet Timeline</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">Moments Sealed Forever</h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 mx-auto mt-4" />
            </div>

            <MemoryTimeline timeline={data.timeline} />
          </section>
        )}

        {/* ================= REASONS OF LOVE (3D FLYOVER) ================= */}
        {data.reasons && data.reasons.length > 0 && (
          <section className="py-16 md:py-24 px-4 relative z-10">
            <div className="text-center mb-12">
              <span className="font-handwritten text-3xl text-pink-400 block mb-1">Why You Are My Dream</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">Reasons Why I Adore You</h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-pink-500 to-rose-400 mx-auto mt-4" />
            </div>

            <ReasonsCards reasons={data.reasons} />
          </section>
        )}

        {/* ================= POLAROID ALBUM PHOTO GALLERY ================= */}
        {data.gallery && data.gallery.length > 0 && (
          <section className="py-16 md:py-24 px-4 relative z-10 bg-black/15">
            <div className="text-center mb-14">
              <span className="font-handwritten text-3xl text-violet-400 block mb-1">Our Nostalgic Frames</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">The Polaroid Memory Album</h2>
              <p className="text-xs text-slate-400 mt-2 font-light">Click on any snapshot to view in high definition</p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 mx-auto mt-4" />
            </div>

            <PhotoGallery gallery={data.gallery} />
          </section>
        )}

        {/* ================= MUSIC SECTION & PLAYER ================= */}
        <section className="py-16 px-4 relative z-10">
          <div className="text-center mb-8">
            <span className="font-handwritten text-3xl text-pink-400 block mb-1">Sounds of Love</span>
            <h2 className="font-serif text-3xl font-bold text-slate-100 tracking-tight">Your Personal Soundtrack</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 mx-auto mt-4" />
          </div>

          <BackgroundMusicPlayer 
            trackUrl={data.musicTrackUrl}
            trackTitle={data.musicTrackTitle}
            artistName={data.musicArtistName}
            allTracks={allTracks}
            onTrackChange={handleTrackChange}
          />
        </section>

        {/* ================= SURPRISE GIFT BOX ACTION ================= */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-t from-violet-950/20 via-transparent to-transparent relative z-10">
          <div className="text-center mb-8">
            <span className="font-handwritten text-3xl text-pink-400 block mb-1">The Grand Mystery</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">Reveal Your Birthday Gift</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-pink-500 to-violet-600 mx-auto mt-4" />
          </div>

          <GiftBoxSurprise revealMessage={data.giftBoxRevealMessage} />
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="py-16 text-center text-slate-400 relative z-10 border-t border-slate-800/40 select-none">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-ping absolute duration-1000 opacity-20" />
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse relative z-10" />
            
            <div className="font-elegant text-5xl text-pink-300 tracking-wide select-none">
              Forever Yours
            </div>
            
            <p className="text-xs font-light text-slate-500 tracking-widest uppercase mt-4">
              Designed with infinite love & affection for {data.girlfriendName}
            </p>

            <div className="flex items-center gap-4 mt-6 text-slate-500 select-none">
              {['✨', '💖', '💍', '💋', '🔒'].map((emoji, idx) => (
                <span key={idx} className="hover:scale-125 transition-transform duration-250 opacity-60 hover:opacity-100 cursor-default">
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
