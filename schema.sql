CREATE TABLE stuff (
  id      SERIAL PRIMARY KEY,
  author  VARCHAR(100) NOT NULL,
  title   VARCHAR(100) NOT NULL,
  body    TEXT         NOT NULL
);
