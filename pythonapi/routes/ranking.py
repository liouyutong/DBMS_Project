# routes/ranking.py
from fastapi import APIRouter, HTTPException
from database import get_connection# 你的資料庫連線工具

router = APIRouter()

@router.get("/top_interests")
def get_top_interests():
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="資料庫連線失敗")
    cursor = conn.cursor(dictionary=True)
    try:
        # 將三個欄位合併，統計出現次數
        cursor.execute("""
            SELECT interest AS topic, COUNT(*) AS count FROM (
                SELECT interest1 AS interest FROM interests
                UNION ALL
                SELECT interest2 AS interest FROM interests
                UNION ALL
                SELECT interest3 AS interest FROM interests
            ) AS all_interests
            WHERE interest IS NOT NULL AND interest != ''
            GROUP BY interest
            ORDER BY count DESC
            LIMIT 10
        """)
        top_interests = cursor.fetchall()
        return {"top_interests": top_interests}
    finally:
        cursor.close()
        conn.close()
