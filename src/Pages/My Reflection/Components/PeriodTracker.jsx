import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Calendar } from 'lucide-react';

const PeriodTracker = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    flow_intensity: 'medium',
    symptoms: [],
    notes: ''
  });

  const symptomOptions = [
    'Cramps', 'Headache', 'Mood swings', 'Fatigue', 
    'Bloating', 'Back pain', 'Breast tenderness', 'Anxiety'
  ];

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('period_cycles')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error fetching cycles:', error);
      } else {
        setCycles(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleSymptomToggle = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please sign in to track your cycle');
        return;
      }

      // Calculate cycle length if end date is provided
      let cycleLength = null;
      if (formData.end_date && formData.start_date) {
        const start = new Date(formData.start_date);
        const end = new Date(formData.end_date);
        cycleLength = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      }

      const { error } = await supabase
        .from('period_cycles')
        .insert({
          user_id: user.id,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          cycle_length: cycleLength,
          flow_intensity: formData.flow_intensity,
          symptoms: formData.symptoms,
          notes: formData.notes || null
        });

      if (error) {
        console.error('Error saving cycle:', error);
        alert('Failed to save. Please try again.');
        return;
      }

      alert('Cycle tracked successfully! 🌸');
      setFormData({
        start_date: '',
        end_date: '',
        flow_intensity: 'medium',
        symptoms: [],
        notes: ''
      });
      setShowAddForm(false);
      fetchCycles();
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const predictNextPeriod = () => {
    if (cycles.length < 2) return null;
    
    // Calculate average cycle length from last 3 cycles
    const completedCycles = cycles.filter(c => c.cycle_length);
    if (completedCycles.length === 0) return null;
    
    const avgLength = Math.round(
      completedCycles.slice(0, 3).reduce((sum, c) => sum + c.cycle_length, 0) / 
      Math.min(completedCycles.length, 3)
    );
    
    const lastCycle = cycles[0];
    const lastStart = new Date(lastCycle.start_date);
    const predictedDate = new Date(lastStart);
    predictedDate.setDate(predictedDate.getDate() + avgLength);
    
    return { date: predictedDate, avgLength };
  };

  const prediction = predictNextPeriod();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2a0845] to-[#6441a5] flex items-center justify-center px-4 py-12">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a0845] to-[#6441a5] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Calendar className="w-8 h-8 text-pink-300" />
            <h1 className="text-3xl md:text-4xl font-light text-white">
              Period Tracker
            </h1>
          </div>
          <p className="text-purple-200">
            Track your cycle, understand your body
          </p>
        </div>

        {/* Prediction Card */}
        {prediction && (
          <div className="bg-pink-500/20 backdrop-blur-md border border-pink-300/30 rounded-2xl p-6 mb-6">
            <h3 className="text-pink-200 font-semibold mb-2">Next Period Prediction</h3>
            <p className="text-white text-2xl">
              {prediction.date.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            <p className="text-pink-200 text-sm mt-1">
              Based on your average {prediction.avgLength}-day cycle
            </p>
          </div>
        )}

        {/* Add Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-full hover:scale-105 transition"
          >
            + Track New Cycle
          </button>
        )}

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md border border-purple-300/30 rounded-2xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Log Your Cycle</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-purple-300/30 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm mb-2">End Date (optional)</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-purple-300/30 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-purple-200 text-sm mb-2">Flow Intensity</label>
              <div className="flex gap-3">
                {['light', 'medium', 'heavy'].map(intensity => (
                  <button
                    key={intensity}
                    type="button"
                    onClick={() => setFormData({...formData, flow_intensity: intensity})}
                    className={`flex-1 py-2 rounded-lg capitalize transition ${
                      formData.flow_intensity === intensity
                        ? 'bg-pink-500 text-white'
                        : 'bg-white/20 text-purple-200 hover:bg-white/30'
                    }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-purple-200 text-sm mb-2">Symptoms</label>
              <div className="grid grid-cols-2 gap-2">
                {symptomOptions.map(symptom => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`py-2 px-3 rounded-lg text-sm transition ${
                      formData.symptoms.includes(symptom)
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/20 text-purple-200 hover:bg-white/30'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-purple-200 text-sm mb-2">Notes (optional)</label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any additional notes..."
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-purple-300/50 border border-purple-300/30 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-lg hover:scale-105 transition"
              >
                Save Cycle
              </button>
            </div>
          </form>
        )}

        {/* Cycle History */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-xl mb-4">Cycle History</h3>
          
          {cycles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-purple-200 mb-2">No cycles tracked yet</p>
              <p className="text-purple-300 text-sm">Start tracking to see patterns and predictions</p>
            </div>
          ) : (
            cycles.map((cycle) => (
              <div
                key={cycle.id}
                className="bg-white/10 backdrop-blur-md border border-purple-300/30 rounded-xl p-5 hover:border-pink-300/50 transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-semibold">
                      {new Date(cycle.start_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    {cycle.end_date && (
                      <p className="text-purple-200 text-sm">
                        to {new Date(cycle.end_date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {cycle.cycle_length && (
                      <p className="text-pink-300 font-semibold">{cycle.cycle_length} days</p>
                    )}
                    <p className="text-purple-200 text-sm capitalize">{cycle.flow_intensity} flow</p>
                  </div>
                </div>

                {cycle.symptoms && cycle.symptoms.length > 0 && (
                  <div className="mb-2">
                    <p className="text-purple-200 text-xs mb-1">Symptoms:</p>
                    <div className="flex flex-wrap gap-2">
                      {cycle.symptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded-full"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {cycle.notes && (
                  <p className="text-purple-200 text-sm italic mt-2">
                    "{cycle.notes}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PeriodTracker;
