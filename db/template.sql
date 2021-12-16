CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS organization (
    id          SERIAL  PRIMARY KEY,
    name        VARCHAR NOT NULL
);


CREATE TABLE IF NOT EXISTS section (
    id          SERIAL  PRIMARY KEY,
    name        VARCHAR NOT NULL,
    org_id      SERIAL  REFERENCES  organization(id) NOT NULL

);

CREATE TABLE IF NOT EXISTS door (
    id          SERIAL  PRIMARY KEY,
    name        VARCHAR NOT NULL,
    hash        VARCHAR NOT NULL,
    org_id      SERIAL  REFERENCES  organization(id) NOT NULL,
    section_id  SERIAL  REFERENCES  section(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
    id          SERIAL  PRIMARY KEY,
    username    VARCHAR NOT NULL,
    password    VARCHAR NOT NULL,
    type        VARCHAR NOT NULL,
    mac_addr    VARCHAR NOT NULL,
    org_id      SERIAL  REFERENCES  organization(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS auth (
    id          SERIAL  PRIMARY KEY,
    user_id     SERIAL  REFERENCES  "user"(id) NOT NULL,
    door_id     SERIAL  REFERENCES  door(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    id          SERIAL  PRIMARY KEY,
    date        timestamp without time zone DEFAULT now(),
    method      VARCHAR NOT NULL,
    door_id     INTEGER NOT NULL,
    org_id      INTEGER NOT NULL,
    section_id  INTEGER NOT NULL,
    user_id     INTEGER NOT NULL,
);

----------

CREATE TABLE IF NOT EXISTS admin_user (
    id          SERIAL  PRIMARY KEY,
    username    VARCHAR NOT NULL,
    password    VARCHAR NOT NULL,
    org_id      SERIAL  REFERENCES  organization(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_hash (
    id          SERIAL  PRIMARY KEY,
    user_id     SERIAL  REFERENCES  "user"(id) NOT NULL,
    hash        VARCHAR NOT NULL
);