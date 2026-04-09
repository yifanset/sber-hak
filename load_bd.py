import sqlite3
import csv

DB_NAME = 'siberia.db'
CSV_FILE = 'статистика для сбера2.csv'

with open(CSV_FILE, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

conn = sqlite3.connect(DB_NAME)
c = conn.cursor()

c.execute('DROP TABLE IF EXISTS regions')
c.execute('''
    CREATE TABLE regions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        vrp TEXT,
        industries TEXT,
        forecast TEXT,
        sources TEXT,
        centers TEXT,
        population TEXT,
        salary TEXT,
        salary_source TEXT
    )
''')

for r in rows:
    c.execute('''
        INSERT INTO regions 
        (name, vrp, industries, forecast, sources, centers, population, salary, salary_source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        r['Регион'].strip(),
        r['Экономический статус (ВРП 2024–2025)'].strip(),
        r['Ключевые отрасли'].strip(),
        r['Прогноз на 2026'].strip(),
        r['Источники'].strip(),
        r['Промцентры и специализация'].strip(),
        r['Демографические параметры'].strip(),
        r['Средняя заработная плата'].strip(),
        r['Источники по зп'].strip()
    ))

conn.commit()
conn.close()
print(f'Загружено {len(rows)} регионов')