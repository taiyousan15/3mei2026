# GCP 本番構成（想定）

## サービス
- Cloud Run: web（Next.js）
- Cloud Run: engine（Python計算）
- Cloud SQL: PostgreSQL
- Secret Manager: DATABASE_URL, engine認可情報 等
- Artifact Registry: コンテナイメージ
- Cloud Logging / Monitoring: 監視

## セキュリティ
- engine は外部公開しない（Ingress制限）
- web→engine は IAM 認可（Invoker）
- サービスアカウント分離（web/engine/migrate）

## デプロイ方針
- ステージング→本番の段階デプロイ
- Cloud Run リビジョンでロールバック
