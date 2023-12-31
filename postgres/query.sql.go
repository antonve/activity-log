// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.16.0
// source: query.sql

package postgres

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const createLog = `-- name: CreateLog :one
insert into logs
(id, content, category, done_at)
values ($1, $2, $3, $4)
on conflict (id) do
update set
  content = $2,
  category = $3,
  done_at = $4
returning id, content, category, done_at, created_at
`

type CreateLogParams struct {
	ID       uuid.UUID
	Content  string
	Category string
	DoneAt   time.Time
}

func (q *Queries) CreateLog(ctx context.Context, arg CreateLogParams) (Log, error) {
	row := q.db.QueryRowContext(ctx, createLog,
		arg.ID,
		arg.Content,
		arg.Category,
		arg.DoneAt,
	)
	var i Log
	err := row.Scan(
		&i.ID,
		&i.Content,
		&i.Category,
		&i.DoneAt,
		&i.CreatedAt,
	)
	return i, err
}

const deleteLog = `-- name: DeleteLog :exec
delete from logs
where id = $1
`

func (q *Queries) DeleteLog(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteLog, id)
	return err
}

const getLog = `-- name: GetLog :one
select id, content, category, done_at, created_at from logs
where id = $1
`

func (q *Queries) GetLog(ctx context.Context, id uuid.UUID) (Log, error) {
	row := q.db.QueryRowContext(ctx, getLog, id)
	var i Log
	err := row.Scan(
		&i.ID,
		&i.Content,
		&i.Category,
		&i.DoneAt,
		&i.CreatedAt,
	)
	return i, err
}

const listLogs = `-- name: ListLogs :many
select id, content, category, done_at, created_at from logs
order by done_at desc, created_at desc
`

func (q *Queries) ListLogs(ctx context.Context) ([]Log, error) {
	rows, err := q.db.QueryContext(ctx, listLogs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Log
	for rows.Next() {
		var i Log
		if err := rows.Scan(
			&i.ID,
			&i.Content,
			&i.Category,
			&i.DoneAt,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
