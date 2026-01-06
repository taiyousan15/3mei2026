# TAISUN Agent はじめてガイド

このガイドでは、TAISUN Agentを初めて使用する方向けに、環境構築から基本的な使い方までを説明します。

## 目次

- [前提条件](#前提条件)
- [インストール](#インストール)
- [環境診断 (npm run doctor)](#環境診断-npm-run-doctor)
- [GitHub認証](#github認証)
- [GitHub CLI導入](#github-cli導入)
- [基本的な使い方](#基本的な使い方)
- [ロケール設定](#ロケール設定)
- [Issueログの自動投稿](#issueログの自動投稿)
- [トラブルシューティング](#トラブルシューティング)

## 前提条件

### 必須ソフトウェア

| ソフトウェア | 必要バージョン | 確認コマンド |
|-------------|--------------|-------------|
| Node.js | 18.0.0 以上 | `node --version` |
| npm | 8.0.0 以上 | `npm --version` |
| Git | 2.0.0 以上 | `git --version` |

### 推奨ソフトウェア

| ソフトウェア | 用途 | インストール |
|-------------|-----|-------------|
| GitHub CLI (gh) | Issue/PR操作 | `brew install gh` |
| pnpm | 高速パッケージ管理 | `npm install -g pnpm` |

## インストール

### 1. リポジトリをクローン

```bash
git clone https://github.com/your-org/taisun_agent.git
cd taisun_agent
```

### 2. 依存関係をインストール

```bash
npm install
# または
pnpm install
```

### 3. 環境変数を設定

```bash
# .envファイルを作成
cp .env.example .env
```

`.env` ファイルを編集して必要な値を設定します：

```bash
# 必須
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx

# オプション（日本語でIssueログを出力する場合）
TAISUN_LOCALE=ja
```

### 4. ビルド

```bash
npm run build
```

## 環境診断 (npm run doctor)

TAISUN Agentは環境診断ツールを提供しています。セットアップ後、以下のコマンドで環境が正しく構成されているか確認してください。

### 診断の実行

```bash
npm run doctor
```

### 出力例（正常時）

```
=== Environment Check ===

✅ Node.js: Node.js 20.10.0 is installed
✅ Git: Git is configured
✅ .env File: .env file exists
✅ GITHUB_TOKEN: GITHUB_TOKEN is configured
✅ GitHub CLI: GitHub CLI is installed and logged in
✅ Repository: Repository detected from git: owner/repo
✅ Config Files: All required config files exist
✅ Issue Log Config: Issue logging enabled (locale: ja)
✅ Issue Posting: Issue posting is ready

--- Summary ---
✅ All critical checks passed
```

### 出力例（問題がある場合）

```
=== Environment Check ===

✅ Node.js: Node.js 20.10.0 is installed
✅ Git: Git is configured
⚠️ .env File: .env file not found

Copy .env.example to .env and fill in the values:
  cp .env.example .env

❌ GITHUB_TOKEN: GITHUB_TOKEN is not set

⚠️ GITHUB_TOKEN が未設定です

GitHubとの連携機能を使用するには、GITHUB_TOKENの設定が必要です。

### 設定手順
1. GitHub Settings → Developer settings → Personal access tokens
2. "Generate new token (classic)" をクリック
3. 必要なスコープを選択: repo, workflow
4. トークンを生成してコピー
5. .env ファイルに追加: GITHUB_TOKEN=your_token_here

詳細: docs/getting-started-ja.md#github認証

--- Summary ---
❌ 1 critical issue(s) found
⚠️ 1 warning(s)
```

### チェック項目

| 項目 | 必須 | 説明 |
|-----|-----|-----|
| Node.js | ✅ | Node.js 18.0.0以上がインストールされているか |
| Git | ✅ | Gitが設定されているか |
| .env File | ⚠️ | .envファイルが存在するか |
| GITHUB_TOKEN | ✅ | GitHub Personal Access Tokenが設定されているか |
| GitHub CLI | ⚠️ | gh CLIがインストール・ログインされているか |
| Repository | ✅ | GitHubリポジトリが特定できるか |
| Config Files | ⚠️ | 必要な設定ファイルが存在するか |
| Issue Log Config | ⚠️ | Issueログの設定が有効か |
| Issue Posting | ✅ | Issue投稿の準備ができているか |

**重要**: Issue投稿に関する項目が❌の場合、Supervisorは処理を開始せず、設定方法を案内して停止します。これはログが残せない状態での実行を防ぐための安全機能です。

## GitHub認証

TAISUN AgentはGitHubと連携して動作します。以下の手順でGitHub認証を設定してください。

### Personal Access Token (PAT) の作成

1. [GitHub Settings](https://github.com/settings/tokens) にアクセス
2. 「Generate new token (classic)」をクリック
3. 以下のスコープを選択：
   - `repo` - プライベートリポジトリへのアクセス
   - `workflow` - GitHub Actionsの操作
   - `read:org` - 組織情報の読み取り（組織リポジトリを使用する場合）
4. トークンを生成してコピー
5. `.env` ファイルに追加：

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
```

### 確認方法

```bash
# トークンが設定されているか確認
echo $GITHUB_TOKEN

# GitHubへの接続テスト
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

## GitHub CLI導入

GitHub CLI (`gh`) を使用すると、コマンドラインからIssueやPRを操作できます。

### インストール

#### macOS

```bash
brew install gh
```

#### Windows

```bash
winget install GitHub.cli
# または
choco install gh
```

#### Linux (Debian/Ubuntu)

```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### ログイン

```bash
gh auth login
```

対話形式で以下を選択：
1. GitHub.com
2. HTTPS
3. Login with a web browser（推奨）またはPaste an authentication token

### 確認方法

```bash
# ログイン状態を確認
gh auth status

# 正常な出力例：
# github.com
#   ✓ Logged in to github.com as your-username
#   ✓ Git operations for github.com configured to use https protocol.
```

## 基本的な使い方

### TAISUN Proxyの起動

```bash
# 開発モード
npm run proxy:dev

# 本番モード
npm run proxy:start
```

### スキルの実行

```bash
# PDF解析
/pdf-inspect /path/to/document.pdf

# セキュリティスキャン
/security-scan

# コードレビュー
/review-code
```

### エージェントの実行

```bash
# Issueの自動処理
/miyabi-agent

# ステータス確認
/miyabi-status
```

## ロケール設定

TAISUN AgentはIssueログやシステムメッセージを日本語または英語で出力できます。

### 設定方法

#### 方法1: 環境変数で設定（推奨）

```bash
# .envファイルに追加
TAISUN_LOCALE=ja  # 日本語
# または
TAISUN_LOCALE=en  # 英語
```

#### 方法2: 設定ファイルで設定

`config/proxy-mcp/logging.json` を作成：

```json
{
  "issueLogLocale": "ja"
}
```

### サポートされているロケール

| 値 | 説明 |
|----|-----|
| `ja` | 日本語（デフォルト） |
| `ja-JP` | 日本語 |
| `en` | 英語 |
| `en-US` | 英語 |

## Issueログの自動投稿

TAISUN Agentは、Supervisor実行時に自動でGitHub Issueにログを投稿します。

### 自動投稿のタイミング

| タイミング | 内容 |
|-----------|------|
| **開始時** | RUNLOG Issue を作成し、実行開始を記録 |
| **計画作成時** | 実行計画とリスクレベルをコメント |
| **承認要求時** | 承認が必要な操作の場合、承認用Issueを作成 |
| **実行完了時** | 実行結果サマリをコメントし、Issueをクローズ |
| **エラー発生時** | エラー内容をコメント |

### 設定ファイル

`config/proxy-mcp/logging.json` で詳細設定が可能です：

```json
{
  "issueLogEnabled": true,
  "issueLogLocale": "ja",
  "repo": "",
  "autoCreateIssues": true,
  "defaultLabels": ["🤖agent-execute", "automated"],
  "runlogTitleTemplate": "[RUNLOG] {taskTitle}",
  "parentIssueTitleTemplate": "[{phase}] {taskTitle}",
  "progressLogGranularity": "milestone",
  "postOnStart": true,
  "postOnProgress": true,
  "postOnRequireHuman": true,
  "postOnFinish": true,
  "closeOnComplete": true
}
```

### 設定項目の説明

| 項目 | デフォルト | 説明 |
|-----|----------|------|
| `issueLogEnabled` | true | Issueログを有効にするか |
| `issueLogLocale` | ja | ログの言語（ja/en） |
| `repo` | 空 | リポジトリ（空の場合はgit remoteから自動検出） |
| `autoCreateIssues` | true | Issueを自動作成するか |
| `defaultLabels` | [] | 自動付与するラベル |
| `progressLogGranularity` | milestone | ログの粒度（milestone/step） |
| `closeOnComplete` | true | 完了時にIssueをクローズするか |

### Issueにログが残らない時のチェックリスト

1. **`npm run doctor` を実行**
   - Issue Postingが✅になっているか確認

2. **GITHUB_TOKEN を確認**
   ```bash
   echo $GITHUB_TOKEN
   # 値が表示されるか確認
   ```

3. **gh CLI のログイン状態を確認**
   ```bash
   gh auth status
   # "Logged in" と表示されるか確認
   ```

4. **リポジトリが特定できるか確認**
   ```bash
   git remote -v
   # origin が設定されているか確認
   ```

5. **logging.json を確認**
   ```bash
   cat config/proxy-mcp/logging.json
   # issueLogEnabled が true になっているか確認
   ```

## トラブルシューティング

### GITHUB_TOKEN が未設定

**症状:**
```
⚠️ GITHUB_TOKEN が未設定です
```

**解決方法:**
1. [GitHub認証](#github認証) の手順に従ってトークンを作成
2. `.env` ファイルに `GITHUB_TOKEN=ghp_xxx` を追加
3. ターミナルを再起動するか、`source .env` を実行

### GitHub CLI がログインされていない

**症状:**
```
⚠️ GitHub CLI がログインされていません
```

**解決方法:**
```bash
gh auth login
```

### Node.js バージョンが不足

**症状:**
```
⚠️ Node.js バージョンが不足しています
現在のバージョン: v16.x.x
必要なバージョン: v18.0.0 以上
```

**解決方法:**

#### nvm を使用する場合
```bash
nvm install 18
nvm use 18
```

#### nodenv を使用する場合
```bash
nodenv install 18.0.0
nodenv global 18.0.0
```

#### 直接インストールする場合
[Node.js公式サイト](https://nodejs.org/) から最新のLTSバージョンをダウンロード

### ビルドエラー

**症状:**
```
error TS2xxx: ...
```

**解決方法:**
```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install

# ビルドキャッシュをクリア
rm -rf dist
npm run build
```

### MCP接続エラー

**症状:**
```
[proxy-mcp] Failed to connect to MCP server
```

**解決方法:**
1. MCPサーバーが起動しているか確認
2. `config/proxy-mcp/internal-mcps.json` の設定を確認
3. 必要な依存関係がインストールされているか確認

## 次のステップ

- [アーキテクチャドキュメント](./architecture.md) - システム設計の詳細
- [スキル一覧](../.claude/skills/) - 利用可能なスキル
- [エージェント一覧](../.claude/agents/) - 利用可能なエージェント
- [FAQ](./faq.md) - よくある質問

## サポート

問題が解決しない場合は、以下の方法でサポートを受けられます：

1. [GitHub Issues](https://github.com/your-org/taisun_agent/issues) で新しいIssueを作成
2. Slackの `#taisun-support` チャンネルで質問

---

*このドキュメントは TAISUN Agent P20 で追加されました。*
