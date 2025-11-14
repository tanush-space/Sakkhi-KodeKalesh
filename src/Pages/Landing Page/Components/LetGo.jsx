import { useState } from "react";

const LetGo = () => {
  const [text, setText] = useState("");
  const [isBurning, setIsBurning] = useState(false);

  const handleLetGo = () => {
    if (!text.trim()) return;
    
    setIsBurning(true);
    setTimeout(() => {
      setText("");
      setIsBurning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1430] to-[#0e0a1f] px-4 py-16">
      {/* Top Heading */}
      <h2 className="text-3xl md:text-4xl font-light text-white mb-3 text-center">
        Kuch Bolna Chahti Ho?
      </h2>
      <p className="text-gray-300 max-w-xl mx-auto mb-12 text-center">
        Write it down, then watch it disappear. Sometimes letting go is the first step to healing.
      </p>

      <div className="relative bg-[#1f1b2e] backdrop-blur-md border border-purple-900/30 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-300/20 via-purple-400/20 to-pink-300/20 rounded-2xl blur-xl opacity-50"></div>
        
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-semibold text-pink-300 text-center mb-2">
            Write, Then Let Go
          </h1>
          <p className="text-sm text-purple-200 text-center mb-6 italic">
            Release what weighs heavy on your heart
          </p>

          <div className="mt-6 relative">
            <label
              htmlFor="thoughts"
              className="block text-lg font-medium text-purple-300 mb-3"
            >
              What's heavy right now?
            </label>
            
            {/* Burning paper container */}
            <div className="relative">
              <textarea
                id="thoughts"
                rows="8"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Let your thoughts flow here... there's no judgement, only release."
                disabled={isBurning}
                className={`w-full p-4 rounded-lg border border-purple-800/50 bg-[#2a2440] text-white placeholder-purple-400/60 focus:outline-none focus:ring-2 focus:ring-pink-300/50 resize-none shadow-lg transition-all duration-300 ${
                  isBurning ? "burning-paper" : ""
                }`}
                style={{
                  backgroundImage: isBurning ? 'linear-gradient(to top, #ff6b00, #ff8c00, transparent)' : 'none',
                }}
              ></textarea>
              
              {/* Fire particles */}
              {isBurning && (
                <div className="fire-particles">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="fire-particle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${1 + Math.random()}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleLetGo}
              disabled={!text.trim() || isBurning}
              className="mt-6 w-full bg-gradient-to-r from-pink-300 to-purple-400 hover:from-pink-400 hover:to-purple-500 text-black font-semibold py-3 px-6 rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {isBurning ? "Letting Go... 🔥" : "Let Go ✨"}
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 mt-8 text-center max-w-md">
        Your words are safe here. They'll disappear like smoke, leaving only peace behind.
      </p>

      <style jsx>{`
        @keyframes burn {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: brightness(1);
          }
          50% {
            opacity: 0.7;
            filter: brightness(1.5) contrast(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
            filter: brightness(2) contrast(0.5);
          }
        }

        @keyframes fireParticle {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .burning-paper {
          animation: burn 2s ease-in-out forwards, flicker 0.1s infinite;
          background-blend-mode: screen;
        }

        .fire-particles {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .fire-particle {
          position: absolute;
          bottom: 0;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #ff6b00, #ff8c00);
          border-radius: 50%;
          animation: fireParticle linear forwards;
          box-shadow: 0 0 10px #ff6b00;
        }
      `}</style>
    </div>
  );
};

export default LetGo;
