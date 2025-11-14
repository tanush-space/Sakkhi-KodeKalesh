-- Create voice_recordings table
CREATE TABLE IF NOT EXISTS voice_recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_url TEXT,
  transcript TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral', 'mixed')),
  sentiment_score DECIMAL(3,2),
  prompt TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE voice_recordings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own recordings
CREATE POLICY "Users can view own recordings"
  ON voice_recordings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own recordings
CREATE POLICY "Users can insert own recordings"
  ON voice_recordings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own recordings
CREATE POLICY "Users can delete own recordings"
  ON voice_recordings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_voice_recordings_user_id ON voice_recordings(user_id);
CREATE INDEX idx_voice_recordings_created_at ON voice_recordings(created_at DESC);
