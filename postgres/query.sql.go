// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.16.0
// source: query.sql

package postgres

import (
	"context"
)

const listLogs = `-- name: ListLogs :many
select id, content, category, done_at from logs
order by created_at desc
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
