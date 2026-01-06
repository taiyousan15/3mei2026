# 仕様書（API）

## 1. API設計方針
- 外部公開は web（Next.js BFF）のみ
- engine は内部APIとして分離（Cloud Run間）
- 入出力はJSON、日時はISO8601
- 互換は schema_version で管理（破壊変更はversionを上げる）
- request_id を web→engine で引継ぎ、監査/追跡可能にする

## 2. BFF API（web）
### 2.1 POST /api/charts/compute
目的：保存せず計算（プレビュー）

Request
{
  "birth": { "datetime_local": "1995-03-10T23:40:00", "tz": "Asia/Tokyo" },
  "location": { "lat_deg": 33.59, "lon_deg": 130.40, "name": "Fukuoka" },
  "preset_id": "default",
  "config_overrides": { }
}

Response（抜粋）
{
  "schema_version": "1.0",
  "engine": {
    "engine_version": "0.1.0",
    "tables_version": { "ten_great": "v1", "twelve_imperial": "v1", "zogan": "v1" },
    "config_hash": "..."
  },
  "pillars": {
    "year":  { "ganzhi": "..." },
    "month": { "ganzhi": "..." },
    "day":   { "ganzhi": "..." },
    "hour":  { "ganzhi": "..." }
  },
  "sanmeigaku": {
    "zogan": { "month": { "active_label": "初", "active_hidden_stem": "戊" } },
    "stars": { "ten_great": [], "twelve_imperial": [] }
  },
  "debug": { "jd_ut": 0, "solar_terms": {} }
}

Errors
- 400: 入力不備
- 422: 設定矛盾/境界判定不能
- 502: engine障害

### 2.2 POST /api/charts
目的：計算して保存

### 2.3 GET /api/charts/[id]
目的：保存済み取得（権限制御）

### 2.4 GET /api/health
目的：ヘルスチェック

## 3. Engine API（internal）
### POST /v1/chart/compute
- webから内部呼び出し
- engineは入力＋設定を受け取り、決定論的出力を返す
- engineは外部公開しない（Ingress制限、IAM認可）

## 4. 再現性要件（出力必須）
- schema_version
- engine_version
- tables_version
- config_hash
- flags（節入り計算のフラグ等）
