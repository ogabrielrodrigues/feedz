create table if not exists answer (
  answer_id uuid primary key default uuid_generate_v4(),
  answered_by text not null references employee (registry),
  content text not null,
  answered_at timestamp not null default now()
);

---- create above / drop below ----

drop table if exists answer;
