-- Google Calendar 연동을 위한 Supabase 테이블 수정 SQL

-- 1. events 테이블에 google_calendar_id 컬럼 추가
ALTER TABLE events ADD COLUMN IF NOT EXISTS google_calendar_id TEXT;

-- 2. google_calendar_id에 인덱스 추가 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_events_google_calendar_id ON events(google_calendar_id);

-- 3. Google Calendar 동기화 상태를 추적하는 테이블 생성
CREATE TABLE IF NOT EXISTS google_sync_status (
  id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  sync_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, synced, failed, deleted
  last_sync_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. google_sync_status 테이블 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_google_sync_event_id ON google_sync_status(event_id);
CREATE INDEX IF NOT EXISTS idx_google_sync_status ON google_sync_status(sync_status);

-- 5. 사용자별 Google Calendar 설정 테이블 생성
CREATE TABLE IF NOT EXISTS user_google_settings (
  id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  google_calendar_id VARCHAR(255) DEFAULT '4b2ce57b1b95529756d82e4f4f131e42903fe123cf0bde17b99cf4dedf74eb4c@group.calendar.google.com',
  sync_enabled BOOLEAN DEFAULT true,
  auto_sync BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  access_token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 동기화 로그 테이블 생성 (선택사항 - 디버깅용)
CREATE TABLE IF NOT EXISTS google_sync_logs (
  id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL, -- create, update, delete
  google_event_id TEXT,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 동기화 로그 인덱스
CREATE INDEX IF NOT EXISTS idx_google_sync_logs_event_id ON google_sync_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_google_sync_logs_created_at ON google_sync_logs(created_at);

-- 8. Updated_at 트리거 함수 생성 (테이블 수정시 updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. 트리거 적용
DROP TRIGGER IF EXISTS update_google_sync_status_updated_at ON google_sync_status;
CREATE TRIGGER update_google_sync_status_updated_at
    BEFORE UPDATE ON google_sync_status
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_google_settings_updated_at ON user_google_settings;
CREATE TRIGGER update_user_google_settings_updated_at
    BEFORE UPDATE ON user_google_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. RLS (Row Level Security) 정책 설정 (보안)
ALTER TABLE google_sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_google_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_sync_logs ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 자신의 데이터만 접근 가능하도록 설정
-- (실제 사용시에는 user_id 기반으로 정책을 더 세밀하게 설정해야 함)