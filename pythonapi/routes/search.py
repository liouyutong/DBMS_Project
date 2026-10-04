from fastapi import APIRouter, HTTPException
from database import get_connection

router = APIRouter()

@router.get("/users")
def search_users(
    age: int | None = None,
    gender: str | None = None,
    countries: str | None = None,
    interests: str | None = None,
    languages: str | None = None,
    reply_time: str | None = None
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        sql = """
        SELECT DISTINCT
            u.id,
            u.name,
            u.age,
            u.gender,
            u.country,
            u.reply_time,
            i.interest1, i.interest2, i.interest3,
            l.language1, l.language2, l.language3
        FROM user u
        LEFT JOIN interests i ON u.id = i.id
        LEFT JOIN languages l ON u.id = l.id
        WHERE 1=1
        """
        params = []

        # 年齡上限
        if age is not None:
            try:
                age_int = int(age)  # 確保 age 是數字
                sql += " AND u.age <= %s"
                params.append(age_int)
            except ValueError:
                pass  # 如果不是數字就不加條件

        # 性別
        if gender and gender in ("F", "M"):
            sql += " AND u.gender = %s"
            params.append(gender)

        # 國家（多選）
        if countries:
            country_list = [c.strip() for c in countries.split(",")]
            sql += f" AND u.country IN ({','.join(['%s']*len(country_list))})"
            params.extend(country_list)

        # 回信時間
        if reply_time and reply_time != "no limit":
            sql += " AND u.reply_time = %s"
            params.append(reply_time)

        # 興趣（至少一個）
        if interests:
            interest_list = [x.strip() for x in interests.split(",")]
            interest_sql = []
            for val in interest_list:
                interest_sql.append("(i.interest1=%s OR i.interest2=%s OR i.interest3=%s)")
                params.extend([val, val, val])
            sql += " AND (" + " OR ".join(interest_sql) + ")"

        # 語言（至少一個）
        if languages:
            lang_list = [x.strip() for x in languages.split(",")]
            lang_sql = []
            for val in lang_list:
                lang_sql.append("(l.language1=%s OR l.language2=%s OR l.language3=%s)")
                params.extend([val, val, val])
            sql += " AND (" + " OR ".join(lang_sql) + ")"

        cursor.execute(sql, params)
        users = cursor.fetchall()
        return {"users": users}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
