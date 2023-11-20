-- name: ListLogs :many
select * from logs
order by created_at desc;

-- name: CreateLog :exec
insert into logs
(id, content, category, done_at)
values (sqlc.arg('id'), sqlc.arg('content'), sqlc.arg('category'), sqlc.arg('done_at'));