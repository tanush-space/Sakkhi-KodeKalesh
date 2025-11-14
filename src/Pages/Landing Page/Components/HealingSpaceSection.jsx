import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Listed the features
const features = [
  {
    icon: '💬',
    title: 'Suno Khud Ko',
    subtitle: 'Voice note mood check-ins',
    description: 'Record your feelings in your own voice. Sometimes speaking feels easier than writing.',
    color: 'from-pink-500/20 to-purple-500/20',
    route: '/suno-khud-ko',
  },
  {
    icon: '✍️',
    title: 'Self-Love Journal',
    subtitle: 'Daily reflective prompts',
    description: 'Gentle questions that help you reconnect with who you are beyond motherhood.',
    color: 'from-purple-500/20 to-blue-500/20',
    route: '/my-reflexion',
  },
  {
    icon: '👭',
    title: 'Circle Of One',
    subtitle: 'Anonymous support chatrooms',
    description: 'Connect with other mothers who understand your journey, without judgment.',
    color: 'from-blue-500/20 to-pink-500/20',
    route: '/circle-of-one',
  },
  {
    icon: '♀️',
    title: 'SootheSpace',
    subtitle: 'Breathing, meditations, mirror pep talks',
    description: 'Quick moments of peace when the world feels overwhelming.',
    color: 'from-pink-400/20 to-purple-400/20',
    route: '/soothe-space',
  },
  {
    icon: '📖',
    title: 'Bharosa Library',
    subtitle: 'Real mom stories (English/Hindi)',
    description: "Read stories from mothers who've walked this path and found their way back to themselves.",
    color: 'from-purple-400/20 to-pink-400/20',
    route: '/bharosa-library',
  },
  {
    icon: '🕯️',
    title: 'MyReflection Room',
    subtitle: 'Auto-built timeline of personal wins',
    description: 'Watch your healing journey unfold as small victories become big transformations.',
    color: 'from-blue-400/20 to-purple-500/20',
    route: '/my-reflexion',
  },
];

const FeatureCard = ({ icon, title, subtitle, description, color, index, route }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500`}></div>
      
      <div className="relative bg-[#1f1b2e] text-white p-6 rounded-2xl shadow-md border border-purple-900/30 h-full transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
        {/* Icon with animation */}
        <div className={`text-4xl mb-3 transition-all duration-300 ${isHovered ? 'scale-110 rotate-6' : 'scale-100'}`}>
          {icon}
        </div>
        
        <h3 className="text-lg font-semibold text-pink-300 transition-colors duration-300 group-hover:text-pink-200">
          {title}
        </h3>
        
        <p className="text-sm text-purple-200 italic mt-1 transition-colors duration-300 group-hover:text-purple-100">
          {subtitle}
        </p>
        
        <div className="overflow-hidden">
          <p className={`text-sm text-gray-300 mt-3 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-90'}`}>
            {description}
          </p>
        </div>

        {/* Hover indicator */}
        <div className={`mt-4 flex items-center text-xs text-pink-300 font-medium transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
          <span>Learn more</span>
          <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const HealingSpaceSection = () => {
  return (
    <div className="bg-gradient-to-b from-[#0e0a1f] to-[#1a1430] text-white py-16 px-4 md:px-12 text-center">
      <h2 className="text-3xl md:text-4xl font-light mb-2">
        Your Personal <span className="italic font-semibold text-pink-300">Healing Space</span>
      </h2>
      <p className="text-gray-300 max-w-xl mx-auto mb-12">Tools designed with love, for the journey back to yourself</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-stretch">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} index={index} />
        ))}
      </div>

      <p className="text-sm text-gray-400 mt-14">Every feature is a step closer to finding yourself again</p>

      <button className="mt-4 px-6 py-2 text-sm rounded-full bg-white text-[#1a1430] hover:bg-gray-200 transition font-medium">
        Explore All Features
      </button>
    </div>
  );
};

export default HealingSpaceSection;
