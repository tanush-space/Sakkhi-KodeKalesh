import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

// Prompt Card Component
const PromptCard = ({ prompt, onPrev, onNext, onShuffle }) => (
  <div className="bg-[#2a1f3a] text-white rounded-xl p-6 shadow-lg w-full max-w-2xl mx-auto text-center space-y-4">
    <h2 className="text-xl font-light italic">{`"${prompt}"`}</h2>
    <button onClick={onShuffle} className="text-sm text-purple-300 hover:underline">
      ⟳ Shuffle Prompt
    </button>
    <div className="flex justify-between items-center mt-4">
      <button onClick={onPrev} className="text-white text-2xl px-4 hover:text-purple-400">{'<'}</button>
      <button onClick={onNext} className="text-white text-2xl px-4 hover:text-purple-400">{'>'}</button>
    </div>
  </div>
);

// Voice Matters Section
const VoiceMattersSection = () => (
  <section className="text-white text-center mt-20 px-4">
    <h2 className="text-xl font-semibold mb-6">Your Voice Matters — Always</h2>
    <div className="bg-[#2a1f3a] rounded-xl py-10 px-6 max-w-3xl mx-auto shadow-lg">
      <p className="text-sm text-purple-200 tracking-wide mb-2">🎧</p>
      <p className="text-md text-purple-300 font-light">Your story is waiting to be heard.</p>
      <p className="text-sm mt-2 text-gray-400">Start by recording your first voice note above.</p>
    </div>
  </section>
);

// Main Component
const SpeakUp = () => {
  const prompts = [
    "Did I feel heard today?",
    "What made me smile today?",
    "What challenged me emotionally?",
    "What do I need more of?",
    "Did I feel loved today?",
  ];

  const [index, setIndex] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [showPastReflections, setShowPastReflections] = useState(false);
  const [note, setNote] = useState("");
  const [pastReflections, setPastReflections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showPastReflections) {
      fetchPastReflections();
    }
  }, [showPastReflections]);

  const fetchPastReflections = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Please sign in to view your reflections");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('voice_recordings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching reflections:", error);
      } else {
        setPastReflections(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleNext = () => setIndex((prev) => (prev + 1) % prompts.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + prompts.length) % prompts.length);
  const handleShuffle = () => setIndex(Math.floor(Math.random() * prompts.length));

  // Fake sentiment analysis
  const analyzeSentiment = (text) => {
    const positiveWords = ['happy', 'joy', 'love', 'smile', 'good', 'great', 'wonderful', 'blessed'];
    const negativeWords = ['sad', 'pain', 'hurt', 'difficult', 'hard', 'struggle', 'tired', 'alone'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) {
      return { sentiment: 'positive', score: 0.75 + (Math.random() * 0.2) };
    } else if (negativeCount > positiveCount) {
      return { sentiment: 'negative', score: 0.65 + (Math.random() * 0.2) };
    } else if (positiveCount === negativeCount && positiveCount > 0) {
      return { sentiment: 'mixed', score: 0.55 + (Math.random() * 0.15) };
    }
    return { sentiment: 'neutral', score: 0.50 + (Math.random() * 0.15) };
  };

  const handleSave = async () => {
    if (note.trim() === "") {
      alert("Aapka note khaali hai! Kripya kuch likhein.");
      return;
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Please sign in to save your reflection");
        return;
      }

      // Perform sentiment analysis
      const analysis = analyzeSentiment(note);

      // Save to database
      const { error } = await supabase
        .from('voice_recordings')
        .insert({
          user_id: user.id,
          transcript: note,
          sentiment: analysis.sentiment,
          sentiment_score: analysis.score.toFixed(2),
          prompt: currentPrompt,
          duration: 0
        });

      if (error) {
        console.error("Error saving:", error);
        alert("Failed to save. Please try again.");
        return;
      }

      alert("Aapka note save ho gaya hai! 😊");
      setNote("");
      setShowReflection(false);
      fetchPastReflections(); // Refresh the list
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const currentPrompt = prompts[index]; // ✅ Use this throughout

  const getSentimentEmoji = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'mixed': return '😐';
      default: return '😌';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      case 'mixed': return 'text-yellow-400';
      default: return 'text-purple-400';
    }
  };

  // Past Reflections View
  if (showPastReflections) {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 py-10 bg-gradient-to-b from-[#0e0a1f] to-[#1a1430]">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center text-white">
          Your Written Reflections
        </h1>
        <p className="text-sm md:text-base text-gray-300 mb-8 text-center max-w-2xl">
          A collection of your thoughts and feelings. Each one is a step in your healing journey.
        </p>

        <button
          onClick={() => setShowPastReflections(false)}
          className="mb-6 text-sm text-purple-300 hover:underline"
        >
          ← Back to prompts
        </button>

        {loading ? (
          <div className="text-white">Loading your reflections...</div>
        ) : pastReflections.length === 0 ? (
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-purple-200 mb-4">No reflections yet</p>
            <p className="text-gray-400 text-sm">Start by answering a prompt above</p>
          </div>
        ) : (
          <div className="w-full max-w-3xl space-y-4">
            {pastReflections.map((reflection) => (
              <div
                key={reflection.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    {reflection.prompt && (
                      <p className="text-purple-300 text-sm italic mb-2">
                        "{reflection.prompt}"
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(reflection.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getSentimentEmoji(reflection.sentiment)}</span>
                    <span className={`text-xs font-medium ${getSentimentColor(reflection.sentiment)}`}>
                      {reflection.sentiment}
                    </span>
                  </div>
                </div>
                
                <p className="text-white text-base leading-relaxed">
                  {reflection.transcript}
                </p>

                {reflection.audio_url && (
                  <div className="mt-4">
                    <audio controls className="w-full">
                      <source src={reflection.audio_url} type="audio/webm" />
                    </audio>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Reflection Page
  if (showReflection) {
    return (
      <div
        className="min-h-screen flex flex-col items-center px-4 py-10 bg-gradient-to-b from-[#0e0a1f] to-[#1a1430]"
        style={{
          fontFamily: "'Georgia', cursive",
          color: "#ffffff",
        }}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center">
          To Yourself, With Love.
        </h1>
        <p className="text-sm md:text-base text-gray-300 mb-8 text-center">
          No pressure. No rules. Just your voice, on a page, in your own time.
        </p>

        {/* Use same prompt here */}
        <div className="bg-white/10 rounded-lg px-6 py-4 w-full max-w-2xl mb-4 border border-white/20">
          <h2 className="text-lg md:text-xl italic mb-1">{`"${currentPrompt}"`}</h2>
        </div>

        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full mb-6 text-sm" onClick={handleShuffle}>
          Inspire Me Again
        </button>

        <textarea
          rows={12}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Let it out. This moment belongs to you..."
          className="w-full max-w-3xl bg-white/10 p-4 rounded-lg text-white border border-white/20 resize-none text-base mb-4 placeholder-gray-300"
        />

        <button
          onClick={handleSave}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition"
        >
          ✏️ Record Emotion
        </button>

        <button
          onClick={() => setShowReflection(false)}
          className="text-sm text-purple-300 mt-4 hover:underline"
        >
          ← Back to prompts
        </button>

        <p className="text-sm text-gray-400 mt-6 italic">
          You matter. Even in this quietest moment.
        </p>
      </div>
    );
  }

  // SpeakUp Page
  return (
    <div
      className="min-h-screen flex flex-col items-center py-16 font-sans px-4 bg-gradient-to-b from-[#1a1430] to-[#0e0a1f]"
    >
      <h1 className="text-white text-xl font-semibold mb-8">Today, ask yourself…</h1>

      <PromptCard
        prompt={currentPrompt}
        onPrev={handlePrev}
        onNext={handleNext}
        onShuffle={handleShuffle}
      />

      <div className="mt-6 flex justify-center gap-4">
        <button
          className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 text-sm"
          onClick={() => setShowReflection(true)}
        >
          Type my answer
        </button>
        <button 
          className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 text-sm"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Leave a voice note 🎤
        </button>
      </div>

      <p className="text-sm mt-3 text-gray-400">
        You don’t need to have the right words. Just begin.
      </p>

      <button
        onClick={() => setShowPastReflections(true)}
        className="mt-8 px-6 py-2 bg-white/10 text-purple-300 rounded-full hover:bg-white/20 transition border border-purple-400/30"
      >
        View My Written Reflections 📖
      </button>

      <VoiceMattersSection />
    </div>
  );
};

export default SpeakUp;
