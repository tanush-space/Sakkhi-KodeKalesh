import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import jsPDF from "jspdf";

const ReflectionPage = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);

  // Fetch user's voice recordings
  const fetchRecordings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please sign in to access your recordings");
      return null;
    }

    const { data, error } = await supabase
      .from('voice_recordings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching recordings:", error);
      return null;
    }

    return data;
  };

  // Export as PDF
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const recordings = await fetchRecordings();
      if (!recordings || recordings.length === 0) {
        alert("No recordings found to export");
        setIsExporting(false);
        return;
      }

      const doc = new jsPDF();
      let yPosition = 20;

      doc.setFontSize(18);
      doc.text("My Voice Reflections", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 15;

      recordings.forEach((recording, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(12);
        doc.text(`Recording ${index + 1}`, 20, yPosition);
        yPosition += 7;

        doc.setFontSize(10);
        doc.text(`Date: ${new Date(recording.created_at).toLocaleString()}`, 20, yPosition);
        yPosition += 7;

        if (recording.prompt) {
          doc.text(`Prompt: ${recording.prompt}`, 20, yPosition);
          yPosition += 7;
        }

        if (recording.sentiment) {
          doc.text(`Sentiment: ${recording.sentiment} (${recording.sentiment_score})`, 20, yPosition);
          yPosition += 7;
        }

        if (recording.transcript) {
          doc.setFontSize(9);
          const lines = doc.splitTextToSize(recording.transcript, 170);
          doc.text(lines, 20, yPosition);
          yPosition += (lines.length * 5) + 10;
        }

        yPosition += 5;
      });

      doc.save(`voice-reflections-${new Date().toISOString().split('T')[0]}.pdf`);
      alert("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
    setIsExporting(false);
  };

  // Email to Myself
  const handleEmailToMyself = async () => {
    setIsEmailing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please sign in to email your recordings");
        setIsEmailing(false);
        return;
      }

      const recordings = await fetchRecordings();
      if (!recordings || recordings.length === 0) {
        alert("No recordings found to email");
        setIsEmailing(false);
        return;
      }

      // Create email content
      let emailBody = `Hi,\n\nHere are your voice reflections from Sakkhi:\n\n`;
      
      recordings.forEach((recording, index) => {
        emailBody += `\n--- Recording ${index + 1} ---\n`;
        emailBody += `Date: ${new Date(recording.created_at).toLocaleString()}\n`;
        if (recording.prompt) emailBody += `Prompt: ${recording.prompt}\n`;
        if (recording.sentiment) emailBody += `Sentiment: ${recording.sentiment}\n`;
        if (recording.transcript) emailBody += `Transcript: ${recording.transcript}\n`;
        if (recording.audio_url) emailBody += `Audio: ${recording.audio_url}\n`;
        emailBody += `\n`;
      });

      emailBody += `\nWith love,\nSakkhi`;

      // Create mailto link
      const subject = encodeURIComponent("Your Voice Reflections from Sakkhi");
      const body = encodeURIComponent(emailBody);
      const mailtoLink = `mailto:${user.email}?subject=${subject}&body=${body}`;

      window.location.href = mailtoLink;
      
      setTimeout(() => {
        alert("Email client opened! Please send the email.");
      }, 500);
    } catch (error) {
      console.error("Error emailing:", error);
      alert("Failed to prepare email. Please try again.");
    }
    setIsEmailing(false);
  };

  // Move to Journal (Bharosa Library)
  const handleMoveToJournal = () => {
    setShowMoveModal(true);
  };

  const confirmMoveToJournal = async () => {
    setIsMoving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please sign in to move recordings");
        setIsMoving(false);
        setShowMoveModal(false);
        return;
      }

      const recordings = await fetchRecordings();
      if (!recordings || recordings.length === 0) {
        alert("No recordings found to move");
        setIsMoving(false);
        setShowMoveModal(false);
        return;
      }

      // Get user metadata for author name
      const { data: userData } = await supabase.auth.getUser();
      const authorName = userData?.user?.user_metadata?.pet_name || 'Anonymous';

      // Move recordings to bharosa_stories table (Bharosa Library)
      const stories = recordings.map(recording => ({
        user_id: user.id,
        title: recording.prompt || "My Voice Reflection",
        content: recording.transcript || "Voice recording",
        city: "Anonymous", // User can update later
        author_name: authorName,
        language: "English",
        is_approved: false, // Needs admin approval
        is_published: false,
        category: recording.sentiment || "reflection"
      }));

      const { error } = await supabase
        .from('bharosa_stories')
        .insert(stories);

      if (error) {
        console.error("Error moving to journal:", error);
        alert("Failed to move recordings. Please try again.");
        setIsMoving(false);
        setShowMoveModal(false);
        return;
      }

      alert("Your reflections have been submitted to Bharosa Library! They will be reviewed by admins before being published.");
      setShowMoveModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
    setIsMoving(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-[#1a1430] to-[#0e0a1f]">
      <h1 className="text-white text-2xl sm:text-3xl md:text-4xl max-w-2xl font-light">
        "Every time you listen to yourself, <br className='hidden sm:inline' /> you stitch a
        part of you back together."
      </h1>

      <div className="mt-8 flex gap-4 flex-wrap justify-center">
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 rounded-md bg-white/20 text-white border border-white/30 hover:bg-white/30 transition"
        >
          Return to Dashboard
        </button>
        <button 
          onClick={() => window.location.href = '/my-reflexion'}
          className="px-6 py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:opacity-90 transition"
        >
          Visit My Reflection Room
        </button>
      </div>

      <div className="text-sm text-white/60 mt-10 space-y-1">
        <p>It's okay to stop and rest.</p>
        <p>You are already healing — just by showing up.</p>
        <p>You're not alone here.</p>
      </div>

      <div className="mt-16 w-full max-w-2xl p-4 sm:p-6 bg-white/10 rounded-xl border border-white/20 backdrop-blur">
        <h2 className="text-white mb-4 text-lg sm:text-xl font-medium">
          Take Your Reflections With You
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? "Exporting..." : "Export as PDF"}
          </button>
          <button 
            onClick={handleEmailToMyself}
            disabled={isEmailing}
            className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEmailing ? "Preparing..." : "Email to Myself"}
          </button>
          <button 
            onClick={handleMoveToJournal}
            disabled={isMoving}
            className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Move to Journal
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Move to Journal */}
      {showMoveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
          <div className="bg-[#1f1b2e] p-8 rounded-2xl shadow-2xl max-w-md w-full border border-purple-900/30">
            <h2 className="text-xl font-semibold mb-4 text-pink-300 text-center">
              Share with Bharosa Library?
            </h2>
            <p className="text-sm text-purple-200 text-center mb-6">
              Your reflections will be submitted to Bharosa Library for review. They will be published after admin approval to help other mothers on their healing journey.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowMoveModal(false)}
                disabled={isMoving}
                className="flex-1 px-6 py-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmMoveToJournal}
                disabled={isMoving}
                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-pink-300 to-purple-400 hover:from-pink-400 hover:to-purple-500 text-black font-semibold transition disabled:opacity-50"
              >
                {isMoving ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionPage;
