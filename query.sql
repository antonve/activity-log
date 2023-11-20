-- name: ListLogs :many
select * from logs
order by done_at desc;

-- name: GetLog :one
select * from logs
where id = sqlc.arg('id');

-- name: CreateLog :exec
insert into logs
(id, content, category, done_at)
values (sqlc.arg('id'), sqlc.arg('content'), sqlc.arg('category'), sqlc.arg('done_at'));