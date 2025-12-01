# BF QRCode Login Helper

一個協助 BF 登入的工具，可以快速取得 QRCode 登入資訊。

## 本地開發

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm start
```

預設會在 `http://localhost:80` 啟動（如果 port 80 被佔用，可以設定環境變數 `PORT`）

```bash
set PORT=3000
npm start
```

## 部署到 Vercel

### 方法一：透過 Vercel CLI

1. 安裝 Vercel CLI：
```bash
npm install -g vercel
```

2. 登入 Vercel：
```bash
vercel login
```

3. 部署專案：
```bash
vercel
```

4. 生產環境部署：
```bash
vercel --prod
```

### 方法二：透過 GitHub

1. 將專案推送到 GitHub repository
2. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
3. 點擊 "Import Project"
4. 選擇你的 GitHub repository
5. Vercel 會自動偵測設定並部署

## 專案結構

```
BFLogin/
├── index.js           # Node.js 後端伺服器
├── package.json       # 專案設定檔
├── vercel.json        # Vercel 部署設定
├── public/            # 前端靜態檔案
│   ├── index.html     # 主頁面
│   ├── style.css      # 樣式表
│   └── script.js      # 前端 JavaScript
└── refs/              # 原始 jsFiddle 檔案（保留參考）
```

## API 端點

### GET /api/qrcode

取得 QRCode 登入資料

**參數：**
- `skey` (必填): 從 BeanFun 登入網址中提取的 skey

**回應範例：**
```json
{
  "strEncryptBCDOData": "..."
}
```

## 技術棧

- **後端**: Node.js (原生 http 模組)
- **前端**: 純 HTML, CSS, JavaScript
- **部署**: Vercel
- **依賴**: node-fetch (用於後端 API 請求)

## 注意事項

- 確保 Node.js 版本 >= 14
- Vercel 上預設會使用動態 port，不需要手動設定
- 本地開發時，如果 port 80 需要管理員權限，建議使用其他 port

## License

MIT
