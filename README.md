# 筆友軟體資料庫系統 (Penpal Database System)

> **資料庫系統專案 - 第九組**  
> **成員**：資工三 劉禹彤 (4112056006)、黃喻琦 (4112056032)、廖沛昀 (4112056033)

---

## 📌 專案簡介 (Project Overview)

現代人流行使用交友軟體認識新朋友，但多數軟體偏向照片導向與即時通訊。本專案靈感源自筆友軟體 **「Slowly」**，主張回歸純粹的文字交流——不需傳送照片，而是透過互相寄信的方式跨越國界、結交各地筆友。使用者可以在此練習外語、提升文筆，並分享彼此的生活與興趣。

系統資料庫記錄使用者的個人基本資料（如姓名、年齡、性別、所在地、興趣標籤、使用語言及期望回信時間），提供強大的**多條件篩選搜尋**、**信件收發管理**、**好友封鎖**以及**熱門興趣排行榜**等功能。

---

## 🚀 技術架構 (Tech Stack)

* **前端 (Frontend)**：React (Vite) - 元件化架構、動態互動介面與 API 整合
* **後端 (Backend)**：Python FastAPI - 高效能 RESTful API 設計與資料處理
* **資料庫 (Database)**：MySQL / MariaDB - 市佔率高、關聯式資料驗證與複雜查詢處理
* **資料處理 (Data Pipeline)**：Python (Pandas, PyMySQL/SQLAlchemy) - 資料庫初始化與測試資料生成

---

## ✨ 核心功能 (Key Features)

1. **帳號註冊與身份驗證 (Authentication)**
   * 提供信箱與密碼註冊/登入。
   * 系統自動生成唯一識別碼 `ID`，確保安全性與防呆驗證。

2. **個人資料與標籤管理 (Profile & Tag Management)**
   * 設定個人基本資訊（暱稱、年齡、性別、國家、期望回信時間）。
   * 彈性標籤設定：提供最多 3 個個人興趣與 3 種使用語言。

3. **信箱與寄信紀錄 (Inbox & Sent Mail)**
   * 支援收件匣與寄件匣紀錄檢視，依寄送時間排序。
   * 可依特定筆友篩選專屬的寫信紀錄與對話歷史。

4. **條件搜尋與筆友配對 (Search & Filtering)**
   * 支援交友條件篩選（年齡上限、性別、國家、語言、興趣標籤、回信時間）。
   * 自動過濾本人及已封鎖之用戶。
   * 點擊搜尋結果可查看該筆友詳細公開資料並直接寄信。

5. **黑名單與封鎖機制 (Block List)**
   * 防騷擾保護機制，可將特定用戶納入封鎖名單。
   * 封鎖後系統自動過濾對方的來信與搜尋結果，並支援隨時解除封鎖。

6. **熱門興趣排行榜 (Ranking)**
   * 彙整並統計所有用戶填寫的興趣標籤，列出最受歡迎的前 10 大熱門主題。

---

## 🗄️ 資料庫架構 (Database Schema & E-R Model)

系統包含 6 個主要 Entity/Table：

1. `user(id, name, age, gender, country, reply_time)`：儲存用戶基本資訊。
2. `authentication(id, email, password)`：儲存登入帳密與安全驗證。
3. `interests(id, interest1, interest2, interest3)`：儲存用戶個人興趣標籤。
4. `languages(id, language1, language2, language3)`：儲存用戶能力語言。
5. `block_list(user_id, partner_id)`：紀錄用戶間的封鎖關係 (多對多)。
6. `letter_record(sender_id, receiver_id, content, timestamp)`：紀錄信件傳送歷史 (多對多)。

---

## 📁 專案目錄結構 (Directory Structure)

```text
DBMS_Project/
├── my-react-app/              # 前端 React (Vite) 應用程式
│   ├── src/
│   │   ├── components/        # 公用組件 (Header 等)
│   │   ├── context/           # 全局狀態管理
│   │   ├── pages/             # 各功能頁面 (Login, Profile, Inbox, Search, Ranking...)
│   │   └── assets/            # 圖示與靜態資源
│   ├── package.json
│   └── vite.config.js
├── pythonapi/                 # 後端 Python FastAPI 服務
│   ├── app.py                 # FastAPI 入口點
│   ├── database.py            # 資料庫連線配置
│   ├── models/                # 資料模型與 Pydantic Schemas
│   └── routes/                # 各功能路由 (auth, profile, mail, search, block, ranking...)
├── 匯入資料庫使用的程式/       # 資料庫初始化與 CSV 資料匯入工具
│   ├── import_data.py
│   ├── reg.py
│   └── *.csv                  # 基礎資料集
├── 生成資料/                   # 模擬測試資料生成腳本
└── README.md                  # 專案說明文件
```

---

## 👥 團隊分工 (Team Contribution)

| 成員 | 主要分工與貢獻 |
| :--- | :--- |
| **劉禹彤** | 前端 React 開發、UI/UX 介面設計、SQL 查詢撰寫、資料彙整、口頭報告 Demo、書面報告撰寫 |
| **黃喻琦** | 後端 Python API 與 MySQL 串接、SQL 查詢設計、UI 設計、資料集構建、書面報告與簡報 |
| **廖沛昀** | E-R 圖繪製、SQL 查詢語法設計、UI 設計、資料集構建、書面與口頭報告 |

