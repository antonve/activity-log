create table logs (
  id bigserial primary key,
  content text not null,
  category varchar(255) not null,
  done_at date not null default current_date
);