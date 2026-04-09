.PHONY: up down build logs restart db-shell

up:
	docker compose up --build -d

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

restart:
	docker compose down && docker compose up --build -d

db-shell:
	docker compose exec db psql -U stockmanager -d stockmanager

backend-logs:
	docker compose logs -f backend

frontend-logs:
	docker compose logs -f frontend
