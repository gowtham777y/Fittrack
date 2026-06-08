CREATE TABLE gyms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  location    TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id      UUID REFERENCES gyms(id),
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  qr_code     VARCHAR(255) UNIQUE NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE staff (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id       UUID REFERENCES gyms(id),
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  salary       DECIMAL(10,2),
  shift_start  TIME,
  shift_end    TIME,
  qr_code      VARCHAR(255) UNIQUE NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE checkins (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id       UUID REFERENCES gyms(id),
  person_id    UUID NOT NULL,
  person_type  VARCHAR(10) CHECK (person_type IN ('member', 'staff')),
  checked_in   TIMESTAMP DEFAULT NOW(),
  checked_out  TIMESTAMP
);

CREATE TABLE payments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id   UUID REFERENCES members(id),
  amount      DECIMAL(10,2) NOT NULL,
  paid_on     TIMESTAMP DEFAULT NOW(),
  status      VARCHAR(20) CHECK (status IN ('paid', 'pending', 'failed'))
);