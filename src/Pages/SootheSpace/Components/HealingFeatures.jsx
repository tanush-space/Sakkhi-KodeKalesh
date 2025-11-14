import { useState } from 'react';
import { Waves, Leaf, HeartPulse, X } from 'lucide-react';

const HealingFeatures = () => {
  const [activeMeditation, setActiveMeditation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const meditations = [
    {
      id: 1,
      icon: <Waves size={28} />,
      title: "Breathe with Me",
      subtitle: "3-min box breathing",
      duration: 180,
      instructions: [
        "Inhale deeply for 4 seconds",
        "Hold your breath for 4 seconds",
        "Exhale slowly for 4 seconds",
        "Hold empty for 4 seconds",
        "Repeat this cycle"
      ]
    },
    {
      id: 2,
      icon: <Leaf size={28} />,
      title: "Feel Grounded",
      subtitle: "foot-to-floor awareness",
      duration: 120,
      instructions: [
        "Sit comfortably with feet flat on floor",
        "Feel the weight of your body",
        "Notice the connection between feet and ground",
        "Breathe naturally",
        "Stay present with this sensation"
      ]
    },
    {
      id: 3,
      icon: <HeartPulse size={28} />,
      title: "Quiet the Storm",
      subtitle: "heartbeat sync meditation",
      duration: 180,
      instructions: [
        "Place hand on your heart",
        "Feel your heartbeat",
        "Breathe in sync with your pulse",
        "Let thoughts pass like clouds",
        "Return to your heartbeat"
      ]
    }
  ];

  const startMeditation = (meditation) => {
    setActiveMeditation(meditation);
    setTimeLeft(meditation.duration);
    setIsActive(true);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const closeMeditation = () => {
    setActiveMeditation(null);
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-br from-[#f8d7e8] to-[#fce4ec]">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl sm:text-3xl font-semibold text-purple-700 text-center mb-2">
          Micro Meditations
        </h2>
        <p className="text-sm text-purple-500 text-center mb-10">
          Small moments of peace, designed for busy minds
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meditations.map((meditation) => (
            <MeditationCard
              key={meditation.id}
              meditation={meditation}
              onStart={() => startMeditation(meditation)}
            />
          ))}
        </div>
      </div>

      {/* Meditation Modal */}
      {activeMeditation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={closeMeditation}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="text-center mb-6">
              <div className="text-purple-600 mb-4 flex justify-center">
                {activeMeditation.icon}
              </div>
              <h3 className="text-2xl font-semibold text-purple-700 mb-2">
                {activeMeditation.title}
              </h3>
              <p className="text-purple-500 text-sm">{activeMeditation.subtitle}</p>
            </div>

            {/* Timer */}
            <div className="mb-6">
              <div className="text-5xl font-light text-purple-600 mb-2">
                {formatTime(timeLeft)}
              </div>
              {timeLeft === 0 && (
                <p className="text-green-600 font-semibold">Complete! 🌸</p>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-semibold text-purple-700 mb-3">
                Follow these steps:
              </h4>
              <ul className="space-y-2 text-left">
                {activeMeditation.instructions.map((instruction, idx) => (
                  <li key={idx} className="text-sm text-purple-600 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {timeLeft === 0 && (
              <button
                onClick={closeMeditation}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:opacity-90 transition"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Meditation card component
const MeditationCard = ({ meditation, onStart }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition border border-purple-200/50">
    <div className="text-purple-600 mb-4 flex justify-center">{meditation.icon}</div>
    <h3 className="text-lg text-purple-700 font-semibold mb-1">{meditation.title}</h3>
    <p className="text-sm text-purple-500 mb-4">{meditation.subtitle}</p>
    <button
      onClick={onStart}
      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm px-6 py-2 rounded-full transition transform hover:scale-105"
    >
      Begin
    </button>
  </div>
);

export default HealingFeatures;
