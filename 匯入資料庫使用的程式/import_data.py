import pymysql
import pandas as pd
import numpy as np
import os

CSV_PATH = r"C:\Users\betty\Desktop\資料庫專案\匯入資料庫使用的程式\letter_record.csv"
TARGET_TABLE = "letter_record"

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "friends"
}

def import_single_csv(csv_path, target_table):
    try:
        df = pd.read_csv(csv_path, encoding='utf-8')
    except UnicodeDecodeError:
        df = pd.read_csv(csv_path, encoding='big5')

    # 清理欄位名稱
    df.columns = [c.strip().lower() for c in df.columns]

    # NaN / 空字串轉 None
    df = df.replace({np.nan: None, "": None})

    # 數字欄位轉 int
    for col in df.columns:
        if df[col].dtype.kind in 'iufc':
            df[col] = pd.to_numeric(df[col], errors='coerce')
            df[col] = df[col].apply(lambda x: int(x) if x is not None else None)

    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()

    cols = ", ".join([f"`{col}`" for col in df.columns])
    placeholders = ", ".join(["%s"] * len(df.columns))
    sql = f"INSERT INTO {target_table} ({cols}) VALUES ({placeholders})"

    data_to_insert = [tuple(row) for row in df.values]

    print(f"正在插入 {len(data_to_insert)} 筆資料到 {target_table}...")
    if data_to_insert:
        cursor.executemany(sql, data_to_insert)
        conn.commit()
        print(f"🎉 {target_table} 匯入完成，影響 {cursor.rowcount} 列資料。")
    else:
        print(f"⚠️ 沒有資料可插入 {target_table}")

    cursor.close()
    conn.close()
    print("資料庫連線已關閉。")

if __name__ == "__main__":
    import_single_csv(CSV_PATH, TARGET_TABLE)
