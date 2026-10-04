from fastapi import APIRouter
from pydantic import BaseModel

from models.user_models import verify_user
from fastapi import HTTPException
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection

router = APIRouter()

class RegisterRequest(BaseModel):
    email: str
    password: str

def get_next_user_id():
    conn = get_connection()
    if not conn:
        return None
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(id) FROM user")
    result = cursor.fetchone()
    max_id = result[0] if result[0] is not None else 0
    cursor.close()
    conn.close()
    return max_id + 1

@router.post("/register")
def register(req: RegisterRequest):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="資料庫連線失敗")

    cursor = conn.cursor()

    try:
        # 🔍 檢查 email 是否已存在
        cursor.execute("SELECT id FROM authentication WHERE email = %s", (req.email,))
        exist = cursor.fetchone()
        if exist:
            raise HTTPException(status_code=400, detail="此帳號已註冊")

        # 取得新的 user id
        new_id = get_next_user_id()
        if not new_id:
            raise HTTPException(status_code=500, detail="無法取得新的使用者 ID")

        # 新增 user
        cursor.execute(
            "INSERT INTO user (id, name, age, gender, country, reply_time) VALUES (%s, %s, %s, %s, %s, %s)",
            (new_id, 'New User', None, None, None, None)
        )

        # 新增 authentication
        cursor.execute(
            "INSERT INTO authentication (id, email, password) VALUES (%s, %s, %s)",
            (new_id, req.email, req.password)
        )

        conn.commit()
        return {"message": "註冊成功", "user_id": new_id}

    except HTTPException as e:
        raise e

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"建立使用者失敗: {e}")

    finally:
        cursor.close()
        conn.close()

@router.post("/login")
def login_user(data: dict):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="請提供 email 和 password")

    user_id = verify_user(email, password)

    if not user_id:
        raise HTTPException(status_code=404, detail="帳號或密碼錯誤")

    return {"message": "登入成功", "user_id": user_id}