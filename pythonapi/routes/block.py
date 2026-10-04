from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection

router = APIRouter()

# 封鎖/解除封鎖請求
class BlockRequest(BaseModel):
    user_id: int
    partner_id: int

# 取得封鎖名單
@router.get("/list/{user_id}")
def get_block_list(user_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT partner_id FROM block_list
        WHERE user_id = %s
    """, (user_id,))
    blocked = [row['partner_id'] for row in cursor.fetchall()]

    cursor.close()
    conn.close()
    return {"blocked": blocked}

# 拉黑好友
@router.post("/add")
def block_user(req: BlockRequest):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO block_list(user_id, partner_id)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE user_id=user_id
        """, (req.user_id, req.partner_id))
        conn.commit()
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))

    cursor.close()
    conn.close()
    return {"message": "拉黑成功"}

# 解除封鎖
@router.post("/remove")
def unblock_user(req: BlockRequest):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            DELETE FROM block_list
            WHERE user_id=%s AND partner_id=%s
        """, (req.user_id, req.partner_id))
        conn.commit()
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))

    cursor.close()
    conn.close()
    return {"message": "解除封鎖成功"}
