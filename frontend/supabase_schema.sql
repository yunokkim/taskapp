-- 페르소나 테이블
CREATE TABLE personas (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  name VARCHAR NOT NULL,
  color VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 반복 타입 열거형
CREATE TYPE repeat_type AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY');

-- 알림 타입 열거형  
CREATE TYPE notification_type AS ENUM ('EMAIL', 'PUSH');

-- 이벤트 테이블
CREATE TABLE events (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  title VARCHAR NOT NULL,
  description TEXT,
  start TIMESTAMP WITH TIME ZONE NOT NULL,
  "end" TIMESTAMP WITH TIME ZONE,
  persona_id VARCHAR NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  repeat repeat_type DEFAULT 'NONE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 알림 설정 테이블
CREATE TABLE notification_settings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  event_id VARCHAR NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  minutes_before INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 업데이트 트리거 생성
CREATE TRIGGER personas_updated_at
  BEFORE UPDATE ON personas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events  
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 초기 페르소나 데이터 삽입
INSERT INTO personas (name, color, description) VALUES 
('업무', '#3B82F6', '업무 관련 일정'),
('개인', '#10B981', '개인적인 일정'),
('가족', '#F59E0B', '가족과의 시간'),
('운동', '#EF4444', '운동 및 건강 관리');