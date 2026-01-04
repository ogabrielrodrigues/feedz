create table if not exists feedback (
  feedback_id uuid primary key default uuid_generate_v4(),
  employee_registry text not null references employee (registry),
  content text not null,
  answered boolean default false,
  answer_id uuid references answer (answer_id),
  sent_at timestamp default now(),
  active boolean default true
);

---- create above / drop below ----

drop table if exists feedback;
