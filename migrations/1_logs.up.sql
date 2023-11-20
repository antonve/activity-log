create table logs (
  id bigserial primary key,
  content text not null,

  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp default NULL
);