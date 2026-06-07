import React, { useState } from 'react';
import { Camera, ZoomIn, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { GalleryItem } from '../types';

interface PhotoGalleryProps {
  gallery: GalleryItem[];
}

export default function PhotoGallery({ gallery }: PhotoGalleryProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActivePhotoIdx(index);
  };

  const closeLightbox = () => {
    setActivePhotoIdx(null);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((prev) => (prev !== null && prev < gallery.length - 1) ? prev + 1 : 0);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((prev) => (prev !== null && prev > 0) ? prev - 1 : gallery.length - 1);
  };

  // Rotation presets for polaroids to give standard whimsical layout look
  const rotations = [
    'rotate-1 hover:rotate-0',
    '-rotate-1 hover:rotate-0',
    'rotate-2 hover:rotate-0',
    '-rotate-2 hover:rotate-0',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center">
        {gallery.map((item, index) => {
          const rotation = rotations[index % rotations.length];
          return (
            <div
              key={item.id || index}
              onClick={() => openLightbox(index)}
              className={`backdrop-blur-xl bg-white/5 text-white p-4 pb-6 rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer flex flex-col justify-between max-w-sm w-full ${rotation} border border-white/10 hover:border-pink-500/35 z-10`}
            >
              <div className="relative aspect-square overflow-hidden bg-slate-900/40 rounded-2xl mb-4">
                <img
                  src={item.url || undefined}
                  alt={item.caption || "Special memory"}
                  className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-pink-500/5 hover:bg-transparent transition-colors pointer-events-none" />
                <div className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Polaroid bottom caption */}
              <div className="text-center font-handwritten text-xl text-pink-200 tracking-wide select-none pr-1 pl-1 line-clamp-1 truncate">
                {item.caption || "Forever & Always"}
              </div>
            </div>
          );
        })}
      </div>

      {gallery.length === 0 && (
        <div className="text-center text-slate-400 py-12">
          <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="font-light">No photographs added to the album yet.</p>
        </div>
      )}

      {/* Lightbox / Overlay Modal */}
      {activePhotoIdx !== null && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] flex flex-col justify-center items-center p-4 select-none"
        >
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 pointer-events-auto cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Picture frame */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center bg-[#120a22] p-3 md:p-4 rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
          >
            <img
              src={gallery[activePhotoIdx].url || undefined}
              alt={gallery[activePhotoIdx].caption}
              className="max-h-[68vh] md:max-h-[72vh] max-w-full object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
            
            {/* Caption container */}
            <div className="w-full text-center mt-3 flex items-center justify-center gap-1.5 selection:bg-pink-900">
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse shrink-0" />
              <span className="font-handwritten text-2xl text-pink-100 tracking-wider">
                {gallery[activePhotoIdx].caption || "A Memory Sealed in Love"}
              </span>
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse shrink-0" />
            </div>
          </div>

          {/* Navigation Controls */}
          {gallery.length > 1 && (
            <>
              <button 
                onClick={prevPhoto}
                className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors pointer-events-auto cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextPhoto}
                className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors pointer-events-auto cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Photo indicator */}
          <div className="absolute bottom-4 text-xs font-mono text-slate-400">
            {activePhotoIdx + 1} / {gallery.length}
          </div>
        </div>
      )}
    </div>
  );
}
