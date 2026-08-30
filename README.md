# start-with-hika

Ứng dụng học chữ tiếng Nhật (Hiragana & Katakana) + từ vựng, hỗ trợ PWA.

## Tech Stack

- React 19 + TypeScript + Vite
- React Router DOM 7
- Vite PWA Plugin
- Deploy: GitHub Pages

## Project Structure

```
start-with-hika/
├── index.html
├── package.json
├── vite.config.ts
├── public/
│   ├── manifest.json
│   ├── icon-192-purple-a.png
│   ├── icon-512-purple-a.png
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    ├── index.css
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── styles/
    │   └── common.css
    ├── components/
    │   ├── Sidebar.tsx
    │   └── Sidebar.css
    ├── pages/
    │   ├── Home.tsx / .css
    │   ├── Learn.tsx / .css
    │   ├── Vocab.tsx / .css
    │   ├── Hiragana.tsx / .css
    │   ├── Katakana.tsx / .css
    │   ├── Test.tsx / .css
    │   └── Setting.tsx / .css
    └── data/
        └── vocabEasyKata.ts
```

## Pages

| Route | Page | Mô tả |
|-------|------|-------|
| `/` | Learn | Học chữ Kana (Hiragana / Katakana / Mix / Hard / Asian) |
| `/learn` | Learn | Học chữ Kana |
| `/vocab` | Vocab | Học từ vựng (Easy / Normal / Hard) |
| `/hiragana` | Hiragana | Bảng chữ Hiragana |
| `/kana` | Katakana | Bảng chữ Katakana |
| `/test` | Test | Kiểm tra kiến thức |
| `/setting` | Setting | Cài đặt |

## Scripts

```bash
npm run dev      # Chạy dev server
npm run build    # Build production
npm run preview  # Preview build
npm run lint     # Lint code
```

## Deploy

Build và deploy lên GitHub Pages qua workflow `.github/workflows/deploy.yml`.
