from fastapi import APIRouter, HTTPException
from database import get_connection
from pydantic import BaseModel
import mysql.connector
from datetime import datetime

router = APIRouter()

@router.get("/inbox/{user_id}")
def get_inbox(user_id: int):
    """
    取得收件箱信件，但排除被使用者封鎖的寄件人
    """
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="資料庫連線失敗")
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT l.sender_id, u.name AS sender_name, l.content, l.timestamp
            FROM letter_record l
            JOIN user u ON l.sender_id = u.id
            WHERE l.receiver_id = %s
              AND l.sender_id NOT IN (
                  SELECT partner_id
                  FROM block_list
                  WHERE user_id = %s
              )
            ORDER BY l.timestamp DESC
        """, (user_id, user_id))
        letters = cursor.fetchall()
        return {"letters": letters}

    finally:
        cursor.close()
        conn.close()


# 寄信紀錄 API（保留）
@router.get("/sent/{user_id}")
def get_sent_letters(user_id: int):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="資料庫連線失敗")
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT l.receiver_id, u.name AS receiver_name, l.content, l.timestamp
            FROM letter_record l
            JOIN user u ON l.receiver_id = u.id
            WHERE l.sender_id=%s
            ORDER BY l.timestamp DESC
        """, (user_id,))
        letters = cursor.fetchall()
        return {"sent": letters}
    finally:
        cursor.close()
        conn.close()


class SendMailRequest(BaseModel):
    sender_id: int
    receiver_id: int
    content: str


# 寄信 API（只有這裡新增收件者防呆）
@router.post("/send")
def send_mail(req: SendMailRequest):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="資料庫連線失敗")

    cursor = conn.cursor(dictionary=True)

    try:
        # 🔍 檢查收件者是否存在
        cursor.execute("SELECT id FROM user WHERE id = %s", (req.receiver_id,))
        receiver = cursor.fetchone()

        if not receiver:
            raise HTTPException(status_code=400, detail="該使用者不存在")

        # 🔍 正常寄信
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        sql = """
            INSERT INTO letter_record(sender_id, receiver_id, content, timestamp)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql, (req.sender_id, req.receiver_id, req.content, timestamp))
        conn.commit()

        return {"message": "寄信成功", "timestamp": timestamp}

    finally:
        cursor.close()
        conn.close()
