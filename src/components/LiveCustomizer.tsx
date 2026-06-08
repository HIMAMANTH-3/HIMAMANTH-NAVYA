import { useState } from 'react';
import { 
  Heart, Sparkles, Image, Calendar, Music, Gift, 
  Sparkle, Edit, Plus, Trash2, Key, Check, Copy, Share2, Wand2, Loader2, ListPlus
} from 'lucide-react';
import { BirthdayWebsiteData, GalleryItem, LoveReason, TimelineItem } from '../types';

// Client-side image compression utility to keep memory compact and URL stable
function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string); // fallback
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

interface LiveCustomizerProps {
  data: BirthdayWebsiteData;
  onChange: (newData: BirthdayWebsiteData) => void;
  onPreviewToggle: () => void;
  isPreviewMode: boolean;
  onResetToDefault?: () => void;
}

export default function LiveCustomizer({ 
  data, 
  onChange, 
  onPreviewToggle, 
  isPreviewMode,
  onResetToDefault
}: LiveCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'ai-writer' | 'gallery' | 'timeline' | 'reasons' | 'surprise'>('profile');
  const [imageLoadingMap, setImageLoadingMap] = useState<Record<string, boolean>>({});
  
  // AI Helper states
  const [aiType, setAiType] = useState<'letter' | 'reasons' | 'poem' | 'timeline'>('letter');
  const [aiTraits, setAiTraits] = useState('');
  const [aiTone, setAiTone] = useState('heartfelt and poetic');
  const [aiInstructions, setAiInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Sharing states
  const [copied, setCopied] = useState(false);

  // Update specific top level keys
  const updateKey = <K extends keyof BirthdayWebsiteData>(key: K, value: BirthdayWebsiteData[K]) => {
    onChange({
      ...data,
      [key]: value
    });
  };

  // Generate shareable URL with Base64 encoding
  const handleGenerateShareLink = () => {
    try {
      // Safely encode Unicode text / emojis
      const jsonStr = JSON.stringify(data);
      const utf8Bytes = new TextEncoder().encode(jsonStr);
      // Convert to base64 string
      let binString = "";
      utf8Bytes.forEach((b) => { binString += String.fromCharCode(b); });
      const b64Data = btoa(binString);
      
      const shareUrl = `${window.location.origin}${window.location.pathname}#gift=${b64Data}`;
      
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error("Failed to generate share link:", e);
      alert("Error generating shareable link.");
    }
  };

  // Handlers for dynamic lists
  const handleAddGalleryItem = () => {
    const newItem: GalleryItem = {
      id: crypto.randomUUID(),
      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
      caption: 'A beautiful moment together'
    };
    updateKey('gallery', [...data.gallery, newItem]);
  };

  const handleUpdateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
    const newList = data.gallery.map(item => item.id === id ? { ...item, ...updates } : item);
    updateKey('gallery', newList);
  };

  const handleRemoveGalleryItem = (id: string) => {
    updateKey('gallery', data.gallery.filter(item => item.id !== id));
  };

  const handleAddTimelineItem = () => {
    const newItem: TimelineItem = {
      id: crypto.randomUUID(),
      title: 'Our New Milestone',
      date: 'Today',
      description: 'A beautiful new memory written in our story together.',
      imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop'
    };
    updateKey('timeline', [...data.timeline, newItem]);
  };

  const handleUpdateTimelineItem = (id: string, updates: Partial<TimelineItem>) => {
    const newList = data.timeline.map(item => item.id === id ? { ...item, ...updates } : item);
    updateKey('timeline', newList);
  };

  const handleRemoveTimelineItem = (id: string) => {
    updateKey('timeline', data.timeline.filter(item => item.id !== id));
  };

  const handleAddReason = () => {
    const newItem: LoveReason = {
      id: crypto.randomUUID(),
      title: 'Your Kind Soul',
      description: 'The gentle warmth with which you embrace every single creature around you.',
      icon: 'Heart'
    };
    updateKey('reasons', [...data.reasons, newItem]);
  };

  const handleUpdateReason = (id: string, updates: Partial<LoveReason>) => {
    const newList = data.reasons.map(item => item.id === id ? { ...item, ...updates } : item);
    updateKey('reasons', newList);
  };

  const handleRemoveReason = (id: string) => {
    updateKey('reasons', data.reasons.filter(item => item.id !== id));
  };

  // AI Content Generator helper
  const handleCallAIGenerator = async () => {
    setIsGenerating(true);
    setAiError(null);
    try {
      const response = await fetch('/api/generate-romantic-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: aiType,
          girlfriendName: data.girlfriendName,
          traits: aiTraits,
          tone: aiTone,
          customInstructions: aiInstructions
        })
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || 'Server returned an error.');
      }

      const generatedText = body.result;

      if (aiType === 'letter' || aiType === 'poem') {
        updateKey('loveLetterText', generatedText);
        setActiveTab('profile'); // Switch back to see result
      } else if (aiType === 'reasons') {
        try {
          const parsed = JSON.parse(generatedText);
          if (Array.isArray(parsed)) {
            const icons = ['Heart', 'Sparkles', 'Star', 'Compass', 'Gift', 'Flame'];
            const mapped: LoveReason[] = parsed.slice(0, 3).map((item, idx) => ({
              id: crypto.randomUUID(),
              title: item.title || 'Love Reason',
              description: item.description || 'Reason text',
              icon: icons[idx % icons.length]
            }));
            updateKey('reasons', mapped);
            setActiveTab('reasons');
          }
        } catch (jsonErr) {
          // If JSON parse fails, dump text to Letter as fallback
          updateKey('loveLetterText', generatedText);
          setActiveTab('profile');
        }
      } else if (aiType === 'timeline') {
        try {
          const parsed = JSON.parse(generatedText);
          if (Array.isArray(parsed)) {
            const images = [
              'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop'
            ];
            const mapped: TimelineItem[] = parsed.slice(0, 3).map((item, idx) => ({
              id: crypto.randomUUID(),
              title: item.title || 'Sweet memory',
              date: item.date || 'Once upon a time',
              description: item.description || 'Description text',
              imageUrl: images[idx % images.length]
            }));
            updateKey('timeline', mapped);
            setActiveTab('timeline');
          }
        } catch (jsonErr) {
          updateKey('loveLetterText', generatedText);
          setActiveTab('profile');
        }
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Failed to communicate with AI writer backend.');
    } finally {
      setIsGenerating(false);
    }
  };

  const musicPresets = [
    { title: 'Pet (Spotify Edition)', artist: 'A Perfect Circle', url: 'https://open.spotify.com/track/6O1VWYPfl85dDeKiaCJKza?si=BU57ZXU6Rpm6u5EBBsOWjQ' },
    { title: 'Romantic Soft Piano', artist: 'Classic Instrumental', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'Fairytale Acoustic Symphony', artist: 'Whimsical Orchestra', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { title: 'Gentle Moonlight Vibes', artist: 'Lounge Acoustic Guitar', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { title: 'Cozy Rain Cafe', artist: 'Ambient Jazz Duo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  ];

  return (
    <div className="w-full lg:w-[420px] bg-[#110e20] border-r border-slate-800/80 shrink-0 h-full flex flex-col z-40 select-none">
      
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-800/80 bg-black/30 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" />
          <h1 className="font-serif text-lg font-bold text-pink-100 tracking-tight">Surprise Designer</h1>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onResetToDefault && (
            <button
              onClick={() => {
                if (window.confirm("Do you want to reset all customized values back to defaults? This will restore the default Polaroid photos and template text.")) {
                  onResetToDefault();
                }
              }}
              title="Reset configuration to template defaults"
              className="text-xs px-2.5 py-1.5 rounded-lg font-semibold border border-slate-700 hover:border-pink-500/40 text-slate-400 hover:text-pink-300 hover:bg-pink-500/5 cursor-pointer active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              Reset
            </button>
          )}

          {/* Toggle full screen visualizer preview */}
          <button
            onClick={onPreviewToggle}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold border border-pink-500/30 text-pink-300 hover:bg-pink-500/10 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isPreviewMode ? 'Exit Preview' : 'Live Preview'}
          </button>
        </div>
      </div>

      {/* Tabs navigation list */}
      <div className="flex overflow-x-auto bg-black/15 scrollbar-none border-b border-slate-800/50 p-2 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'profile' ? 'bg-pink-500/25 text-pink-200 border border-pink-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          💑 Basics
        </button>
        <button
          onClick={() => setActiveTab('ai-writer')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${activeTab === 'ai-writer' ? 'bg-violet-500/25 text-violet-200 border border-violet-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Wand2 className="w-3 h-3 text-violet-400" /> AI Writer
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'gallery' ? 'bg-pink-500/25 text-pink-200 border border-pink-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          📸 Polaroid Album
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'timeline' ? 'bg-pink-500/25 text-pink-200 border border-pink-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          ⏳ Timeline
        </button>
        <button
          onClick={() => setActiveTab('reasons')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'reasons' ? 'bg-pink-500/25 text-pink-200 border border-pink-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          💖 Reasons
        </button>
        <button
          onClick={() => setActiveTab('surprise')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'surprise' ? 'bg-pink-500/25 text-pink-200 border border-pink-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          🎁 Gift
        </button>
      </div>

      {/* Tabs active panels container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* TAB 1: PROFILE DETAILS */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400">Personalize Her Experience</h3>
            
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">Girlfriend's First Name</label>
              <input
                type="text"
                value={data.girlfriendName}
                onChange={(e) => updateKey('girlfriendName', e.target.value)}
                placeholder="Her sweet name"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block flex items-center justify-between">
                <span>Her Birthday Date</span>
                <span className="text-[10px] text-violet-400 font-normal">For Countdown timer</span>
              </label>
              <input
                type="date"
                value={data.birthdate}
                onChange={(e) => updateKey('birthdate', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">Your Names Together</label>
              <input
                type="text"
                value={data.coupleName}
                onChange={(e) => updateKey('coupleName', e.target.value)}
                placeholder="NAVYA & Friends"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">Banner Main Title Text</label>
              <input
                type="text"
                value={data.mainGreetingTitle}
                onChange={(e) => updateKey('mainGreetingTitle', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">Banner Sub-title Text</label>
              <textarea
                value={data.mainGreetingSub}
                rows={2}
                onChange={(e) => updateKey('mainGreetingSub', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block flex justify-between">
                <span>Heartfelt Love Letter</span>
                <span className="text-[10px] text-violet-400 font-normal">Displays on paper scroll</span>
              </label>
              <textarea
                value={data.loveLetterText}
                rows={6}
                onChange={(e) => updateKey('loveLetterText', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500 resize-y"
              />
            </div>
          </div>
        )}

        {/* TAB 2: AI ROMANTIC CONTENT GENERATOR */}
        {activeTab === 'ai-writer' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/20 text-slate-300 text-xs leading-relaxed space-y-1">
              <span className="font-bold text-violet-300 block flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5" /> Speak from the Heart With AI
              </span>
              <p>Type in whatever details you want (her quirks, cute memories, how she makes you feel) and let Gemini draft pristine content for your surprise sections!</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">What Content to Draft?</label>
              <div className="grid grid-cols-2 gap-1">
                {(['letter', 'reasons', 'poem', 'timeline'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setAiType(type)}
                    className={`px-3 py-2 text-xs font-semibold capitalize rounded-lg border text-center transition-all cursor-pointer ${aiType === type ? 'bg-violet-600/35 border-violet-400 text-violet-200' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}
                  >
                    {type === 'letter' ? '💖 Love Letter' : type === 'reasons' ? '📃 Love Reasons' : type === 'poem' ? '🌸 Cute Poem' : '📅 Memories'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block flex items-center justify-between">
                <span>Girlfriend's Traits & Details</span>
                <span className="text-[10px] text-slate-500 font-normal">Separate with commas</span>
              </label>
              <textarea
                value={aiTraits}
                onChange={(e) => setAiTraits(e.target.value)}
                placeholder="e.g. loves hot chocolate, has a dimpled cute smile, makes me calm when I am stressed, loves books..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">Aesthetic Art Tone</label>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              >
                <option value="deeply emotional and poetic">Poetic & Deeply Emotional</option>
                <option value="playful, cute and funny">Playful & Sweetly Cute</option>
                <option value="whimsical fairytale style">Whimsical Fairytale</option>
                <option value="classic, simple and sincere">Sincere & Sincere Classic</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">Bonus Instructions (Optional)</label>
              <input
                type="text"
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                placeholder="e.g. include a line about our cute cat, or mention our rain trip"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            {aiError && (
              <div className="text-xs bg-rose-950/60 border border-rose-500/25 rounded-lg p-3 text-rose-300 font-light">
                {aiError}
              </div>
            )}

            <button
              disabled={isGenerating}
              onClick={handleCallAIGenerator}
              className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-sm font-semibold active:scale-95 duration-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Writing magical lines...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate Surprise Content ✨
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 3: PHOTO GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400">Nostalgic Polaroid Album</h3>
              <button
                onClick={handleAddGalleryItem}
                className="text-xs text-pink-300 font-semibold flex items-center gap-1 hover:text-white cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Polaroid
              </button>
            </div>

            <div className="space-y-4">
              {data.gallery.map((item, idx) => (
                <div key={item.id} className="p-3.5 bg-black/35 rounded-xl border border-slate-800 space-y-2 relative">
                  <button 
                    onClick={() => handleRemoveGalleryItem(item.id)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Polaroid Photo #{idx + 1}
                  </div>

                  {/* Real-time image preview thumbnail so it's instantly visible */}
                  {item.url && (
                    <div className="mt-2 text-[10px] font-sans text-slate-400">
                      <span className="block mb-1 text-slate-550 font-medium">Live Preview:</span>
                      <div className="h-28 w-full rounded-xl overflow-hidden border border-slate-850 bg-slate-900/50 flex items-center justify-center relative">
                        {imageLoadingMap[item.id] ? (
                          <div className="flex flex-col items-center gap-1">
                            <Loader2 className="w-5 h-5 text-pink-500 animate-spin" />
                            <span className="text-[9px] font-mono text-pink-300">Compressing photo...</span>
                          </div>
                        ) : (
                          <img
                            src={item.url}
                            alt={`Preview #${idx + 1}`}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // If custom URL is broken or blocked, we show a beautiful placeholder
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop";
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 font-medium font-sans">Direct Image URL</label>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => {
                        const trimmedUrl = e.target.value.trim();
                        handleUpdateGalleryItem(item.id, { url: trimmedUrl });
                      }}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Local image uploader helper */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-pink-350 font-semibold font-sans block">Or Upload Local Image</label>
                    <div className="relative border border-dashed border-slate-700 hover:border-pink-500/50 rounded-lg p-2.5 bg-black/40 text-center transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setImageLoadingMap(prev => ({ ...prev, [item.id]: true }));
                              const compressedBase64 = await compressImage(file);
                              handleUpdateGalleryItem(item.id, { url: compressedBase64 });
                            } catch (err) {
                              console.error("Local photo processing failed:", err);
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  handleUpdateGalleryItem(item.id, { url: reader.result });
                                }
                              };
                              reader.readAsDataURL(file);
                            } finally {
                              setImageLoadingMap(prev => ({ ...prev, [item.id]: false }));
                            }
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <p className="text-[10px] text-slate-400 font-sans">
                        {item.url.startsWith('data:image') ? '✨ Custom Photo Loaded' : '📁 Drag & Drop or Click to Upload'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Cursive Bottom Caption</label>
                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) => handleUpdateGalleryItem(item.id, { caption: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1 text-xs text-slate-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MEMORY TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400">Relationship Milestones</h3>
              <button
                onClick={handleAddTimelineItem}
                className="text-xs text-pink-300 font-semibold flex items-center gap-1 hover:text-white cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </div>

            <div className="space-y-4">
              {data.timeline.map((item, idx) => (
                <div key={item.id} className="p-3.5 bg-black/35 rounded-xl border border-slate-800 space-y-2 relative">
                  <button 
                    onClick={() => handleRemoveTimelineItem(item.id)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Milestone Event #{idx + 1}
                  </div>

                  {/* Real-time image preview thumbnail so it's instantly visible */}
                  {item.imageUrl && (
                    <div className="mt-2 text-[10px] font-sans text-slate-400">
                      <span className="block mb-1 text-slate-550 font-medium font-sans">Live Preview:</span>
                      <div className="h-28 w-full rounded-xl overflow-hidden border border-slate-850 bg-slate-900/50 flex items-center justify-center relative">
                        {imageLoadingMap[item.id] ? (
                          <div className="flex flex-col items-center gap-1">
                            <Loader2 className="w-5 h-5 text-pink-500 animate-spin" />
                            <span className="text-[9px] font-mono text-pink-300 animate-pulse">Compressing photo...</span>
                          </div>
                        ) : (
                          <img
                            src={item.imageUrl}
                            alt={`Preview Event #${idx + 1}`}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // Elegant fallback for broken custom URL images
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop";
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Event Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateTimelineItem(item.id, { title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1 text-xs text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">Timeframe / Date</label>
                      <input
                        type="text"
                        value={item.date}
                        placeholder="e.g. Sept 2024"
                        onChange={(e) => handleUpdateTimelineItem(item.id, { date: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1 text-xs text-slate-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">Illustration/Photo URL</label>
                      <input
                        type="text"
                        value={item.imageUrl}
                        onChange={(e) => {
                          const trimmedUrl = e.target.value.trim();
                          handleUpdateTimelineItem(item.id, { imageUrl: trimmedUrl });
                        }}
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-pink-350 font-semibold">Or Upload Photo</label>
                      <div className="relative border border-dashed border-slate-700 hover:border-pink-500/50 rounded-lg p-1 text-center transition-colors bg-black/40 h-[28px] flex items-center justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                setImageLoadingMap(prev => ({ ...prev, [item.id]: true }));
                                const compressedBase64 = await compressImage(file);
                                handleUpdateTimelineItem(item.id, { imageUrl: compressedBase64 });
                              } catch (err) {
                                console.error("Local timeline photo processing failed:", err);
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === 'string') {
                                    handleUpdateTimelineItem(item.id, { imageUrl: reader.result });
                                  }
                                };
                                reader.readAsDataURL(file);
                              } finally {
                                setImageLoadingMap(prev => ({ ...prev, [item.id]: false }));
                              }
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <span className="text-[9px] text-slate-400 truncate">
                          {item.imageUrl.startsWith('data:image') ? '✨ Loaded' : '📁 Choose File'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Description of Memory</label>
                    <textarea
                      value={item.description}
                      rows={2}
                      onChange={(e) => handleUpdateTimelineItem(item.id, { description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1 text-xs text-slate-100 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REASONS ADORED */}
        {activeTab === 'reasons' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400">Reasons Why I Love You</h3>
              <button
                onClick={handleAddReason}
                className="text-xs text-pink-300 font-semibold flex items-center gap-1 hover:text-white cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Reason
              </button>
            </div>

            <div className="space-y-4">
              {data.reasons.map((item, idx) => (
                <div key={item.id} className="p-3.5 bg-black/35 rounded-xl border border-slate-800 space-y-2 relative">
                  <button 
                    onClick={() => handleRemoveReason(item.id)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Reason Flip Card #{idx + 1}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">Card Front Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateReason(item.id, { title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1 text-xs text-slate-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">Lucide Icon Badge</label>
                      <select
                        value={item.icon}
                        onChange={(e) => handleUpdateReason(item.id, { icon: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1 text-xs text-slate-100"
                      >
                        <option value="Heart">💖 Heart</option>
                        <option value="Sparkles">✨ Sparkles</option>
                        <option value="Star">⭐️ Star</option>
                        <option value="Compass">🧭 Compass</option>
                        <option value="Smile">😊 Smile</option>
                        <option value="Sun">☀️ Sun</option>
                        <option value="Gift">🎁 Gift</option>
                        <option value="Flame">🔥 Passion Flame</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Card Back Message</label>
                    <textarea
                      value={item.description}
                      rows={2}
                      onChange={(e) => handleUpdateReason(item.id, { description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1 text-xs text-slate-100 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: GIFT REVEAL SURPRISE & MUSIC SELECT */}
        {activeTab === 'surprise' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400 font-sans">Surprise Box Content</h3>
            
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">Gift Reveal Secret message</label>
              <textarea
                value={data.giftBoxRevealMessage}
                rows={4}
                onChange={(e) => updateKey('giftBoxRevealMessage', e.target.value)}
                placeholder="Check your emails or look under the table for a real flight ticket! Or will you go out on dinner with me in evening?"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500 resize-y"
              />
            </div>

            <div className="h-px bg-slate-800/80 my-4" />

            <h3 className="text-xs font-bold uppercase tracking-widest text-pink-400 font-sans">Surprise Soundtrack</h3>

            <div className="space-y-4">
              <div className="space-y-1.5 p-3.5 rounded-xl bg-black/40 border border-slate-800/60">
                <label className="text-xs font-semibold text-slate-300 block">Or Paste Any Custom Spotify / MP3 Link</label>
                <input
                  type="text"
                  value={data.musicTrackUrl}
                  onChange={(e) => {
                    const url = e.target.value.trim();
                    let title = 'Custom Track';
                    let artist = 'Surprise Sound';
                    if (url.includes('spotify.com/track/') || url.includes('spotify:track:')) {
                      title = 'Pet';
                      artist = 'A Perfect Circle';
                    }
                    onChange({
                      ...data,
                      musicTrackUrl: url,
                      musicTrackTitle: title,
                      musicArtistName: artist
                    });
                  }}
                  placeholder="https://open.spotify.com/track/..."
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-pink-200 font-mono focus:outline-none focus:border-pink-500"
                />
                <span className="text-[10px] text-slate-500 block leading-tight font-light">
                  Paste the Spotify Track URL and it will automatically lock the authentic interactive player inside Navya's surprise webpage!
                </span>
              </div>

              <div className="space-y-3">
              {musicPresets.map((preset) => (
                <div 
                  key={preset.url}
                  onClick={() => {
                    onChange({
                      ...data,
                      musicTrackUrl: preset.url,
                      musicTrackTitle: preset.title,
                      musicArtistName: preset.artist
                    });
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${data.musicTrackUrl === preset.url ? 'bg-violet-500/10 border-violet-500' : 'bg-black/20 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="text-xs font-semibold text-slate-200 truncate">{preset.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{preset.artist}</div>
                  </div>
                  {data.musicTrackUrl === preset.url ? (
                    <div className="p-1 bg-pink-500 rounded-full">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : (
                    <Music className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      </div>

      {/* Sidebar Footer with Generation / Sharing */}
      <div className="p-5 border-t border-slate-800/80 bg-black/40 space-y-3">
        <button
          onClick={handleGenerateShareLink}
          className="w-full py-2.5 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-600 hover:opacity-90 active:scale-95 duration-200 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-transform cursor-pointer overflow-hidden font-sans border border-white/5"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-300" />
              Copied Direct Link! ❤️
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Get Shareable Surprise Link
            </>
          )}
        </button>
        <p className="text-[9px] text-slate-400 text-center leading-relaxed font-light font-mono select-none px-2">
          Sends all custom cards, photos, memories, and music in a single URL to her!
        </p>
      </div>

    </div>
  );
}
