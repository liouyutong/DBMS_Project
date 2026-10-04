from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql # 使用 PyMySQL 函式庫

# 您的資料庫連線配置
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "", # 注意：實際生產環境應設定安全密碼
    "database": "friends"
}

app = Flask(__name__)
CORS(app) 

# --- 資料庫連線函式 ---
def get_db_connection():
    """建立並回傳資料庫連線"""
    try:
        # 使用 DB_CONFIG 字典中的參數建立連線
        conn = pymysql.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"資料庫連線失敗: {e}")
        # 在實際應用中，這裡應該拋出錯誤或紀錄日誌
        return None


# --- 註冊 API 路由 ---
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    required_fields = ['email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "必須提供信箱和密碼"}), 400

    email = data.get('email')
    password = data.get('password') 
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "伺服器資料庫無法連線"}), 500

    try:
        # PyMySQL 預設使用 autocommit=False，需要手動 commit
        with conn.cursor() as cursor:
            # 1. 插入 user 表格，將其他欄位設定為 NULL 或預設值
            # ⚠️ MySQL 的 AUTO_INCREMENT ID 不需要手動提供
            # reply_time 應使用 MySQL 的 NOW() 函式
            
            sql_user = """
                INSERT INTO user (name, age, gender, country, reply_time) 
                VALUES (%s, %s, %s, %s, NOW())
            """
            cursor.execute(sql_user, (None, None, None, None))
            
            # 取得新插入的 user ID
            new_user_id = conn.insert_id() 

            # 2. 插入 authentication 表格
            # 密碼在實際應用中請使用雜湊 (e.g., bcrypt)
            sql_auth = """
                INSERT INTO authentication (id, email, password) 
                VALUES (%s, %s, %s)
            """
            cursor.execute(sql_auth, (new_user_id, email, password))

            # 3. 插入 interests 和 languages (使用 NULL 或預設值)
            cursor.execute("INSERT INTO interests (id) VALUES (%s)", (new_user_id,))
            cursor.execute("INSERT INTO languages (id) VALUES (%s)", (new_user_id,))
            
            # 提交事務
            conn.commit()

        # 4. 回傳成功的響應
        return jsonify({
            "message": "用戶註冊成功",
            "user_id": new_user_id,
            "email": email
        }), 201 

    except pymysql.err.IntegrityError as e:
        # 處理信箱重複等唯一性約束錯誤
        conn.rollback() # 發生錯誤時回滾
        return jsonify({"error": "該信箱已被註冊或資料有誤"}), 409
    except Exception as e:
        conn.rollback()
        print(f"資料庫事務錯誤: {e}")
        return jsonify({"error": "伺服器內部錯誤，註冊失敗"}), 500
    finally:
        # 確保連線在任何情況下都會關閉
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)