此檔案說明 Visual Studio 建立專案的方式。

下列工具用來產生此專案:
- create-vite

下列步驟用來產生此專案:
- 使用 create-vite 建立 react 專案: `npm init --yes vite@latest webapi.frontend -- --template=react  --no-rolldown --no-immediate`.
- 正在使用連接埠更新 `vite.config.js`。
- 建立專案檔 (`webapi.frontend.esproj`)。
- 建立 `launch.json` 以啟用偵錯功能。
- 將專案新增至解決方案。
- 寫入此檔案。
