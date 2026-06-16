.PHONY: install install-backend install-frontend migrate run-backend run-frontend run

install: install-backend install-frontend

install-backend:
	cd backend && python -m venv venv && ./venv/Scripts/pip install -r requirements.txt
	cp -n backend/.env.example backend/.env 2>/dev/null || true

install-frontend:
	cd frontend && npm install
	cp -n frontend/.env.example frontend/.env 2>/dev/null || true

migrate:
	cd backend && ./venv/Scripts/python manage.py migrate

run-backend:
	cd backend && ./venv/Scripts/python manage.py runserver

run-frontend:
	cd frontend && npm run dev

run:
	@echo "Run 'make run-backend' and 'make run-frontend' in separate terminals"
