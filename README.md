# Кейс: Зарплатные проекты. 

## Описание

### Frontend: React + TS;
### Backend: NestJS + TS + PostgreSQL;
### Сервисы: Python + FastAPI;


#### Frontend: http://localhost:5173/
#### API Backend: http://localhost:3000/api/docs#/
#### API Services: http://localhost:8000/docs


## Frontend

```bash
$ cd frontend

$ npm install

$ npm run dev
```

## Backend

### Отредактировать файл .env под свои настройки БД.

```bash
$ cd backend

$ npm install

$ npm run start:dev
```

## Services

```bash
$ cd python

$ pip install fastapi uvicorn pydantic

$ uvicorn api:app --reload
```

