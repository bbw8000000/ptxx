-- Schema for the self-hosted auth + comments backend (Cloudflare D1 / SQLite).
--
-- This replaces Firebase Auth + the Firestore `comments` collection. The
-- authorization model used to live in firestore.rules; it now lives in
-- functions/_lib + the CHECK constraints below.
--
-- Length semantics: SQLite length(TEXT) counts characters, but Firestore's
-- size() counted UTF-8 bytes. The application layer enforces the byte lengths
-- (matching the old behaviour); the CHECKs here are a looser backstop so a
-- direct SQL insert cannot store something obviously absurd.

CREATE TABLE users (
  id             TEXT PRIMARY KEY,
  email          TEXT NOT NULL,
  email_lower    TEXT NOT NULL,
  display_name   TEXT NOT NULL CHECK (length(display_name) BETWEEN 1 AND 200),
  photo_url      TEXT NOT NULL DEFAULT '' CHECK (length(photo_url) <= 2048),
  password_hash  TEXT NOT NULL,
  password_salt  TEXT NOT NULL,
  kdf_iterations INTEGER NOT NULL,
  created_at     INTEGER NOT NULL
);

-- Email uniqueness is the account identity; store the lowercased form so the
-- lookup is a single indexed equality test.
CREATE UNIQUE INDEX idx_users_email_lower ON users (email_lower);

-- Server-side admin registry. Was admins/{uid} with read denied to everyone.
CREATE TABLE admins (
  user_id    TEXT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  note       TEXT NOT NULL DEFAULT ''
);

CREATE TABLE sessions (
  token_hash   TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at   INTEGER NOT NULL,
  expires_at   INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions (user_id);
CREATE INDEX idx_sessions_expires_at ON sessions (expires_at);

CREATE TABLE comments (
  id           TEXT PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 128 AND id GLOB '[A-Za-z0-9_-]*'),
  page_id      TEXT NOT NULL CHECK (length(page_id) BETWEEN 1 AND 512),
  -- NULL for migrated Firestore rows: a Firebase UID is not a new account, so
  -- those comments have no owner and can only be removed by an admin.
  user_id      TEXT REFERENCES users (id) ON DELETE SET NULL,
  legacy_uid   TEXT,
  display_name TEXT NOT NULL CHECK (length(display_name) BETWEEN 1 AND 200),
  photo_url    TEXT NOT NULL DEFAULT '' CHECK (length(photo_url) <= 2048),
  -- Newlines are meaningful in the renderer, which turns them into <br>.
  content      TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  status       TEXT NOT NULL CHECK (status IN ('approved', 'pending', 'rejected')),
  created_at   INTEGER NOT NULL
);

-- Public reads are always "approved for this page, newest first".
CREATE INDEX idx_comments_page_status_created ON comments (page_id, status, created_at DESC);
-- Admin list is "all statuses, newest first".
CREATE INDEX idx_comments_status_created ON comments (status, created_at DESC);
CREATE INDEX idx_comments_user_id ON comments (user_id);

-- Fixed-window counters. One row per (bucket, window); bucket looks like
-- "login:ip:1.2.3.4" or "login:email:a@b.c".
CREATE TABLE rate_limits (
  bucket       TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count        INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, window_start)
);
