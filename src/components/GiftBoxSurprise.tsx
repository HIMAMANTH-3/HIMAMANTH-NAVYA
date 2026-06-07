import React, { useState, useEffect } from 'react';
import { Gift, Heart, Sparkles, Star, PartyPopper } from 'lucide-react';

interface GiftBoxSurpriseProps {
  revealMessage: string;
}

interface MiniHeart {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
}

export default function GiftBoxSurprise({ revealMessage }: GiftBoxSurpriseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [jiggle, setJiggle] = useState(false);
  const [sparks, setSparks] = useState<MiniHeart[]>([]);

  // Periodic jiggle teaser to encourage checking the gift box
  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      setJiggle(true);
      setTimeout(() => setJiggle(false), 800);
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleOpenBox = () => {
    if (isOpen) return;

    // Trigger open state
    setIsOpen(true);

    // Spawn dozens of sparkling mini hearts exploding from the box
    const list: MiniHeart[] = [];
    for (let i = 0; i < 28; i++) {
      list.push({
        id: i,
        left: Math.random() * 200 - 100, // explode left/right center
        top: Math.random() * -180 - 40,   // explode upwards
        size: Math.random() * 16 + 10,
        delay: Math.random() * 0.4,
      });
    }
    setSparks(list);
  };

  const handleCloseBox = () => {
    setIsOpen(false);
    setSparks([]);
  };

  return (
    <div id="surprise-block" className="max-w-2xl mx-auto px-4 text-center py-6">
      
      {!isOpen ? (
        <div className="flex flex-col items-center select-none">
          {/* Gift Box Pulsating Container */}
          <div 
            onClick={handleOpenBox}
            className={`relative cursor-pointer transition-transform duration-300 transform active:scale-95 group 
              ${jiggle ? 'animate-[jiggle_0.8s_ease-in-out_infinite]' : 'hover:scale-105'}`}
          >
            {/* Glowing Halo */}
            <div className="absolute inset-0 bg-pink-500/20 filter blur-3xl rounded-full scale-110 group-hover:scale-125 duration-500 animate-pulse pointer-events-none" />

            {/* Custom vector pink/gold gift box */}
            <svg 
              className="w-48 h-48 drop-shadow-2xl text-pink-500" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              {/* Ribbon bow */}
              <path 
                d="M12 9c-1.5-2.5-4-3-4.5-1.5s1.5 3.5 4.5 4.5c3-1 5-3 4.5-4.5s-3-1-4.5 1.5z" 
                fill="url(#goldGradient)" 
                stroke="#f472b6" 
                strokeWidth="1"
              />
              {/* Lid */}
              <rect x="3" y="9" width="18" height="3" rx="1.5" fill="#f43f5e" stroke="#db2777" />
              {/* Box core body */}
              <rect x="4.5" y="12" width="15" height="9" rx="1" fill="#ec4899" stroke="#db2777" />
              {/* Vertical center ribbon strap */}
              <rect x="11" y="9" width="2" height="12" fill="#fbbf24" stroke="#d97706" />
              {/* Horizontal center ribbon strap */}
              <rect x="4.5" y="15" width="15" height="1.8" fill="#fbbf24" stroke="#d97706" />

              {/* Gradients */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Hint icons */}
            <div className="absolute -top-4 -right-2 text-pink-400 animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-2 -left-2 text-violet-400 animate-pulse">
              <Star className="w-5 h-5 fill-violet-400/20" />
            </div>
          </div>

          <h3 className="font-serif text-2xl font-bold text-pink-100 tracking-tight mt-6 mb-2">
            A Sweet Gift Left for You 🎁
          </h3>
          <p className="text-sm font-light text-slate-300 max-w-sm mx-auto leading-relaxed">
            Click this magical box to unwrap your special birthday surprise message.
          </p>
        </div>
      ) : (
        <div className="relative animate-in fade-in zoom-in-95 duration-500">
          
          {/* Confetti Explosion Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {sparks.map((spark) => (
              <svg
                key={spark.id}
                className="absolute animate-float-spark fill-pink-500/80 text-pink-500"
                style={{
                  left: '50%',
                  top: '40%',
                  width: `${spark.size}px`,
                  height: `${spark.size}px`,
                  transform: `translate(${spark.left}px, ${spark.top}px)`,
                  '--spark-delay': `${spark.delay}s`,
                } as React.CSSProperties}
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ))}
          </div>

          {/* Opened Letter Scroll */}
          <div className="backdrop-blur-xl bg-white/5 max-w-lg mx-auto rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10 relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <PartyPopper className="w-6 h-6 text-pink-400" />
              <h4 className="font-handwritten text-3xl text-pink-300 font-semibold">Your Surprise Revealed</h4>
              <PartyPopper className="w-6 h-6 text-pink-400" />
            </div>

            <div className="h-0.5 bg-gradient-to-r from-transparent via-pink-500/40 to-transparent my-4" />

            <p className="font-serif text-slate-100 text-lg md:text-xl italic leading-relaxed tracking-wide px-2 py-4">
              "{revealMessage}"
            </p>

            <div className="h-0.5 bg-gradient-to-r from-transparent via-pink-500/40 to-transparent my-4" />

            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs font-semibold text-pink-400 uppercase tracking-widest animate-pulse">
              <Heart className="w-4 h-4 fill-pink-500" />
              <span>With all my heart</span>
              <Heart className="w-4 h-4 fill-pink-500" />
            </div>

            <button
              onClick={handleCloseBox}
              className="text-xs text-slate-400 hover:text-slate-200 mt-6 block mx-auto underline transition-colors cursor-pointer"
            >
              Wrap it back up
            </button>
          </div>
        </div>
      )}

      {/* Styled timings for confetti/particle float out */}
      <style>{`
        @keyframes jiggle {
          0%, 100% { transform: scale(1) rotate(0); }
          15% { transform: scale(1.1) rotate(-5deg) translateY(-2px); }
          30% { transform: scale(1.1) rotate(5deg) translateY(-2px); }
          45% { transform: scale(1.1) rotate(-3deg) translateY(-2px); }
          60% { transform: scale(1.1) rotate(3deg) translateY(-2px); }
          75% { transform: scale(1.05) rotate(-1deg); }
        }

        .animate-float-spark {
          animation: sparkGlow 1.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
          animation-delay: var(--spark-delay, 0s);
        }

        @keyframes sparkGlow {
          0% { transform: translate(0, 0) scale(0.1); opacity: 1; }
          40% { opacity: 0.9; }
          100% { 
            transform: translate(calc(var(--spark-x, 0) + 1.2 * var(--spark-left, 0px)), calc(var(--spark-y, 0) + var(--spark-top, -80px))) scale(var(--spark-scale, 1.1)) rotate(180deg);
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
}
