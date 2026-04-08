import os
import csv
import time
import psycopg2
from psycopg2 import sql
from selenium import webdriver
from selenium_stealth import stealth
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


DB_CONFIG = {
    "dbname": "banki_db",
    "user": "postgres",
    "password": "Toporist5",
    "host": "localhost",
    "port": "5432"
}

TASKS = [
    {
        "name": "Salary_cards",
        "url": "https://www.banki.ru/products/debitcards/catalogue/zarplatnyie_kartyi/",
        "keys": ["Банк", "Процент на остаток", "Накопительный счет", "Баллы или кешбек", "Годовое обслуживание"]
    }
]

LIMIT = 32


def save_to_postgres(task_name, data_list):

    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        table_name = task_name.lower()


        cur.execute(sql.SQL("""
            CREATE TABLE IF NOT EXISTS {} (
                id SERIAL PRIMARY KEY,
                bank TEXT,
                percent TEXT,
                savings_account TEXT,
                cashback TEXT,
                service_fee TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """).format(sql.Identifier(table_name)))


        insert_query = sql.SQL("""
            INSERT INTO {} (bank, percent, savings_account, cashback, service_fee)
            VALUES (%s, %s, %s, %s, %s)
        """).format(sql.Identifier(table_name))

        cur.executemany(insert_query, data_list)
        conn.commit()
        print(f"Успешно сохранено в PostgreSQL: {len(data_list)} строк.")
    except Exception as e:
        print(f"Ошибка БД: {e}")
    finally:
        if conn: cur.close(); conn.close()


def create_files(tasks_list):
    if not os.path.exists('parsing_results'):
        os.makedirs('parsing_results')
    for task in tasks_list:
        file_path = f"parsing_results/{task['name']}.csv"
        with open(file_path, mode='w', newline='', encoding='utf-8-sig') as f:
            writer = csv.writer(f, delimiter=';')
            writer.writerow(task['keys'])



create_files(TASKS)
options = Options()
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)

driver = webdriver.Chrome(options=options)
stealth(driver, languages=["ru-RU", "ru"], vendor="Google Inc.", platform="Win64", webgl_vendor="Intel Inc.",
        renderer="Intel Iris OpenGL Engine", fix_hairline=True)

for task in TASKS:
    print(f"Запуск: {task['name']}")
    driver.get(task['url'])
    time.sleep(5)


    while True:
        all_cards = driver.find_elements(By.CLASS_NAME, "iLZJOZ")
        current_count = len(all_cards)
        print(f"Карточек на странице: {current_count} из {LIMIT}")
        if current_count >= LIMIT: break

        try:
            wait = WebDriverWait(driver, 10)
            more_link = wait.until(EC.presence_of_element_located((By.XPATH, "//a[contains(@href, 'page=')]")))
            driver.execute_script("arguments[0].click();", more_link)
            time.sleep(5)

            new_count = len(driver.find_elements(By.CLASS_NAME, "iLZJOZ"))
            if new_count <= current_count:
                try:
                    btn_inside = more_link.find_element(By.TAG_NAME, "button")
                    driver.execute_script("arguments[0].click();", btn_inside)
                    time.sleep(5)
                except:
                    break
        except Exception:
            break


    all_cards = driver.find_elements(By.CLASS_NAME, "iLZJOZ")
    count = min(len(all_cards), LIMIT)
    file_path = f"parsingResults/{task['name']}.csv"

    all_data_for_db = []

    with open(file_path, mode='a', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f, delimiter=';')
        for i in range(count):
            try:
                card = all_cards[i]
                data_elements = card.find_elements(By.CLASS_NAME, "ibSjVz")
                values = [el.text.strip() for el in data_elements]

                if len(values) >= 5:
                    row = values[:5]
                    writer.writerow(row)
                    all_data_for_db.append(row)
                    print(f"[{i + 1}/{count}] Записан: {row[0]}")
            except Exception:
                continue

    if all_data_for_db:
        save_to_postgres(task['name'], all_data_for_db)

print("\nПарсинг и экспорт завершены!")
driver.quit()