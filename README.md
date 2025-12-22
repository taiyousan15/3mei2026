# TAISUN v2 - Unified Development System

世界最高品質のシステム開発を実現する統合開発環境。

## 概要

TAISUN v2は、AIT42エージェントシステム、マーケティングスキル、MCP統合を一元管理する
統合開発プラットフォームです。

### 特徴

- **49種類の専門エージェント** - 設計から運用まで全フェーズをカバー
- **24種類の統合スキル** - マーケティング、クリエイティブ、インフラ自動化
- **メモリシステム** - エージェント学習と品質追跡
- **MCP統合** - Notion、PostgreSQL、GitHub等との連携

## クイックスタート

```bash
# リポジトリクローン
git clone <repository-url> taisun_v2
cd taisun_v2

# 依存関係インストール
npm install

# 環境設定
cp .env.example .env
# .envを編集して必要な認証情報を設定
```

## ディレクトリ構造

```
taisun_v2/
├── .claude/
│   ├── CLAUDE.md          # プロジェクト指示書
│   ├── settings.json      # 設定
│   ├── agents/            # 49種のエージェント定義
│   ├── commands/          # 統合コマンド
│   ├── skills/            # 24種の統合スキル
│   └── memory/            # 学習・統計システム
├── .mcp.json              # MCP設定
├── src/                   # ソースコード
├── docs/                  # ドキュメント
├── scripts/               # ユーティリティ
└── config/                # 環境設定
```

## エージェントカテゴリ

| カテゴリ | エージェント数 | 主な用途 |
|---------|-------------|---------|
| Coordinators | 4 | オーケストレーション |
| Architecture | 6 | 設計・アーキテクチャ |
| Development | 6 | 実装 |
| Quality Assurance | 8 | テスト・品質保証 |
| Operations | 8 | DevOps・運用 |
| Documentation | 3 | ドキュメント |
| Analysis | 4 | 分析・改善 |
| Specialized | 5 | 特化型タスク |
| Multi-Agent | 4 | マルチエージェントモード |
| Process | 5 | プロセス管理 |

## スキルカテゴリ

### Marketing & Content
- copywriting-helper, sales-letter, step-mail, vsl
- launch-video, lp-generator, funnel-builder
- mendan-lp, lp-analysis, customer-support, tommy-style

### Creative & Media
- gemini-image-generator (統合画像生成)
- japanese-tts-reading, nanobanana-prompts

### Infrastructure & Automation
- workflow-automation-n8n, docker-mcp-ops
- security-scan-trivy, pdf-automation-gotenberg
- doc-convert-pandoc, unified-notifications-apprise
- postgres-mcp-analyst, notion-knowledge-mcp, nlq-bi-wrenai

### Research
- research-cited-report

## 使用方法

### エージェント呼び出し

```
# システムアーキテクチャ設計
Task(subagent_type="system-architect", prompt="マイクロサービス設計...")

# バックエンド実装
Task(subagent_type="backend-developer", prompt="認証API実装...")

# コードレビュー
Task(subagent_type="code-reviewer", prompt="PRレビュー...")
```

### スキル実行

```
# 画像生成
/gemini-image-generator thumbnail "YouTube動画タイトル"

# LP作成
/lp-generator normal --product "オンライン講座"

# ファネル構築
/funnel-builder kindle --product "電子書籍"
```

## 統合による改善点

| 項目 | 統合前 | 統合後 | 改善率 |
|------|--------|--------|--------|
| エージェント管理 | 分散（3箇所） | 統合（1箇所） | 66%削減 |
| スキル重複 | 5件 | 0件 | 100%解消 |
| 設定ファイル | 分散 | 統合 | 一元管理 |
| メモリシステム | 不整合 | 統合 | 完全統合 |

## 品質ゲート

- コードレビュースコア: 80点以上
- テストカバレッジ: 80%以上
- セキュリティスキャン: Critical/Highゼロ

## ライセンス

MIT License

## 貢献

プルリクエスト歓迎します。大きな変更は事前にIssueで議論してください。
