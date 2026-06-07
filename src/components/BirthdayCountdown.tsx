import { useState, useEffect } from 'react';
import { Calendar, Timer } from 'lucide-react';

interface BirthdayCountdownProps {
  birthdate: string; // ISO date string e.g. YYYY-MM-DD
  girlfriendName: string;
}

export default function BirthdayCountdown({ birthdate, girlfriendName }: BirthdayCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isBirthdayToday: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isBirthdayToday: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const bday = new Date(birthdate);
      
      // Calculate birthday for the CURRENT year, or next year if it has already passed this year
      let targetYear = now.getFullYear();
      const targetBday = new Date(targetYear, bday.getMonth(), bday.getDate());
      
      // Check if it is EXACTLY today (matching month and day)
      const isBirthdayToday = now.getMonth() === bday.getMonth() && now.getDate() === bday.getDate();

      if (now.getTime() > targetBday.getTime() && !isBirthdayToday) {
        // If the birthday passed this year, point to next year
        targetBday.setFullYear(targetYear + 1);
      }

      const difference = targetBday.getTime() - now.getTime();
      
      if (isBirthdayToday) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isBirthdayToday: true });
        return;
      }

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isBirthdayToday: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isBirthdayToday: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [birthdate]);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days, color: 'from-pink-500 to-rose-400' },
    { label: 'Hours', value: timeLeft.hours, color: 'from-purple-500 to-indigo-400' },
    { label: 'Minutes', value: timeLeft.minutes, color: 'from-fuchsia-500 to-pink-400' },
    { label: 'Seconds', value: timeLeft.seconds, color: 'from-rose-500 to-orange-400' },
  ];

  return (
    <div id="countdown-block" className="backdrop-blur-md bg-pink-500/10 border border-pink-500/20 rounded-3xl md:rounded-full p-6 py-8 px-8 md:px-16 max-w-2xl mx-auto shadow-2xl relative overflow-hidden transition-all duration-300 hover:divide-pink-500/10">
      {/* Decorative backdrop sparks from Immersive UI */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/15 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-violet-500/15 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-center gap-2 mb-6">
        <Timer className="w-4 h-4 text-pink-400 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-pink-300 font-sans">
          Surprise Countdown
        </span>
      </div>

      {timeLeft.isBirthdayToday ? (
        <div className="text-center py-4 animate-pulse">
          <h4 className="font-serif text-3xl md:text-5xl italic font-bold bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent mb-4 tracking-tight text-glow-pink">
            🎉 HAPPY BIRTHDAY, MY ANGEL! 🎂
          </h4>
          <p className="text-pink-100/90 text-sm md:text-lg font-light">
            Today, the universe celebrates you. You light up my entire existence! ❤️
          </p>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center max-w-md mx-auto mb-6 text-center">
            <div>
              <p className="text-3xl md:text-5xl font-extralight text-white font-sans">{String(timeLeft.days).padStart(2, '0')}</p>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-pink-300 font-semibold mt-1">Days</p>
            </div>
            <div className="text-pink-500/40 text-xl md:text-3xl font-extralight pb-4">:</div>
            
            <div>
              <p className="text-3xl md:text-5xl font-extralight text-white font-sans">{String(timeLeft.hours).padStart(2, '0')}</p>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-pink-300 font-semibold mt-1">Hours</p>
            </div>
            <div className="text-pink-500/40 text-xl md:text-3xl font-extralight pb-4">:</div>
            
            <div>
              <p className="text-3xl md:text-5xl font-extralight text-white font-sans">{String(timeLeft.minutes).padStart(2, '0')}</p>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-pink-300 font-semibold mt-1">Mins</p>
            </div>
            <div className="text-pink-500/40 text-xl md:text-3xl font-extralight pb-4">:</div>
            
            <div>
              <p className="text-3xl md:text-5xl font-extralight text-white font-sans">{String(timeLeft.seconds).padStart(2, '0')}</p>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-pink-300 font-semibold mt-1">Secs</p>
            </div>
          </div>

          <p className="text-center text-slate-300/80 text-xs md:text-sm flex items-center justify-center gap-2 font-light">
            <Calendar className="w-3.5 h-3.5 text-pink-400" />
            Until we celebrate your special day, <span className="text-pink-300 font-medium">{girlfriendName}</span>! ✨
          </p>
        </div>
      )}
    </div>
  );
}
