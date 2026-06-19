import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Settings, Maximize, Volume2, Users, Radio, Youtube, ExternalLink } from 'lucide-react';

export function LiveStream() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // YouTube Live Link & Video Embed Configurations
  const youtubeLiveUrl = 'https://www.youtube.com/live';
  const youtubeVideoEmbedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0';

  return (
    <section className="bg-dark py-24 px-6 md:px-12 border-t border-white/5 relative overflow-hidden" id="live">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-angola-red to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-sa-green to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="font-sans font-bold text-[10px] tracking-[5px] uppercase text-angola-red flex items-center justify-center gap-4 mb-5">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-angola-red animate-pulse"></span>
              Live Broadcast
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.15] text-ivory">
            ASAE Gala Event <span className="text-gold">2026</span>
          </h2>
          <p className="font-sans text-dim mt-4 max-w-2xl mx-auto">
            Experience the excellence in real-time. Watch the continuous showcase of Pan-African leadership live on our integrated player or directly on YouTube.
          </p>
        </div>

        {/* Video Player Container */}
        <div 
          className="relative aspect-video w-full max-w-5xl mx-auto bg-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {isPlaying ? (
            <iframe
              className="absolute inset-0 w-full h-full border-0 z-20"
              src={youtubeVideoEmbedUrl}
              title="ASAE Gala Event Live Broadcast"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <>
              {/* Simulated Video Feed Placeholder */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-40"></div>
              
              {/* Adaptive Bitrate / Quality overlay simulation */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

              {/* Top Bar Overlay */}
              <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-start transition-opacity duration-300 ${isPlaying || showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg">
                  <Radio size={16} className="text-angola-red animate-pulse" />
                  <span className="font-sans font-bold text-xs tracking-widest uppercase text-ivory">Live Feed</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg text-ivory">
                  <Users size={16} className="text-dim" />
                  <span className="font-sans text-xs font-bold tracking-widest">14,204 watching</span>
                </div>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-15">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-24 h-24 bg-gold/90 hover:bg-gold rounded-full flex items-center justify-center text-dark shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-transform hover:scale-110 pl-2 cursor-pointer"
                >
                  <Play size={40} fill="currentColor" />
                </button>
                <div className="text-center">
                  <p className="font-serif text-lg font-bold text-ivory tracking-wide">Click to stream broadcast live on platform</p>
                  <p className="text-[10px] text-dim font-mono tracking-wider mt-1 uppercase">Instant High Definition Stream Access</p>
                </div>
              </div>

              {/* Bottom Controls Bar */}
              <div className={`absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-black to-transparent transition-opacity duration-300 ${isPlaying || showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress bar simulation */}
                <div className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer relative">
                  <div className="absolute top-0 left-0 h-full bg-angola-red rounded-full w-full"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-ivory">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-gold transition-colors cursor-pointer">
                      <Play size={24} fill="currentColor" />
                    </button>
                    <button className="hover:text-gold transition-colors cursor-pointer">
                      <Volume2 size={24} />
                    </button>
                    <span className="font-sans text-xs tracking-widest font-bold text-angola-red">LIVE</span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-ivory">
                    <div className="group/quality relative">
                      <button className="hover:text-gold transition-colors flex items-center gap-2 font-sans text-xs font-bold tracking-widest">
                        <Settings size={20} />
                        <span>1080p60</span>
                      </button>
                      <div className="absolute bottom-full right-0 mb-4 bg-dark-card border border-white/10 rounded-lg py-2 w-32 hidden group-hover/quality:block shadow-2xl">
                        <div className="px-4 py-2 hover:bg-white/5 font-sans text-xs text-ivory cursor-pointer font-bold">Auto (Adaptive)</div>
                        <div className="px-4 py-2 hover:bg-white/5 font-sans text-xs text-gold flex items-center justify-between cursor-pointer">1080p60 <span className="text-[10px] bg-white/10 px-1 rounded">HD</span></div>
                        <div className="px-4 py-2 hover:bg-white/5 font-sans text-xs text-ivory cursor-pointer">720p</div>
                        <div className="px-4 py-2 hover:bg-white/5 font-sans text-xs text-ivory cursor-pointer">480p</div>
                      </div>
                    </div>
                    <button className="hover:text-gold transition-colors cursor-pointer">
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Live Broadcast Links Container */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href={youtubeLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-8 py-3.5 bg-[#FF0000] hover:bg-[#CC0000] text-white font-sans text-xs font-bold tracking-[2px] rounded-lg transition-all hover:shadow-[0_4px_25px_rgba(255,0,0,0.35)] hover:-translate-y-0.5 cursor-pointer"
            >
              <Youtube size={16} className="fill-current" />
              <span>WATCH LIVE ON YOUTUBE</span>
              <ExternalLink size={12} />
            </a>

            {isPlaying && (
              <button 
                onClick={() => setIsPlaying(false)}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-ivory border border-white/10 hover:border-white/20 rounded-lg font-sans text-xs font-bold tracking-[2px] transition-all cursor-pointer"
              >
                CLOSE PLAYER
              </button>
            )}
          </div>

          <p className="font-mono text-[9px] tracking-widest text-dim text-center uppercase mt-2">
            Broadcasting in HD Quality with Interactive Live Chats
          </p>
        </div>
      </div>
    </section>
  );
}
