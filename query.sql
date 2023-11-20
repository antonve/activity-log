-- name: ListLogs :many
select * from logs
order by created_at desc;
