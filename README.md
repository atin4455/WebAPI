# 🚀 WebAPI & React 全端分離實戰練習：Todo List

這是一個基於 **.NET 10 Web API** 與 **Vite + React** 打造的前後端分離（Full-Stack）實戰專案。專案從零開始建構，旨在掌握現代網頁開發中最核心的 RESTful API 設計、CORS 跨域防禦機制，以及業界標準的後端解耦架構。

---

## 🛠️ 技術棧 (Tech Stack)

- **前端 (FrontEnd)**: React 19, Vite, JavaScript (ES6+), HTML5/CSS3
- **後端 (BackEnd)**: .NET 10 Web API, Entity Framework Core (In-Memory Database)
- **開發工具**: Visual Studio 2022, Git

---

## 🎯 目前進度與突破 (已完成事項)

在建立這個全端專案的過程中，我成功克服並解鎖了以下關鍵技術點：

### 1. 前端環境正名與排雷
- **解決 Git 大小寫不敏感的經典坑**：成功修正專案目錄名稱，確保在 Git 與實體硬碟中皆完美正名為大寫的 `WebAPI.FrontEnd`。
- **掌握 Visual Studio 的前端 Port 分配邏輯**：理解 Vite 預設的 `5173` 與 Visual Studio 透過 `launchSettings.json` 隨機指派高位埠（如 `61780`）的機制差異。

### 2. 後端 Web API 與 CORS 跨域連通
- **架設 .NET 10 API 伺服器**：利用 `Program.cs` 註冊依賴（DI）並成功啟動本地 HTTPS 加密伺服器（`7112`）。
- **CORS 安全大門配置**：在後端精準設定 `WithOrigins("http://localhost:61780")` 政策，順利放行來自前端指定埠號的連線，打通前後端邊境。

### 3. 解鎖完整全端 CRUD 閉環
- **Read (查)**：修正 React Hook 宣告順序，並將獲取資料的函式 `fetchTodos` 收納至 `useEffect` 內部，徹底消除 ESLint 關於同步變更狀態（cascading renders）的潛在風險警告。
- **Create (增)**：前端發送非同步 `POST`，後端將新物件寫入記憶體資料庫並即時回傳同步渲染。
- **Update (改)**：實作 `handleToggleComplete`，點擊 Checkbox 時透過 `PUT /{id}` 請求反轉事項的完成狀態，前端動態呈現刪除線效果。
- **Delete (刪)**：透過 `DELETE /{id}` 請求，配合後端路由參數，達到精準抹除特定資料的資料庫與畫面更新。

---

## 🚀 接下來的修煉計畫 (待辦事項)

為了將此專案從「練習用的單一控制器」升級為「具備高度可擴充性、可測試性的業界標準專案」，下一階段將聚焦於後端架構的完全解耦：

- [ ] **重構為後端核心三層式架構 (3-Tier Architecture)**
  - [ ] **資料存取層 (Data Access Layer)**：建立 `Repositories`，將 EF Core / DbContext 語法封裝至 `TodoRepository` 中，落實資料層職責分離。
  - [ ] **商業邏輯層 (Business Logic Layer)**：建立 `Services`，將資料驗證與核心邏輯移入 `TodoService`，徹底阻絕 Controller 直接接觸資料庫。
  - [ ] **呈現/控制層 (Presentation Layer)**：重構 `TodoController`，移除任何對 DbContext 的依賴，使其純化為「專職當櫃檯接單與回報」的轉介層。
  - [ ] **依賴注入註冊**：於 `Program.cs` 完成 Service 與 Repository 的生命週期（`AddScoped`）註冊。

- [ ] **前端元件化重構 (Component Refactoring)**
  - [ ] 將目前 `App.jsx` 較為龐大的畫面拆分為多個高複用性零件（例如：`TodoInput.jsx`、`TodoList.jsx`、`TodoItem.jsx`）。

- [ ] **資料庫持久化 (Database Persistence)**
  - [ ] 將 `UseInMemoryDatabase` 記憶體資料庫，更換為真實的 SQL Server，配置連線字串並實作 Migration，確保重開機後資料不遺失。

---

## 💻 專案目錄結構

```text
📦 WebAPI (方案總根目錄)
 ┣ 📂 .vs (Visual Studio 快取)
 ┣ 📂 WebAPI.BackEnd (純後端 Web API 專案)
 ┃ ┣ 📂 Controllers (控制器)
 ┃ ┣ 📂 Data (資料內容 - DbContext)
 ┃ ┣ 📂 Models (實體模型 - Todo)
 ┃ ┗ 📜 Program.cs (後端開機總管)
 ┣ 📂 WebAPI.FrontEnd (純前端 React 專案)
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📜 App.jsx (核心畫面與狀態調度總部)
 ┃ ┃ ┗ 📜 main.jsx (前端入口)
 ┃ ┗ 📜 package.json
 ┣ 📜 WebAPI.sln (方案組態檔)
 ┗ 📜 README.md  <-- 🌟 專案大總管說明文件（Solution Items）