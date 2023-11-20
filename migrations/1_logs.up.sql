create table logs (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  category varchar(255) not null,
  done_at date not null default current_date
);