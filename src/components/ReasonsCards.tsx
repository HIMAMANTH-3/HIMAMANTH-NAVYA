import { Heart, Sparkles, Star, Compass, Gift, Flame, Sun, Smile, Award } from 'lucide-react';
import { LoveReason } from '../types';

interface ReasonsCardsProps {
  reasons: LoveReason[];
}

// Helper to match string identifier of icon to actual Lucide react icon
const getReasonIcon = (iconName: string) => {
  const iconProps = "w-8 h-8 text-pink-400";
  switch (iconName?.toLowerCase()) {
    case 'heart': return <Heart className={iconProps} fill="rgba(244, 63, 94, 0.2)" />;
    case 'sparkles': return <Sparkles className={iconProps} />;
    case 'star': return <Star className={iconProps} fill="rgba(250, 204, 21, 0.2)" />;
    case 'compass': return <Compass className={iconProps} />;
    case 'gift': return <Gift className={iconProps} />;
    case 'flame': return <Flame className={iconProps} />;
    case 'sun': return <Sun className={iconProps} />;
    case 'smile': return <Smile className={iconProps} />;
    default: return <Award className={iconProps} />;
  }
};

export default function ReasonsCards({ reasons }: ReasonsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto px-4">
      {reasons.map((reason, index) => (
        <div 
          key={reason.id || index}
          className="card-flip w-full h-80 cursor-pointer group"
          style={{ perspective: '1000px' }}
        >
          <div className="card-flip-inner relative w-full h-full duration-700 ease-out preserve-3d">
                        {/* Front of the Card */}
            <div className="card-front absolute inset-0 w-full h-full rounded-3xl backdrop-blur-xl bg-white/5 p-6 flex flex-col justify-between items-center text-center shadow-2xl border border-white/10 hover:border-pink-500/30 transition-colors">
              <div className="absolute top-2 right-2 text-pink-300/40 text-xs font-mono select-none">
                {String(index + 1).padStart(2, '0')}
              </div>
              
              <div className="my-auto flex flex-col items-center">
                <div className="p-4 bg-pink-500/10 rounded-full mb-4 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all duration-350">
                  {getReasonIcon(reason.icon)}
                </div>
                <h4 className="font-serif text-xl font-bold text-white tracking-tight pr-2 pl-2">
                  {reason.title}
                </h4>
              </div>

              <div className="text-[10px] uppercase font-bold tracking-widest text-pink-400 flex items-center gap-1.5 animate-pulse">
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                Hover to reveal love note
              </div>
            </div>

            {/* Back of the Card */}
            <div className="card-back absolute inset-0 w-full h-full rounded-3xl p-6 bg-gradient-to-br from-purple-950/80 to-pink-950/80 backdrop-blur-xl flex flex-col justify-center items-center text-center shadow-2xl border border-white/10">
              <Heart className="w-8 h-8 text-pink-500 absolute top-4 opacity-15 fill-pink-500" />
              
              <div className="space-y-3 z-10">
                <div className="font-handwritten text-2xl text-pink-300">
                  My Heart Whispers
                </div>
                <p className="text-slate-200 text-sm md:text-base leading-relaxed tracking-wide font-light px-2">
                  "{reason.description}"
                </p>
              </div>

              <div className="absolute bottom-4 text-[10px] text-pink-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                <span>With infinite love</span>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
