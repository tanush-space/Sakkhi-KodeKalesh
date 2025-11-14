import { useState, useRef } from "react";
import { Mic, Square } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function VoiceCheckIn() {
  const [isRecording, setIsRecording] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startTimeRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        setShowModal(true);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Fake sentiment analysis
  const analyzeSentiment = () => {
    const sentiments = [
      { sentiment: 'positive', score: 0.85, emotion: 'happy' },
      { sentiment: 'negative', score: 0.72, emotion: 'sad' },
      { sentiment: 'neutral', score: 0.60, emotion: 'neutral' },
      { sentiment: 'mixed', score: 0.55, emotion: 'mixed' }
    ];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  };

  const handleConfirm = async () => {
    setIsSaving(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Please sign in to save your recording");
        setShowModal(false);
        setIsSaving(false);
        return;
      }

      // Upload audio to Supabase Storage
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, audioBlob);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('voice-recordings')
        .getPublicUrl(fileName);

      // Perform fake sentiment analysis
      const analysis = analyzeSentiment();

      // Save to database
      const { error: dbError } = await supabase
        .from('voice_recordings')
        .insert({
          user_id: user.id,
          audio_url: publicUrl,
          transcript: "Voice recording (transcript not available)",
          sentiment: analysis.sentiment,
          sentiment_score: analysis.score,
          prompt: "Voice check-in",
          duration: duration
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }

      setShowModal(false);
      setIsSaving(false);

      // Redirect based on sentiment
      if (analysis.emotion === "happy") {
        window.location.href = "/soothe-space";
      } else if (analysis.emotion === "sad") {
        window.location.href = "/my-reflexion";
      } else {
        window.location.href = "/bharosa-library";
      }
    } catch (error) {
      console.error("Error saving recording:", error);
      alert("Failed to save recording. Please try again.");
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    audioChunksRef.current = [];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0e0a1f] to-[#1a1430] px-4 py-20 md:py-12">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-light text-white mb-2 md:mb-3">
          Voice Check-in
        </h1>
        <p className="text-purple-200 text-xs md:text-base max-w-md mx-auto px-4">
          Your voice matters. Share how you're feeling today.
        </p>
      </div>

      {/* Recording Button */}
      <div className="relative mb-6 md:mb-8">
        {/* Glow effect when recording */}
        {isRecording && (
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/30 to-red-500/30 rounded-full blur-2xl animate-pulse"></div>
        )}
        
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`relative p-6 md:p-8 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none ${
            isRecording 
              ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse" 
              : "bg-gradient-to-r from-pink-300 to-purple-400"
          }`}
        >
          {isRecording ? (
            <Square className="w-10 h-10 md:w-12 md:h-12 text-white" fill="white" />
          ) : (
            <Mic className="w-10 h-10 md:w-12 md:h-12 text-white" />
          )}
        </button>
      </div>

      {/* Status Text */}
      <p className="text-purple-200 text-center mb-3 md:mb-4 text-sm md:text-base">
        {isRecording ? "Recording... Tap to stop" : "Tap the mic to start"}
      </p>

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 text-pink-300 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs md:text-sm">Recording in progress</span>
        </div>
      )}

      {/* Info cards */}
      <div className="mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl w-full">
        <div className="bg-[#1f1b2e] p-4 rounded-xl border border-purple-900/30 text-center">
          <div className="text-2xl mb-2">🎤</div>
          <p className="text-sm text-purple-200">Speak freely</p>
        </div>
        <div className="bg-[#1f1b2e] p-4 rounded-xl border border-purple-900/30 text-center">
          <div className="text-2xl mb-2">🔒</div>
          <p className="text-sm text-purple-200">Private & secure</p>
        </div>
        <div className="bg-[#1f1b2e] p-4 rounded-xl border border-purple-900/30 text-center">
          <div className="text-2xl mb-2">💝</div>
          <p className="text-sm text-purple-200">No judgment</p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
          <div className="bg-[#1f1b2e] p-8 rounded-2xl shadow-2xl max-w-md w-full border border-purple-900/30">
            <h2 className="text-xl font-semibold mb-4 text-pink-300 text-center">
              Save this recording?
            </h2>
            <p className="text-sm text-purple-200 text-center mb-6">
              We'll analyze your emotions and guide you to helpful resources
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 px-6 py-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSaving}
                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-pink-300 to-purple-400 hover:from-pink-400 hover:to-purple-500 text-black font-semibold transition disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
