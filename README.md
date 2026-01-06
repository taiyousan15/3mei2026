# Sanmeigaku Platform（高精度命式計算 + Web）

本リポジトリは、算命学の「命式（年柱/月柱/日柱/時柱 + 派生要素）」を **天文学的に厳密**に算出し、**Golden Data（正解データ）と100%一致**することを品質基準として運用するシステムの実装基盤です。

## ゴール（短く）
- 入力（出生日時・TZ・緯度経度・設定）から命式を決定論的に算出する
- すべての変更は Golden 回帰テストで精度を守る
- Web（Next.js 15 App Router）で入力→計算→閲覧→保存→共有まで提供する
- 本番環境は Google Cloud（Cloud Run / Cloud SQL）を想定する

## 重要ドキュメント
- 憲法（非交渉事項）: docs/requirements/00_CONSTITUTION.md
- 要件定義（全文・人間用）: docs/requirements/01_REQUIREMENTS.md
- 技術要件: docs/requirements/02_TECH_REQUIREMENTS.md
- 仕様（UI/API/DB）: docs/specs/
- ワークフロー: docs/process/WORKFLOW.md
- 実行計画書: docs/process/EXECUTION_PLAN.md

## リポジトリ構成（概要）
- apps/web: Next.js 15（App Router）Web + BFF（Route Handlers）
- apps/engine: 高精度計算エンジン（Python想定。天文暦の高精度計算を担当）
- docs/: 要件・仕様・運用
- infra/gcp: GCP運用資料（Cloud Run / Cloud SQL）

## Claude Code 運用
- ルールは CLAUDE.md を参照（Golden優先、近似禁止、設定化、再現性メタ必須）
- `.claude/commands/` に定型コマンドを用意（Golden検証等）

## 次の作業（推奨順）
1) docs/ を読み、非交渉事項と受入基準を理解する
2) apps/engine の計算エンジンMVP（節入り・真太陽時・4柱・蔵干・星テーブル）を作る
3) Golden Data を追加し、CIゲートで100%一致を維持する
4) apps/web でUI/API/保存を実装する
5) infra/gcp に沿ってステージング→本番へ
