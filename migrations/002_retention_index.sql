CREATE INDEX IF NOT EXISTS app_mental_load__checkins_retention_idx
  ON app_mental_load__checkins (created_at, id);
