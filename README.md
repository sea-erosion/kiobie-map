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

## GitHub Pages版（静的）
同じコード・同じSupabaseで、GitHub Pages用の静的サイトも作れます。`.github/workflows/pages.yml` が自動でやってくれます。
1. GitHub のリポジトリ → Settings → **Pages** → Source を **GitHub Actions** にする
2. Settings → Secrets and variables → Actions → **New repository secret** で次の2つを登録
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `main` に push すると自動でビルド・公開（Actions タブで進み具合が見られる）
4. 公開先は `https://ユーザー名.github.io/リポジトリ名/`

手元で静的ビルドを試すとき（`out/` フォルダができる）：
- Mac/Linux: `STATIC_EXPORT=1 npm run build`
- Windows PowerShell: `$env:STATIC_EXPORT="1"; npm run build`

注意：リポジトリ名が `ユーザー名.github.io` の場合は公開先がルートになるので、workflow の `NEXT_PUBLIC_BASE_PATH` の行を削除してください。

## 投稿できる範囲（大分県の形）
- アプリ側：`lib/oita-area.ts` の輪郭で判定。県外は暗く表示され、置けません。
- データベース側：Supabase の SQL Editor で `supabase-boundary.sql` を1回実行すると、県外の投稿はDBが拒否します。
- 輪郭は海岸線から約300m外側まで広げてあります（海岸付近のGPSのずれ対策）。
