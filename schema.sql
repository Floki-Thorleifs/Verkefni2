CREATE TABLE applications
(
  id SERIAL PRIMARY KEY ,
  name varchar
  (64) not null,
  email varchar
  (64) not null,
  phone varchar
  (16) not null,
  about varchar
  (1000) not null,
  job varchar
  (64) not null,
  processed BOOL
);