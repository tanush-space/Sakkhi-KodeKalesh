-- Create mood_reflections table
CREATE TABLE IF NOT EXISTS mood_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood TEXT NOT NULL,
  mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
  tags TEXT[],
  note TEXT,
  sound TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mood_reflections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own reflections
CREATE POLICY "Users can view own reflections"
  ON mood_reflections
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own reflections
CREATE POLICY "Users can insert own reflections"
  ON mood_reflections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reflections
CREATE POLICY "Users can update own reflections"
  ON mood_reflections
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own reflections
CREATE POLICY "Users can delete own reflections"
  ON mood_reflections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX idx_mood_reflections_user_id ON mood_reflections(user_id);
CREATE INDEX idx_mood_reflections_date ON mood_reflections(date DESC);
CREATE INDEX idx_mood_reflections_created_at ON mood_reflections(created_at DESC);
