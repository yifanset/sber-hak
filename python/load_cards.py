import sqlite3
import csv

DB_NAME = 'cards.db'
CSV_FILE = 'Salary_cards.csv'

with open(CSV_FILE, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f, delimiter=';')
    rows = list(reader)

conn = sqlite3.connect(DB_NAME)
c = conn.cursor()

c.execute('DROP TABLE IF EXISTS cards')
c.execute('''
    CREATE TABLE cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bank TEXT,
        percent_on_balance TEXT,
        savings_account TEXT,
        cashback TEXT,
        annual_fee TEXT
    )
''')

for r in rows:
    c.execute('''
        INSERT INTO cards 
        (bank, percent_on_balance, savings_account, cashback, annual_fee)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        r['Банк'].strip(),
        r['Процент на остаток'].strip(),
        r['Накопительный счет'].strip(),
        r['Баллы или кешбек'].strip(),
        r['Годовое обслуживание'].strip()
    ))

conn.commit()
conn.close()
print(f'Загружено {len(rows)} карт')