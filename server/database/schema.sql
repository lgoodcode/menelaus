-- Enable pgcrypto extension for encrypting passwords
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Enable uuid-ossp extension for generating uuids
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cascade drop tables and referenced tables and indexes
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS library CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;

-- Re-create the progress enum type (requires single quotes for values)
DROP TYPE IF EXISTS progress;
CREATE TYPE progress AS ENUM ('not started', 'in progress', 'completed');

CREATE TABLE users (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  -- Will need to use crypt("PASSWORD", gen_salt("bf")) to encrypt password when inserting
  -- and use crypt("SUBMITTED_PASSWORD", password) to compare.
  "password" TEXT NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Creates a table that contains the users added games and their progress
CREATE TABLE library (
  -- Primary key, serial to increment for each record
  "id" SERIAL NOT NULL PRIMARY KEY,
  -- The id of the user that added the game
  "user_id" uuid NOT NULL REFERENCES users("id"),
  -- The id of the game
  "game_id" INT NOT NULL,
  -- The progress of the game
  "progress" progress NOT NULL DEFAULT 'not started', -- requires single quote for value
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Creates a table that contains the users games they want to get
CREATE TABLE wishlist (
  -- Primary key, serial to increment for each record
  "id" SERIAL NOT NULL PRIMARY KEY,
  -- The id of the user that added the game
  "user_id" uuid NOT NULL REFERENCES users("id"),
  -- The id of the game
  "game_id" INT NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reset indexes (the cascade table drop will have removed them)
-- The email index is used to improve the check if the email already exists
CREATE INDEX idx_users_email ON users("email");
CREATE INDEX idx_library_id ON library("user_id");
CREATE INDEX idx_wishlist_id ON wishlist("user_id");

-- Re-create the function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Re-create triggers to update timestamps for all records on all tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_library_updated_at ON library;

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_library_timestamp
BEFORE UPDATE ON library
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_library_timestamp
BEFORE UPDATE ON wishlist
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();
