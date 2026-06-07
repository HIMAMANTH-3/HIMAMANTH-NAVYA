import { Calendar, Sparkles } from 'lucide-react';
import { TimelineItem } from '../types';

interface MemoryTimelineProps {
  timeline: TimelineItem[];
}

export default function MemoryTimeline({ timeline }: MemoryTimelineProps) {
  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8">
      {/* Central Stem Line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 timeline-line transform -translate-x-1/2 z-0 opacity-80" />

      <div className="space-y-12">
        {timeline.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              key={item.id || index}
              className={`relative flex flex-col md:flex-row items-start ${
                isEven ? 'md:flex-row-reverse' : ''
              } z-10`}
            >
              {/* Timeline Junction Node */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-purple-900 border-2 border-pink-500 rounded-full transform -translate-x-1/2 top-1.5 shadow-lg group">
                <div className="absolute -inset-1.5 bg-pink-500/20 rounded-full animate-ping pointer-events-none" />
              </div>

              {/* Spacing panel for desktop */}
              <div className="hidden md:block w-1/2" />

              {/* Content Panel Box */}
              <div className="w-full md:w-[45%] pl-12 md:pl-0">
                <div className="group backdrop-blur-xl bg-white/5 hover:bg-white/10 rounded-2xl p-5 shadow-2xl transition-all duration-300 border border-white/10 hover:border-pink-500/30">
                  
                  {/* Photo preview block */}
                  {item.imageUrl && (
                    <div className="relative h-44 rounded-xl overflow-hidden mb-4 shadow bg-slate-950/60 flex items-center justify-center">
                      <img 
                        src={item.imageUrl || undefined} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      </div>
                    </div>
                  )}

                  {/* Header metadata */}
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-pink-400" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-pink-300 uppercase">
                      {item.date}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-white group-hover:text-pink-200 transition-colors tracking-tight mb-2">
                    {item.title}
                  </h4>

                  <p className="text-slate-300 text-sm leading-relaxed tracking-wide font-light">
                    {item.description}
                  </p>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
