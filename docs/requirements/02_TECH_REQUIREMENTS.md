# 技術要件（Tech Requirements）

## 1. 採用スタック（確定）
- Web: Next.js 15（App Router） + TypeScript + Tailwind CSS
- ORM: Prisma
- DB: PostgreSQL
- Engine: 高精度計算エンジン（Python想定。天文計算/暦変換/算命学ロジック）
- 本番: Google Cloud（Cloud Run / Cloud SQL / Secret Manager / Artifact Registry）

## 2. システム構成要件
### 2.1 分離原則
- 精度責務は engine に集約する（WebはUI + BFF/集約）
- 流派差分は設定として管理し、engineに明示的に渡す
- 出力は schema_version と再現性メタを必ず含む

### 2.2 推奨サービス構成（GCP）
- Cloud Run: web（Next.js）
- Cloud Run: engine（Python API）
- Cloud SQL: PostgreSQL
- Secret Manager: DATABASE_URL / engine認可情報 等
- Artifact Registry: コンテナイメージ
- Cloud Logging / Monitoring: 監視

### 2.3 セキュリティ/認可
- engineは外部公開しない（Ingress制限）
- web→engineはIAM（Invoker）で認可（推奨）
- サービスアカウント分離（web/engine/migrate）
- 監査ログ：計算/保存/共有/管理更新を記録

## 3. Web（Next.js 15）要件
- App Router前提（Route HandlersでBFF API提供）
- Server Components / Server Actionsの採用は任意（実装フェーズで選択）
- 入力バリデーションはサーバー側でも必ず実施
- Tailwind CSSでレスポンシブ対応

## 4. DB/Prisma要件
- Prisma schemaは apps/web/prisma/schema.prisma に配置
- JSONB（resultJson）保存を前提
- マイグレーションはPRで差分レビュー必須
- インデックス方針は docs/specs/DB.md に従う

## 5. Engine要件（精度中核）
- Golden Data 100%一致が品質定義（CIゲート）
- 節入り：近似禁止
- 真太陽時：経度補正＋均時差を扱う
- 蔵干：節間実時間×比率按分（7:7:16等）
- 十大主星/十二大従星：テーブル参照（データ駆動）

## 6. CI要件（最小）
- Engine:
  - python scripts/validate_golden.py
  - pytest -q tests/golden
  - （推奨）python scripts/validate_tables.py --strict
- Web:
  - lint / typecheck / build
  - Prisma validate

## 7. バージョン戦略
- schema_version：API/出力互換
- engine_version：計算ロジック識別
- tables_version：テーブル識別（v1/v2…）
- config_hash：最終設定の識別（プリセット＋上書き）
