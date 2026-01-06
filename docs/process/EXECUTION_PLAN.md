# 実行計画書（フェーズ／成果物／ゲート）

## Phase 0: 基盤整備
成果物:
- docs（要件・仕様・運用）確定
- Claude Code運用（CLAUDE.md / .claude/commands）
- リポジトリ雛形（web/engine/infra）

ゲート:
- ドキュメントとディレクトリが整備され、実装開始できる状態

## Phase 1: Engine MVP（精度最優先）
成果物:
- 節入り（12節）、真太陽時、4柱、蔵干（動的境界）、星テーブル参照
- Golden 50件以上（境界中心）

ゲート（Exit Criteria）:
- Golden回帰100%一致
- 境界系ケースが含まれる

## Phase 2: Web MVP（入力→計算→表示→保存）
成果物:
- /charts/new → compute → 表示
- 保存/履歴/共有（最小）
- プリセット管理（最小）

ゲート:
- 保存→再取得で再現性メタ一致

## Phase 3: GCP本番運用
成果物:
- Cloud Run（web/engine）、Cloud SQL、Secret Manager
- 監視・アラート最小構成
- ロールバック手順

ゲート:
- ステージング→本番の段階デプロイが運用可能

## Phase 4: 拡張
- 位相法、旧暦入力、鑑定文生成など
