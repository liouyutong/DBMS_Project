import mysql.connector

conn = None

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="friends"
    )
    print("連線成功")
except mysql.connector.Error as err:
    print("連線失敗:", err)
except Exception as e:
    print("其他錯誤:", e)
finally:
    if conn:
        conn.close()
