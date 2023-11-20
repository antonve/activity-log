init:
	go install github.com/cosmtrek/air@v1.29.0
	go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.15.2

generate: generate_sql

generate_sql:
	go generate

migrate:
	MIGRATION_ARGS="up" make migrate_docker

migrate_docker:
	docker compose exec api bash -c "go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.15.2"
	docker compose exec api bash -c "migrate -source file://migrations -database postgres://root:hunter2@postgres:5432/activitylog?sslmode=disable $(MIGRATION_ARGS)"

run:
	docker compose up