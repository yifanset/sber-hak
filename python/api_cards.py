from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from typing import Optional, List
import os

#запуск uvicorn api_cards:app --reload

DB_FILE = "cards.db"
TABLE_NAME = "cards"

COLUMNS = {
    'id': 'id',
    'bank': 'bank',
    'percent_on_balance': 'percent_on_balance',
    'savings_account': 'savings_account',
    'cashback': 'cashback',
    'annual_fee': 'annual_fee'
}

FIELD_DESCRIPTIONS = {
    'bank': 'Название банка',
    'percent_on_balance': 'Процент на остаток по карте',
    'savings_account': 'Ставка по накопительному счету',
    'cashback': 'Кешбэк или баллы',
    'annual_fee': 'Стоимость годового обслуживания'
}

EXAMPLE_CARD = {
    "id": 8,
    "bank": "Сбербанк",
    "percent_on_balance": "нет",
    "savings_account": "до 13%",
    "cashback": "до 15000/мес.",
    "annual_fee": "бесплатно"
}


class CardResponse(BaseModel):
    id: int
    bank: str
    percent_on_balance: str
    savings_account: str
    cashback: str
    annual_fee: str

    class Config:
        json_schema_extra = {"example": EXAMPLE_CARD}


class CardsListResponse(BaseModel):
    total: int
    count: int
    offset: int
    limit: Optional[int]
    data: List[CardResponse]

    class Config:
        json_schema_extra = {
            "example": {
                "total": 15,
                "count": 5,
                "offset": 0,
                "limit": 5,
                "data": [EXAMPLE_CARD]
            }
        }


class SearchResponse(BaseModel):
    query: str
    field_searched: str
    count: int
    results: List[CardResponse]


class CompareResponse(BaseModel):
    banks: List[str]
    comparison: dict

    class Config:
        json_schema_extra = {
            "example": {
                "banks": ["Сбербанк", "Т-Банк", "ВТБ"],
                "comparison": {
                    "percent_on_balance": {
                        "Сбербанк": "нет",
                        "Т-Банк": "нет",
                        "ВТБ": "нет"
                    },
                    "savings_account": {
                        "Сбербанк": "до 13%",
                        "Т-Банк": "до 7%",
                        "ВТБ": "до 16%"
                    },
                    "cashback": {
                        "Сбербанк": "до 15000/мес.",
                        "Т-Банк": "до 15%",
                        "ВТБ": "до 15%"
                    },
                    "annual_fee": {
                        "Сбербанк": "бесплатно",
                        "Т-Банк": "1 990–3 588 ₽",
                        "ВТБ": "0–47 880 ₽"
                    }
                }
            }
        }


app = FastAPI(
    title="💳 API зарплатных карт",
    description="""
    ## Сравнение зарплатных карт банков

    ### Что внутри:
    - 🏦 Название банка
    - 💰 Процент на остаток
    - 📈 Ставка по накопительному счету
    - 🎁 Кешбэк или баллы
    - 💳 Стоимость годового обслуживания

    ### Всего 15 банков
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
        raise HTTPException(503, "База не найдена, запустите load_cards.py")
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


@app.on_event("startup")
def startup():
    if os.path.exists(DB_FILE):
        count = _get_record_count()
        print(f'База загружена, карт: {count}')
        print('http://127.0.0.1:8000/docs')
    else:
        print('База не найдена! python load_cards.py')


@app.get(
    "/",
    summary="Главная",
    tags=["Общее"]
)
def root():
    return {
        "name": "API зарплатных карт",
        "version": "1.0.0",
        "status": "ok",
        "database": {
            "exists": os.path.exists(DB_FILE),
            "file": DB_FILE,
            "records": _get_record_count()
        },
        "endpoints": [
            {"method": "GET", "path": "/", "description": "Информация об API"},
            {"method": "GET", "path": "/cards", "description": "Все карты"},
            {"method": "GET", "path": "/cards?limit=5&offset=0", "description": "С пагинацией"},
            {"method": "GET", "path": "/card/{id}", "description": "Карта по ID"},
            {"method": "GET", "path": "/card/bank/{name}", "description": "Карта по названию банка"},
            {"method": "GET", "path": "/search?q=бесплатно", "description": "Поиск по всем полям"},
            {"method": "GET", "path": "/search?q=15&field=cashback", "description": "Поиск по конкретному полю"},
            {"method": "GET", "path": "/compare?banks=Сбербанк,ВТБ,Т-Банк", "description": "Сравнение карт"},
            {"method": "GET", "path": "/best", "description": "Лучшие предложения по категориям"},
            {"method": "GET", "path": "/stats", "description": "Статистика"}
        ],
        "available_fields": list(COLUMNS.keys()),
        "docs_url": "/docs"
    }


@app.get(
    "/cards",
    summary="Все карты",
    tags=["Карты"],
    response_model=CardsListResponse
)
def get_cards(
        limit: Optional[int] = Query(None, ge=1, description="Лимит записей"),
        offset: int = Query(0, ge=0, description="Смещение"),
        free_only: bool = Query(False, description="Только бесплатные карты")
):
    conn = db_connect()
    c = conn.cursor()

    if free_only:
        total = c.execute(
            f"SELECT COUNT(*) FROM {TABLE_NAME} WHERE annual_fee = 'бесплатно'"
        ).fetchone()[0]
        query = f"SELECT * FROM {TABLE_NAME} WHERE annual_fee = 'бесплатно' ORDER BY bank"
    else:
        total = c.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}").fetchone()[0]
        query = f"SELECT * FROM {TABLE_NAME} ORDER BY bank"

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
    "/card/{card_id}",
    summary="Карта по ID",
    tags=["Карты"],
    response_model=CardResponse
)
def get_card(
        card_id: int = Path(..., ge=1, le=15, description="ID от 1 до 15", example=8)
):
    conn = db_connect()
    row = conn.execute(f"SELECT * FROM {TABLE_NAME} WHERE id = ?", (card_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, f"Карта с id={card_id} не найдена")
    return dict(row)


@app.get(
    "/card/bank/{bank_name}",
    summary="Карта по названию банка",
    tags=["Карты"],
    response_model=CardResponse
)
def get_card_by_bank(bank_name: str):
    conn = db_connect()
    row = conn.execute(
        f"SELECT * FROM {TABLE_NAME} WHERE LOWER(bank) LIKE LOWER(?)",
        (f"%{bank_name}%",)
    ).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, f"Банк '{bank_name}' не найден")
    return dict(row)


@app.get(
    "/search",
    summary="Поиск по базе",
    tags=["Поиск"],
    response_model=SearchResponse
)
def search(
        q: str = Query(..., min_length=1, description="Что ищем", example="бесплатно"),
        field: Optional[str] = Query(None, description=f"Поле: {', '.join(COLUMNS.keys())}", example="annual_fee")
):
    conn = db_connect()
    c = conn.cursor()
    pattern = f"%{q}%"

    if field:
        if field not in COLUMNS:
            conn.close()
            raise HTTPException(400, f"Поле '{field}' не найдено. Доступно: {list(COLUMNS.keys())}")
        rows = c.execute(
            f"SELECT * FROM {TABLE_NAME} WHERE {field} LIKE ? ORDER BY bank",
            (pattern,)
        ).fetchall()
    else:
        text_fields = ['bank', 'percent_on_balance', 'savings_account', 'cashback', 'annual_fee']
        conditions = " OR ".join([f"{f} LIKE ?" for f in text_fields])
        rows = c.execute(
            f"SELECT * FROM {TABLE_NAME} WHERE {conditions} ORDER BY bank",
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
    "/compare",
    summary="Сравнение карт",
    tags=["Сравнение"],
    response_model=CompareResponse
)
def compare_cards(
        banks: str = Query(..., description="Список банков через запятую", example="Сбербанк,ВТБ,Т-Банк")
):
    bank_list = [b.strip() for b in banks.split(',')]

    conn = db_connect()
    c = conn.cursor()

    result = {}
    found_banks = []

    for bank in bank_list:
        row = c.execute(
            f"SELECT * FROM {TABLE_NAME} WHERE LOWER(bank) LIKE LOWER(?)",
            (f"%{bank}%",)
        ).fetchone()

        if row:
            found_banks.append(dict(row)['bank'])

    if len(found_banks) < 2:
        conn.close()
        raise HTTPException(400, "Нужно минимум 2 банка для сравнения")

    comparison = {
        "percent_on_balance": {},
        "savings_account": {},
        "cashback": {},
        "annual_fee": {}
    }

    for bank in found_banks:
        row = c.execute(
            f"SELECT * FROM {TABLE_NAME} WHERE bank = ?",
            (bank,)
        ).fetchone()
        d = dict(row)
        comparison["percent_on_balance"][bank] = d["percent_on_balance"]
        comparison["savings_account"][bank] = d["savings_account"]
        comparison["cashback"][bank] = d["cashback"]
        comparison["annual_fee"][bank] = d["annual_fee"]

    conn.close()

    return {
        "banks": found_banks,
        "comparison": comparison
    }


@app.get(
    "/best",
    summary="Ранжирование карт по заданным критериям",
    tags=["Сравнение"]
)
def best_offers(
        weight_free: float = Query(1.0, ge=0, description="Вес критерия 'бесплатное обслуживание'"),
        weight_interest: float = Query(1.0, ge=0, description="Вес критерия 'процент на остаток'"),
        weight_savings: float = Query(1.0, ge=0, description="Вес критерия 'ставка по накопительному'"),
        weight_cashback: float = Query(1.0, ge=0, description="Вес критерия 'кешбэк'")
):
    """
    ## Ранжирование карт с учётом весов критериев

    Задайте веса от 0 до бесконечности:
    - 0 = критерий не важен
    - 1 = нормальная важность
    - 2 = очень важно

    Пример: `/best?weight_free=2&weight_cashback=3` — кешбэк важнее всего, бесплатность тоже важна
    """
    import re

    conn = db_connect()
    c = conn.cursor()

    rows = c.execute("SELECT * FROM cards").fetchall()
    conn.close()

    total_weight = weight_free + weight_interest + weight_savings + weight_cashback
    if total_weight == 0:
        raise HTTPException(400, "Сумма весов должна быть больше 0")

    w_free = weight_free / total_weight
    w_interest = weight_interest / total_weight
    w_savings = weight_savings / total_weight
    w_cashback = weight_cashback / total_weight

    results = []

    for row in rows:
        bank = dict(row)
        scores = {}

        is_free = 1 if bank['annual_fee'] == 'бесплатно' else 0
        scores['free'] = is_free

        interest_value = 0
        if bank['percent_on_balance'] != 'нет':
            match = re.search(r'(\d+\.?\d*)', bank['percent_on_balance'])
            if match:
                interest_value = float(match.group(1))
        scores['interest_raw'] = interest_value

        savings_value = 0
        if bank['savings_account'] != 'нет':
            match = re.search(r'(\d+\.?\d*)', bank['savings_account'])
            if match:
                savings_value = float(match.group(1))
        scores['savings_raw'] = savings_value

        cashback_value = 0
        cashback_str = bank['cashback']
        if cashback_str not in ['нет', 'есть']:
            match = re.search(r'(\d+\.?\d*)', cashback_str)
            if match:
                cashback_value = float(match.group(1))
                if '%' in cashback_str:
                    cashback_value = cashback_value  # процент
        elif cashback_str == 'есть':
            cashback_value = 1  # символическое значение
        scores['cashback_raw'] = cashback_value

        results.append({
            'bank': bank['bank'],
            'raw_scores': scores
        })


    max_interest = max([r['raw_scores']['interest_raw'] for r in results]) if results else 1
    max_savings = max([r['raw_scores']['savings_raw'] for r in results]) if results else 1
    max_cashback = max([r['raw_scores']['cashback_raw'] for r in results]) if results else 1

    for r in results:
        r['normalized'] = {
            'free': r['raw_scores']['free'],
            'interest': r['raw_scores']['interest_raw'] / max_interest if max_interest > 0 else 0,
            'savings': r['raw_scores']['savings_raw'] / max_savings if max_savings > 0 else 0,
            'cashback': r['raw_scores']['cashback_raw'] / max_cashback if max_cashback > 0 else 0
        }

        r['total_score'] = (
                w_free * r['normalized']['free'] +
                w_interest * r['normalized']['interest'] +
                w_savings * r['normalized']['savings'] +
                w_cashback * r['normalized']['cashback']
        )

        r['total_score'] = round(r['total_score'] * 100, 2)  # в процентах от максимума

        del r['raw_scores']

    results.sort(key=lambda x: x['total_score'], reverse=True)

    winner = results[0] if results else None

    if winner:
        conclusion = f"🏆 Лучшая карта: {winner['bank']} (общий балл: {winner['total_score']}%)"


        reasons = []
        if w_free > 0 and winner['normalized']['free'] == 1:
            reasons.append("бесплатное обслуживание")
        if w_interest > 0 and winner['normalized']['interest'] > 0.8:
            reasons.append("высокий процент на остаток")
        if w_savings > 0 and winner['normalized']['savings'] > 0.8:
            reasons.append("высокая ставка по накопительному")
        if w_cashback > 0 and winner['normalized']['cashback'] > 0.8:
            reasons.append("выгодный кешбэк")

        if reasons:
            conclusion += f"\n💡 Сильные стороны: {', '.join(reasons)}"
    else:
        conclusion = "Нет данных для анализа"

    return {
        "criteria_weights": {
            "free": {"weight": weight_free, "normalized": round(w_free, 3)},
            "interest": {"weight": weight_interest, "normalized": round(w_interest, 3)},
            "savings": {"weight": weight_savings, "normalized": round(w_savings, 3)},
            "cashback": {"weight": weight_cashback, "normalized": round(w_cashback, 3)}
        },
        "ranking": results[:5],  # Топ-5
        "all_results": results,
        "conclusion": conclusion
    }


@app.get(
    "/stats",
    summary="Статистика",
    tags=["Общее"]
)
def stats():
    conn = db_connect()
    c = conn.cursor()

    total = c.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}").fetchone()[0]
    free_count = c.execute(
        f"SELECT COUNT(*) FROM {TABLE_NAME} WHERE annual_fee = 'бесплатно'"
    ).fetchone()[0]
    with_cashback = c.execute(
        f"SELECT COUNT(*) FROM {TABLE_NAME} WHERE cashback != 'нет' AND cashback != 'есть'"
    ).fetchone()[0]

    banks = c.execute(f"SELECT bank FROM {TABLE_NAME} ORDER BY bank").fetchall()

    conn.close()

    return {
        "total_cards": total,
        "free_cards": free_count,
        "paid_cards": total - free_count,
        "cards_with_cashback": with_cashback,
        "banks_list": [b[0] for b in banks],
        "database_file": DB_FILE,
        "size_kb": round(os.path.getsize(DB_FILE) / 1024, 2)
    }


@app.exception_handler(404)
async def custom_404_handler(request, exc):
    return {"error": "Не найдено", "detail": str(exc)}


@app.exception_handler(500)
async def custom_500_handler(request, exc):
    return {"error": "Ошибка сервера", "detail": str(exc)}