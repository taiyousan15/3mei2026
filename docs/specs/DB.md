# 仕様書（DB）

## 1. 方針
- PostgreSQL + Prisma
- 結果は JSONB（resultJson）で保存し、再現性メタを別カラムで保持
- 出生情報は機微データとして最小化（保存不要なら保存しない）
- 保存する場合は暗号化/アクセス制御/監査ログを必須

## 2. エンティティ（概念）
- users：ユーザー
- presets：設定プリセット（流派差分をJSONで保持）
- charts：命式要求（入力・所有者・プリセット参照）
- chart_results：命式結果（JSONB）＋再現性メタ
- audit_logs：監査ログ

## 3. Prismaモデル（雛形）
実装時は apps/web/prisma/schema.prisma に定義する。

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Preset {
  id        String   @id @default(cuid())
  name      String
  config    Json
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Chart {
  id        String   @id @default(cuid())
  ownerId   String
  title     String?
  birthInput Json
  location   Json
  presetId   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ChartResult {
  id            String   @id @default(cuid())
  chartId       String   @unique
  schemaVersion String
  engineVersion String
  tablesVersion Json
  configHash    String
  resultJson    Json
  createdAt     DateTime @default(now())
}

model AuditLog {
  id        String   @id @default(cuid())
  actorId   String?
  action    String
  target    String?
  meta      Json?
  createdAt DateTime @default(now())
}

## 4. インデックス指針
- Chart(ownerId, createdAt)
- AuditLog(actorId, createdAt)
- ChartResult(chartId unique)

## 5. 保持/削除
- ユーザー削除要求に応じ charts/chart_results の削除が可能
- 監査ログは保持期間を定義し、運用でアーカイブ
