# TAISUN v2 - Unified Development System

## Overview
世界最高品質のシステム開発を実現する統合開発環境。
AIT42エージェントシステム、マーケティングスキル、MCP統合を一元管理。

## System Architecture

```
taisun_v2/
├── .claude/
│   ├── CLAUDE.md          # このファイル（プロジェクト指示書）
│   ├── settings.json      # パーミッション・設定
│   ├── agents/            # 統合エージェント定義（49種）
│   ├── commands/          # 統合コマンド（カテゴリ別）
│   ├── skills/            # 統合スキル（重複排除済み）
│   └── memory/            # 学習・統計システム
├── src/                   # ソースコード
├── docs/                  # ドキュメント
├── scripts/               # ユーティリティスクリプト
└── config/                # 環境設定
```

## Agent Categories

### 1. Coordinators (オーケストレーション)
- `ait42-coordinator` - メインコーディネーター
- `ait42-coordinator-fast` - 軽量O(1)選択
- `omega-aware-coordinator` - Ω関数理論ベース
- `self-healing-coordinator` - 自己修復システム

### 2. Architecture & Design (設計)
- `system-architect` - システムアーキテクチャ
- `api-designer` - API設計
- `database-designer` - データベース設計
- `security-architect` - セキュリティ設計
- `cloud-architect` - クラウドアーキテクチャ
- `ui-ux-designer` - UI/UX設計

### 3. Development (開発)
- `backend-developer` - バックエンド実装
- `frontend-developer` - フロントエンド実装
- `api-developer` - API実装
- `database-developer` - データベース実装
- `integration-developer` - 統合実装
- `migration-developer` - マイグレーション

### 4. Quality Assurance (品質保証)
- `code-reviewer` - コードレビュー
- `test-generator` - テスト生成
- `qa-validator` - 品質検証
- `integration-tester` - 統合テスト
- `security-tester` - セキュリティテスト
- `performance-tester` - パフォーマンステスト
- `mutation-tester` - ミューテーションテスト
- `chaos-engineer` - カオスエンジニアリング

### 5. Operations (運用)
- `devops-engineer` - DevOps
- `cicd-manager` - CI/CDパイプライン
- `monitoring-specialist` - 監視・オブザーバビリティ
- `incident-responder` - インシデント対応
- `backup-manager` - バックアップ管理
- `container-specialist` - コンテナ最適化
- `config-manager` - 設定管理
- `release-manager` - リリース管理

### 6. Documentation (ドキュメント)
- `tech-writer` - 技術文書
- `doc-reviewer` - ドキュメントレビュー
- `knowledge-manager` - ナレッジ管理

### 7. Analysis (分析)
- `complexity-analyzer` - 複雑度分析
- `feedback-analyzer` - フィードバック分析
- `innovation-scout` - 技術トレンド分析
- `learning-agent` - 学習キャプチャ

### 8. Specialized (特化型)
- `bug-fixer` - バグ修正
- `refactor-specialist` - リファクタリング
- `feature-builder` - 新機能実装
- `script-writer` - スクリプト作成
- `implementation-assistant` - 実装支援

### 9. Multi-Agent Modes (マルチエージェント)
- `multi-agent-competition` - 競争モード
- `multi-agent-debate` - 討論モード
- `multi-agent-ensemble` - アンサンブルモード
- `reflection-agent` - 品質ゲーティング

### 10. Process & Integration (プロセス)
- `workflow-coordinator` - ワークフロー最適化
- `integration-planner` - 統合計画
- `process-optimizer` - プロセス最適化
- `metrics-collector` - メトリクス収集
- `requirements-elicitation` - 要件引き出し

## Skill Categories

### Marketing & Content
- `copywriting-helper` - コピーライティング支援
- `sales-letter` - セールスレター作成
- `step-mail` - ステップメール作成
- `vsl` - ビデオセールスレター
- `launch-video` - ローンチ動画
- `lp-generator` - LP作成（通常/漫画統合）
- `funnel-builder` - ファネル構築（Kindle/note統合）
- `mendan-lp` - 面談LP作成
- `lp-analysis` - LP分析
- `customer-support` - カスタマーサポート
- `tommy-style` - トミースタイル

### Creative & Media
- `gemini-image-generator` - 画像生成（NanoBanana統合）
- `japanese-tts-reading` - 日本語TTS
- `nanobanana-prompts` - プロンプト生成

### Infrastructure & Automation
- `workflow-automation-n8n` - n8nワークフロー
- `docker-mcp-ops` - Dockerオペレーション
- `security-scan-trivy` - セキュリティスキャン
- `pdf-automation-gotenberg` - PDF自動化
- `doc-convert-pandoc` - ドキュメント変換
- `unified-notifications-apprise` - 通知統合
- `postgres-mcp-analyst` - PostgreSQL分析
- `notion-knowledge-mcp` - Notionナレッジ
- `nlq-bi-wrenai` - 自然言語BI

### Research
- `research-cited-report` - 出典付きリサーチ

## MCP Servers

```json
{
  "mcpServers": {
    "notion": {
      "type": "http",
      "url": "https://mcp.notion.com/mcp"
    },
    "postgres-ro": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${POSTGRES_MCP_DSN}"]
    },
    "ide": {
      "type": "builtin"
    }
  }
}
```

## Guidelines

### Development Principles
1. **TDD First** - テスト駆動開発を基本とする
2. **Clean Architecture** - レイヤー分離を維持
3. **SOLID Principles** - 設計原則を遵守
4. **Security by Design** - セキュリティを設計段階から組み込む

### Agent Selection
1. タスクに最適なエージェントを自動選択（Coordinator経由）
2. 複雑なタスクは複数エージェントを並列実行
3. 品質ゲートでreflection-agentを使用

### Quality Gates
- コードレビュースコア: 80点以上必須
- テストカバレッジ: 80%以上
- セキュリティスキャン: Critical/High脆弱性ゼロ

## Language
- 日本語でのコミュニケーションを優先
- 技術用語は英語でも可
- マーケティング用語・専門用語を適切に使用
