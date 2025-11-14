import React from 'react';
import { Mic, RefreshCw, Heart } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-[#f8d7e8] to-[#fce4ec] relative py-20">
      {/* Blur circles for style */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300 opacity-20 rounded-full filter blur-3xl"></div>
      <div className="absolute top-32 right-10 w-32 h-32 bg-pink-300 opacity-20 rounded-full filter blur-3xl"></div>

      {/* Quotes */}
      <h1 className="text-purple-700 text-2xl sm:text-3xl md:text-4xl font-light italic max-w-xl leading-relaxed mb-4">
        <span className="block">"Even silence can be healing.</span>
        <span className="block mt-1">This is your space to breathe."</span>
      </h1>

      {/* Buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight * 3, behavior: 'smooth' })}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
        >
          <Mic size={18} />
          Play a 3-minute healing
        </button>

        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
        >
          <RefreshCw size={18} />
          Try a micro meditation
        </button>

        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' })}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
        >
          <Heart size={18} />
          Leave yourself a gentle message
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
