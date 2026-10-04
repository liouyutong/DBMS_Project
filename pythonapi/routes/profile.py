from fastapi import APIRouter, HTTPException, Body
from database import get_connection
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

class UpdateInterestModel(BaseModel):
    user_id: int
    interests: Optional[List[str]] = []
    languages: Optional[List[str]] = []

@router.post("/update_interest")
def update_interest(data: UpdateInterestModel):
    if not data.user_id:
        raise HTTPException(status_code=400, detail="user_id 不可為空")
    
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="資料庫連線失敗")
    
    cursor = conn.cursor()
    try:
        # interests table 更新
        interests = (data.interests or []) + [None]*(3 - len(data.interests or []))
        cursor.execute("""
            INSERT INTO interests (id, interest1, interest2, interest3)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                interest1=%s, interest2=%s, interest3=%s
        """, (
            data.user_id, interests[0], interests[1], interests[2],
            interests[0], interests[1], interests[2]
        ))

        # languages table 更新（欄位改回 language1~3）
        languages = (data.languages or []) + [None]*(3 - len(data.languages or []))
        cursor.execute("""
            INSERT INTO languages (id, language1, language2, language3)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                language1=%s, language2=%s, language3=%s
        """, (
            data.user_id, languages[0], languages[1], languages[2],
            languages[0], languages[1], languages[2]
        ))

        conn.commit()
        return {"message": "更新成功"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# 取得使用者興趣與語言
@router.get("/interests/{user_id}")
def get_interests(user_id: int):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="資料庫連線失敗")
    cursor = conn.cursor(dictionary=True)

    try:
        # 先抓 interests
        cursor.execute("SELECT * FROM interests WHERE id=%s", (user_id,))
        interests = cursor.fetchone()

        # 如果沒有資料，先建立空資料
        if not interests:
            cursor.execute(
                "INSERT INTO interests (id, interest1, interest2, interest3) VALUES (%s, NULL, NULL, NULL)",
                (user_id,)
            )
            cursor.execute(
                "INSERT INTO languages (id, language1, language2, language3) VALUES (%s, NULL, NULL, NULL)",
                (user_id,)
            )
            conn.commit()
            return {"interests": [], "languages": []}

        # 抓 languages
        cursor.execute("SELECT * FROM languages WHERE id=%s", (user_id,))
        languages = cursor.fetchone()
        if not languages:
            # 如果 languages 沒有資料，也初始化
            cursor.execute(
                "INSERT INTO languages (id, language1, language2, language3) VALUES (%s, NULL, NULL, NULL)",
                (user_id,)
            )
            conn.commit()
            languages = {"language1": None, "language2": None, "language3": None}

        # 將資料整理成 list
        interests_list = [v for k, v in interests.items() if k.startswith("interest") and v]
        languages_list = [v for k, v in languages.items() if k.startswith("language") and v]

        return {"interests": interests_list, "languages": languages_list}

    finally:
        cursor.close()
        conn.close()
        
# 更新使用者基本資料
@router.post("/update")
def update_profile(
    user_id: int = Body(..., embed=True),
    nickname: str = Body(...),
    age: int = Body(...),
    gender: str = Body(...),
    country: str = Body(...),
    reply_time: str = Body(...)
):
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id 不可為空")
    
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="資料庫連線失敗")

    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE user SET
                name=%s,
                age=%s,
                gender=%s,
                country=%s,
                reply_time=%s
            WHERE id=%s
        """, (nickname, age, gender, country, reply_time, user_id))
        conn.commit()
        return {"message": "更新成功"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"更新失敗: {e}")
    finally:
        cursor.close()
        conn.close()




# 取得使用者基本資料
@router.get("/{user_id}")
def get_profile(user_id: int):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="資料庫連線失敗")
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT 
                id,
                name AS nickname, 
                age, 
                gender, 
                country, 
                reply_time
            FROM user 
            WHERE id=%s
            """,
            (user_id,)
        )
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="使用者不存在")
        return user
    finally:
        cursor.close()
        conn.close()


