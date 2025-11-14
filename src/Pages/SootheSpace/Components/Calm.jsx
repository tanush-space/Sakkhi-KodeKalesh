import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, X } from "lucide-react";

const TimerCard = ({ minutes, label, description, onClick, isActive }) => (
  <div
    onClick={() => onClick(minutes)}
    className={`relative group cursor-pointer transition-all duration-300 ${
      isActive ? 'scale-105' : 'hover:scale-105'
    }`}
  >
    {/* Glow effect */}
    <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500 ${
      isActive ? 'opacity-100' : ''
    }`}></div>
    
    <div className={`relative bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center border transition-all duration-300 ${
      isActive ? 'border-purple-400 bg-purple-50/80' : 'border-purple-200/50'
    }`}>
      <div className={`w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full font-bold text-2xl transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110' 
          : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
      }`}>
        {minutes}
      </div>
      <p className="text-base text-purple-700 font-semibold">{label}</p>
      <p className="text-sm text-purple-400 mt-1">{description}</p>
    </div>
  </div>
);

const Calm = () => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const timers = [
    { minutes: 2, label: "2 minutes", description: "Quick reset" },
    { minutes: 5, label: "5 minutes", description: "Gentle pause" },
    { minutes: 10, label: "10 minutes", description: "Deep stillness" },
    { minutes: 15, label: "15 minutes", description: "Extended calm" },
  ];

  const startTimer = (minutes) => {
    const totalSeconds = minutes * 60;
    setActiveTimer(minutes);
    setSecondsLeft(totalSeconds);
    setIsPaused(false);
    setShowTimer(true);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    if (activeTimer) {
      setSecondsLeft(activeTimer * 60);
      setIsPaused(false);
    }
  };

  const closeTimer = () => {
    setShowTimer(false);
    setActiveTimer(null);
    setSecondsLeft(null);
    setIsPaused(false);
  };

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0 || isPaused) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Timer complete notification
          const audio = new Audio('/sounds/flute.mp3');
          audio.play().catch(() => {});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = activeTimer && secondsLeft !== null 
    ? ((activeTimer * 60 - secondsLeft) / (activeTimer * 60)) * 100 
    : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8d7e8] to-[#fce4ec] px-4 py-12 relative">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-light text-purple-700 mb-3">
          Calm Timer
        </h1>
        <p className="text-base md:text-lg text-purple-500">
          Choose your moment of stillness
        </p>
      </div>

      {/* Timer Cards */}
      {!showTimer && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          {timers.map((timer) => (
            <TimerCard
              key={timer.minutes}
              minutes={timer.minutes}
              label={timer.label}
              description={timer.description}
              onClick={startTimer}
              isActive={activeTimer === timer.minutes}
            />
          ))}
        </div>
      )}

      {/* Active Timer Display */}
      {showTimer && secondsLeft !== null && (
        <div className="w-full max-w-md">
          {/* Close button */}
          <button
            onClick={closeTimer}
            className="absolute top-8 right-8 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition"
          >
            <X className="w-6 h-6 text-purple-600" />
          </button>

          {/* Timer Circle */}
          <div className="relative mb-8">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            
            {/* Progress circle */}
            <div className="relative w-80 h-80 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="#e9d5ff"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 140}`}
                  strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Timer text in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-light text-purple-700 mb-2">
                  {formatTime(secondsLeft)}
                </div>
                <div className="text-sm text-purple-400">
                  {isPaused ? "Paused" : "Breathe..."}
                </div>
              </div>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={togglePause}
              className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition transform hover:scale-105"
            >
              {isPaused ? (
                <Play className="w-6 h-6" fill="white" />
              ) : (
                <Pause className="w-6 h-6" fill="white" />
              )}
            </button>
            <button
              onClick={resetTimer}
              className="p-4 rounded-full bg-white hover:bg-purple-50 text-purple-600 shadow-lg transition transform hover:scale-105"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          {/* Completion message */}
          {secondsLeft === 0 && (
            <div className="mt-8 text-center animate-fade-in">
              <div className="text-2xl mb-2">🌸</div>
              <p className="text-xl text-purple-700 font-semibold mb-2">
                Time's up!
              </p>
              <p className="text-purple-500">
                You've completed your moment of stillness
              </p>
              <button
                onClick={closeTimer}
                className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition"
              >
                Choose Another Timer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Breathing guide */}
      {showTimer && secondsLeft > 0 && !isPaused && (
        <div className="mt-12 text-center max-w-md">
          <p className="text-purple-600 text-sm mb-2">Breathing Guide</p>
          <div className="flex items-center justify-center gap-8 text-purple-500">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center mb-2 animate-pulse">
                ↑
              </div>
              <span className="text-xs">Inhale 4s</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center mb-2">
                ⏸
              </div>
              <span className="text-xs">Hold 4s</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center mb-2 animate-pulse">
                ↓
              </div>
              <span className="text-xs">Exhale 4s</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Calm;
