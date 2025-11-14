-- Create period_cycles table
CREATE TABLE IF NOT EXISTS period_cycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  cycle_length INTEGER,
  flow_intensity TEXT CHECK (flow_intensity IN ('light', 'medium', 'heavy')),
  symptoms TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE period_cycles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own cycles
CREATE POLICY "Users can view own cycles"
  ON period_cycles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own cycles
CREATE POLICY "Users can insert own cycles"
  ON period_cycles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own cycles
CREATE POLICY "Users can update own cycles"
  ON period_cycles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own cycles
CREATE POLICY "Users can delete own cycles"
  ON period_cycles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX idx_period_cycles_user_id ON period_cycles(user_id);
CREATE INDEX idx_period_cycles_start_date ON period_cycles(start_date DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_period_cycles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_period_cycles_timestamp
  BEFORE UPDATE ON period_cycles
  FOR EACH ROW
  EXECUTE FUNCTION update_period_cycles_updated_at();
