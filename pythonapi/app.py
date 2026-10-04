from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes import auth,profile,mail,block,friend,search,ranking

app = FastAPI()

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 登入、註冊相關路由
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])
app.include_router(mail.router, prefix="/mail", tags=["mail"])
app.include_router(block.router, prefix="/block", tags=["block"])
app.include_router(friend.router, prefix="/friend", tags=["friend"])
app.include_router(search.router, prefix="/search", tags=["search"])
app.include_router(ranking.router, prefix="/ranking", tags=["ranking"])

@app.get("/")
def home():
    return {"message": "Welcome to the Python API"}

#uvicorn app:app --reload