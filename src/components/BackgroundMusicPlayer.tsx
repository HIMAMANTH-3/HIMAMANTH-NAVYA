import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, SkipForward, Disc } from 'lucide-react';

interface BackgroundMusicPlayerProps {
  trackUrl: string;
  trackTitle: string;
  artistName: string;
  allTracks?: { title: string; artist: string; url: string }[];
  onTrackChange?: (track: { title: string; artist: string; url: string }) => void;
}

export default function BackgroundMusicPlayer({
  trackUrl,
  trackTitle,
  artistName,
  allTracks = [],
  onTrackChange,
}: BackgroundMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Helper to check and parse Spotify track IDs
  const getSpotifyTrackId = (url: string) => {
    if (!url) return null;
    const match = url.match(/spotify(?:\.com)?(?:\/track|\:track)\/([a-zA-Z0-9]+)/);
    return match && match[1] ? match[1] : null;
  };

  const spotifyTrackId = getSpotifyTrackId(trackUrl);

  // Re-synchronize when source URL changes
  useEffect(() => {
    if (audioRef.current) {
      if (spotifyTrackId) {
        // Pause underlying standard player if user selected a Spotify track
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }
      const wasPlaying = isPlaying;
      audioRef.current.src = trackUrl;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [trackUrl, spotifyTrackId]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay blocked or stream failure, waiting for interactive user click.", err);
          setIsPlaying(false);
        });
    }
  };

  // Skip tracks forward
  const skipTrack = () => {
    if (allTracks.length <= 1 || !onTrackChange) return;
    const currentIdx = allTracks.findIndex(t => t.url === trackUrl);
    const nextIdx = (currentIdx + 1) % allTracks.length;
    onTrackChange(allTracks[nextIdx]);
  };

  // Toggle mute state
  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Time update callback
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Loaded metadata callback
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 180);
    }
  };

  // Seek bar slide handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  // Format time (e.g. 132s -> 2:12)
  const formatTime = (timeSecs: number) => {
    if (isNaN(timeSecs)) return '0:00';
    const mins = Math.floor(timeSecs / 60);
    const secs = Math.floor(timeSecs % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-5 md:p-6 max-w-md mx-auto shadow-2xl border border-white/10 hover:border-pink-500/35 transition-all z-10 relative">
      
      {/* Real audio driver element */}
      <audio 
        ref={audioRef}
        src={spotifyTrackId ? undefined : (trackUrl || undefined)}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={skipTrack}
      />

      {spotifyTrackId ? (
        // Premium Spotify Embed Player UI
        <div className="space-y-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#1db954]/10 border border-[#1db954]/20 flex items-center justify-center shadow-md shrink-0">
                <span className="text-[#1db954] text-xs font-bold font-mono">S</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-pink-300">SURPRISE SOUNDTRACK</p>
                <p className="text-xs text-slate-300 font-medium truncate">{trackTitle} • {artistName}</p>
              </div>
            </div>
            {allTracks.length > 1 && (
              <button 
                onClick={skipTrack}
                className="text-[10px] uppercase font-bold tracking-wider text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 px-2.5 py-1 rounded-full border border-pink-500/25 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Next</span>
                <SkipForward className="w-3 h-3" />
              </button>
            )}
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-black/40 border border-white/5 p-1">
            <iframe 
              src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`} 
              width="100%" 
              height="152" 
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              className="border-0 rounded-xl w-full"
            />
          </div>
          
          <p className="text-[10px] text-center text-slate-400 leading-relaxed font-light">
            Tap play inside the premium Spotify frame to listen to the custom surprise soundtrack!
          </p>
        </div>
      ) : (
        // Standard interactive styled player for local audio streams
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {/* Animated Vinyl Disc */}
            <div className="relative shrink-0 flex items-center justify-center">
              <div className={`w-16 h-16 rounded-full bg-slate-950 border-2 border-violet-500/30 flex items-center justify-center shadow-lg ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                <Disc className="w-8 h-8 text-violet-400 opacity-80" />
                <div className="absolute w-4 h-4 bg-purple-900 border border-violet-500/20 rounded-full" />
              </div>
              <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-pink-500 rounded-full animate-ping pointer-events-none opacity-40" />
            </div>

            {/* Track Title */}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-pink-400 tracking-wider uppercase mb-0.5">
                Background Music
              </div>
              <h4 className="font-serif text-base font-bold text-slate-100 truncate line-clamp-1">
                {trackTitle}
              </h4>
              <p className="text-xs text-slate-400 truncate">
                {artistName}
              </p>
            </div>

            {/* Music Wave Equalizer Visualizer */}
            <div className="flex items-end gap-1 h-5 shrink-0 select-none px-1">
              {[1, 2, 3, 4, 5, 4, 3, 2].map((heightPreset, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-pink-500 rounded-full transition-all duration-300"
                  style={{
                    height: isPlaying ? `${heightPreset * 4}px` : '4px',
                    animation: isPlaying ? `shimmery 1s ease-in-out infinite alternate` : 'none',
                    animationDelay: `${idx * 150}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress Slider bar */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-pink-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between mt-1">
            {/* Mute button */}
            <button 
              onClick={toggleMute}
              className="p-2 text-violet-400 hover:text-pink-400 hover:bg-violet-500/10 rounded-full transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Core Play / Pause button */}
            <button
              onClick={togglePlay}
              className="p-4 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 transition-all outline-none border border-pink-400/20 cursor-pointer flex items-center justify-center shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white translate-x-0.5" />
              )}
            </button>

            {/* Skip Track */}
            <button
              disabled={allTracks.length <= 1}
              onClick={skipTrack}
              className={`p-2 text-violet-400 hover:text-pink-400 hover:bg-violet-500/10 rounded-full transition-colors cursor-pointer ${allTracks.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
              title="Next Track"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Embedded stylings for visualizer animations */}
      <style>{`
        @keyframes shimmery {
          0% { transform: scaleY(0.4); opacity: 0.6; }
          100% { transform: scaleY(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
