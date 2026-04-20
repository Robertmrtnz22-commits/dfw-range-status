-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id INT,
  type TEXT,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE surface_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id INT,
  type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE busy_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id INT,
  type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id INT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accuracy_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id INT,
  was_accurate BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);