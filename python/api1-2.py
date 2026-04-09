from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from typing import Optional, List
import os

#запуск  uvicorn api1-2:app --reload

DB_FILE = "siberia.db"
TABLE_NAME = "regions"

COLUMNS = {
    'id': 'id',
    'name': 'name',
    'vrp': 'vrp',
    'industries': 'industries',
    'forecast': 'forecast',
    'sources': 'sources',
    'centers': 'centers',
    'population': 'population',
    'salary': 'salary',
    'salary_source': 'salary_source'
}

EXAMPLE_REGION = {
    "id": 1,
    "name": "Красноярский край",
    "vrp": "~4,0 трлн руб. (Лидер СФО)",
    "industries": "Цветная металлургия, нефтедобыча",
    "forecast": "Рост за счет проекта «Восток Ойл». Статус опорного региона Арктики.",
    "sources": "https://ksonline.ru/584510/...\nhttps://www.pnp.ru/...\nhttps://myseldon.com/...",
    "centers": "Норильск (металлургия), Красноярск (маш-ние, гидроэнергетика), Ачинск (НПЗ), Лесосибирск (лес)",
    "population": "2 837 374 чел. (на 01.01.2025). Самый многочисленный в СФО.",
    "salary": "101 000 ₽ (2025 год) — 1-е место в СФО",
    "salary_source": "https://kras.mk.ru/economics/2026/01/27/srednyaya-zarplata-v-krasnoyarskom-krae-prevysila-100-tysyach-rubley-chto-stalo-luchshim-pokazatelem-v-sibiri.html"
}


class RegionResponse(BaseModel):
    id: int
    name: str
    vrp: str
    industries: str
    forecast: str
    sources: str
    centers: str
    population: str
    salary: str
    salary_source: str

    class Config:
        json_schema_extra = {"example": EXAMPLE_REGION}


class RegionsListResponse(BaseModel):
    total: int
    count: int
    offset: int
    limit: Optional[int]
    data: List[RegionResponse]

    class Config:
        json_schema_extra = {
            "example": {
                "total": 10,
                "count": 3,
                "offset": 0,
                "limit": 3,
                "data": [EXAMPLE_REGION]
            }
        }


class SearchResponse(BaseModel):
    query: str
    field_searched: str
    count: int
    results: List[RegionResponse]

    class Config:
        json_schema_extra = {
            "example": {
                "query": "нефть",
                "field_searched": "все поля",
                "count": 4,
                "results": [EXAMPLE_REGION]
            }
        }


app = FastAPI(
    title="📊 API регионов Сибири",
    description="""
    ## Данные по 10 регионам СФО

    ### Что внутри:
    - 🏭 ВРП за 2024-2025
    - 🔧 Ключевые отрасли
    - 📈 Прогноз на 2026
    - 🔗 Источники данных (включая ссылки)
    - 🏢 Промышленные центры
    - 👥 Демография
    - 💰 Средняя зарплата + источники
    """,
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _get_record_count():
    if not os.path.exists(DB_FILE):
        return 0
    try:
        conn = sqlite3.connect(DB_FILE)
        count = conn.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}").fetchone()[0]
        conn.close()
        return count
    except:
        return 0


def db_connect():
    if not os.path.exists(DB_FILE):
        raise HTTPException(503, "База не найдена, запустите load.py")
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


@app.on_event("startup")
def startup():
    if os.path.exists(DB_FILE):
        count = _get_record_count()
        print(f'База загружена, регионов: {count}')
        print('http://127.0.0.1:8000/docs')
    else:
        print('База не найдена! python load.py')


@app.get(
    "/",
    summary="Главная",
    tags=["Общее"]
)
def root():
    return {
        "name": "API Статистики Сибири",
        "version": "1.0.0",
        "status": "ok",
        "database": {
            "exists": os.path.exists(DB_FILE),
            "file": DB_FILE,
            "records": _get_record_count()
        },
        "endpoints": [
            {"method": "GET", "path": "/", "description": "Информация об API"},
            {"method": "GET", "path": "/regions", "description": "Получить все регионы"},
            {"method": "GET", "path": "/regions?limit=10&offset=0", "description": "Регионы с пагинацией"},
            {"method": "GET", "path": "/region/{id}", "description": "Получить регион по ID"},
            {"method": "GET", "path": "/search?q=текст", "description": "Поиск по всем полям"},
            {"method": "GET", "path": "/search?q=текст&field=поле", "description": "Поиск по конкретному полю"},
            {"method": "GET", "path": "/stats", "description": "Статистика базы данных"}
        ],
        "available_fields": list(COLUMNS.keys()),
        "docs_url": "/docs"
    }


@app.get(
    "/regions",
    summary="Все регионы",
    tags=["Регионы"],
    response_model=RegionsListResponse
)
def get_regions(
        limit: Optional[int] = Query(None, ge=1, description="Лимит записей"),
        offset: int = Query(0, ge=0, description="Смещение")
):
    conn = db_connect()
    c = conn.cursor()
    total = c.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}").fetchone()[0]
    query = f"SELECT * FROM {TABLE_NAME} ORDER BY name"
    if limit:
        query += f" LIMIT {limit} OFFSET {offset}"
    rows = c.execute(query).fetchall()
    conn.close()
    return {
        "total": total,
        "count": len(rows),
        "offset": offset,
        "limit": limit,
        "data": [dict(r) for r in rows]
    }


@app.get(
    "/region/{region_id}",
    summary="Регион по ID",
    tags=["Регионы"],
    response_model=RegionResponse
)
def get_region(
        region_id: int = Path(..., ge=1, le=10, description="ID от 1 до 10", example=1)
):
    conn = db_connect()
    row = conn.execute(f"SELECT * FROM {TABLE_NAME} WHERE id = ?", (region_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, f"Регион с id={region_id} не найден")
    return dict(row)


@app.get(
    "/search",
    summary="Поиск по базе",
    tags=["Поиск"],
    response_model=SearchResponse
)
def search(
        q: str = Query(..., min_length=1, description="Что ищем", example="нефть"),
        field: Optional[str] = Query(None, description=f"Поле: {', '.join(COLUMNS.keys())}", example="industries")
):
    conn = db_connect()
    c = conn.cursor()
    pattern = f"%{q}%"
    if field:
        if field not in COLUMNS:
            conn.close()
            raise HTTPException(400, f"Поле '{field}' не найдено. Доступно: {list(COLUMNS.keys())}")
        rows = c.execute(
            f"SELECT * FROM {TABLE_NAME} WHERE {field} LIKE ? ORDER BY name",
            (pattern,)
        ).fetchall()
    else:
        text_fields = ['name', 'vrp', 'industries', 'forecast', 'centers', 'population', 'salary']
        conditions = " OR ".join([f"{f} LIKE ?" for f in text_fields])
        rows = c.execute(
            f"SELECT * FROM {TABLE_NAME} WHERE {conditions} ORDER BY name",
            [pattern] * len(text_fields)
        ).fetchall()
    conn.close()
    return {
        "query": q,
        "field_searched": field if field else "все поля",
        "count": len(rows),
        "results": [dict(r) for r in rows]
    }


@app.get(
    "/stats",
    summary="Статистика БД",
    tags=["Общее"]
)
def stats():
    conn = db_connect()
    c = conn.cursor()
    total = c.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}").fetchone()[0]
    names = c.execute(f"SELECT name FROM {TABLE_NAME} ORDER BY name").fetchall()
    conn.close()
    return {
        "total_regions": total,
        "regions_list": [n[0] for n in names],
        "database_file": DB_FILE,
        "size_kb": round(os.path.getsize(DB_FILE) / 1024, 2)
    }


@app.exception_handler(404)
async def custom_404_handler(request, exc):
    return {"error": "Не найдено", "detail": str(exc)}


@app.exception_handler(500)
async def custom_500_handler(request, exc):
    return {"error": "Ошибка сервера", "detail": str(exc)}