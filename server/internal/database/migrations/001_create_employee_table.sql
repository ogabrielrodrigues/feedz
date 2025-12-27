create extension if not exists "uuid-ossp";

create table if not exists employee (
  registry text primary key not null,
  fullname text not null,
  email text unique not null,
  sector text not null,
  unit text not null,
  administrator boolean not null default false,
  password text not null
);

---- create above / drop below ----

drop table if exists employee;
