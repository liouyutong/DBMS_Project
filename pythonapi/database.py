import mysql.connector

def get_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",   # 根據你的密碼修改
            database="friends"
        )
        if conn.is_connected():
            print("✅ 連線成功")
        return conn
    except mysql.connector.Error as e:
        print("❌ 連線失敗:", e)
        return None
