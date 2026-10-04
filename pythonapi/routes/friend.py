from fastapi import APIRouter, HTTPException
from database import get_connection

router = APIRouter()

@router.get("/list/{user_id}")
def get_friends(user_id: int):
    """
    取得使用者好友：
    只要有人寄信給我 或 我寄信給別人，就算好友
    並排除已被使用者封鎖的好友
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT DISTINCT f.friend_id
            FROM (
                SELECT sender_id AS friend_id FROM letter_record WHERE receiver_id = %s
                UNION
                SELECT receiver_id AS friend_id FROM letter_record WHERE sender_id = %s
            ) AS f
            WHERE f.friend_id NOT IN (
                SELECT partner_id FROM block_list WHERE user_id = %s
            )
        """, (user_id, user_id, user_id))
        
        friends = [row['friend_id'] for row in cursor.fetchall()]

    except Exception as e:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

    cursor.close()
    conn.close()
    return {"friends": friends}
