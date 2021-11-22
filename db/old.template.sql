CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "user" (
    id          SERIAL  PRIMARY KEY,
    username    VARCHAR NOT NULL,
    password    VARCHAR NOT NULL,
    type        VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS organization (
    id          SERIAL  PRIMARY KEY,
    name        VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS section (
    id          SERIAL  PRIMARY KEY,
    name        VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_user (
    id          SERIAL  PRIMARY KEY,
    username    VARCHAR NOT NULL,
    password    VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS door (
    id          SERIAL  PRIMARY KEY,
    name        VARCHAR NOT NULL,
    hash        VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS user_hash (
    id          SERIAL  PRIMARY KEY,
    user_id     SERIAL  REFERENCES  "user"(id) NOT NULL,
    hash        VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS org_section (
    id          SERIAL  PRIMARY KEY,
    org_id      SERIAL  REFERENCES  organization(id) NOT NULL,
    section_id  SERIAL  REFERENCES  section(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS section_door (
    id          SERIAL  PRIMARY KEY,
    section_id  SERIAL  REFERENCES  section(id) NOT NULL,
    door_id     SERIAL  REFERENCES  door(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    id          SERIAL  PRIMARY KEY,
    date        timestamp without time zone DEFAULT now(),
    door_id     SERIAL REFERENCES door(id) NOT NULL,
    org_id      SERIAL REFERENCES organization(id) NOT NULL,
    section_id  SERIAL REFERENCES section(id) NOT NULL,
    user_id     SERIAL REFERENCES "user"(id) NOT NULL
);