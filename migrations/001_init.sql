CREATE TABLE IF NOT EXISTS app_mental_load__partner_config (
  member_id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL,
  session_id TEXT DEFAULT '',
  created_at TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS app_mental_load__cards (
  id TEXT PRIMARY KEY,
  created_by TEXT NOT NULL,
  session_id TEXT DEFAULT '',
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'home',
  owner_id TEXT DEFAULT '',
  owner_name TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS app_mental_load__checkins (
  id TEXT PRIMARY KEY,
  created_by TEXT NOT NULL,
  created_by_name TEXT DEFAULT '',
  session_id TEXT DEFAULT '',
  note TEXT DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS app_mental_load__cards_owner_idx ON app_mental_load__cards(created_by, category);
CREATE INDEX IF NOT EXISTS app_mental_load__checkins_at_idx ON app_mental_load__checkins(created_at);
