
from database import get_connection



def verify_user(email, password):
    """
    驗證使用者登入
    - email: 使用者輸入的信箱
    - password: 使用者輸入的密碼
    回傳：
        user_id (int) 登入成功
        None 登入失敗
    """

    # 去掉前後空格並轉成小寫，避免大小寫或空格問題
    email = email.strip().lower()
    password = password.strip()

    conn = get_connection()
    if not conn:
        print("資料庫連線失敗")
        return None

    cursor = conn.cursor(dictionary=True)  # dictionary=True 方便讀欄位名稱
    try:
        # 先查 email
        cursor.execute("SELECT id, email, password FROM authentication WHERE LOWER(email)=%s", (email,))
        result = cursor.fetchone()

        if not result:
            print(f"登入失敗: 找不到 email {email}")
            return None

        db_password = result["password"].strip()  # 去掉資料庫存的前後空格
        if db_password != password:
            print(f"登入失敗: 密碼錯誤 for email {email}")
            return None

        # 登入成功
        print(f"登入成功: user_id={result['id']}")
        return result["id"]

    except Exception as e:
        print("登入檢查發生錯誤:", e)
        return None
    finally:
        cursor.close()
        conn.close()
        
