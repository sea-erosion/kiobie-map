# 大分 キオビエダシャクマップ（Next.js + TypeScript + Supabase）

## 動かす手順
1. `npm install`
2. Supabase でプロジェクト作成 → SQL Editor で `supabase.sql` を実行
3. `.env.local.example` を `.env.local` にコピーし、Supabase の URL と anon key（Project Settings → API）を貼る
4. `npm run dev` → http://localhost:3000

## 公開（無料）
GitHub に上げて Vercel でインポート。Environment Variables に `.env.local` と同じ2つを登録するだけ。

## ファイルの役割
- `app/` … ページ。フォルダ名がURLになる（`app/economy/page.tsx` → `/economy`）
- `components/PestMap.tsx` … 地図・現在地・住所検索・投稿
- `components/EconomyCharts.tsx` … グラフと試算
- `lib/` … DB接続、大分県の範囲などの共通部品
- `supabase.sql` … テーブル定義と権限（誰でも閲覧・投稿のみ可、更新削除は不可）

## 無料枠の注意
- Supabase 無料枠は、しばらくアクセスがないと一時停止されることがあります（ダッシュボードから再開）
- 住所検索・地図は国土地理院（キー不要）。大量アクセスは避ける
- いたずら投稿は Supabase の管理画面から削除できます
