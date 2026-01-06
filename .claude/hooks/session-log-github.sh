#!/bin/bash
# session-log-github.sh - セッション終了時にGitHub Issueへ自動ログ

set -e

REPO="taiyousan15/3mei2026"
SESSION_FILE=".claude/.current-session"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

# セッションIssue番号を取得
if [ ! -f "$SESSION_FILE" ]; then
  echo "No active session found"
  exit 0
fi

ISSUE_NUMBER=$(cat "$SESSION_FILE")
if [ -z "$ISSUE_NUMBER" ]; then
  echo "No session Issue number"
  exit 0
fi

# 最新のgitログを取得
RECENT_COMMITS=$(git log --oneline -5 2>/dev/null || echo "No commits")

# 変更ファイルを取得
CHANGED_FILES=$(git status --short 2>/dev/null | head -15 || echo "No changes")

# GitHub Issueにコメント追加
gh issue comment "$ISSUE_NUMBER" --repo "$REPO" --body "$(cat <<EOF
## セッション終了: $TIMESTAMP

### 直近のコミット
\`\`\`
$RECENT_COMMITS
\`\`\`

### ファイル状態
\`\`\`
$CHANGED_FILES
\`\`\`

---
🤖 Auto-logged (session end)
EOF
)" 2>/dev/null && echo "Logged to Issue #$ISSUE_NUMBER"

# Issueをクローズ
gh issue close "$ISSUE_NUMBER" --repo "$REPO" --comment "セッション終了 - $TIMESTAMP" 2>/dev/null || true

# セッションファイルをクリア
rm -f "$SESSION_FILE"
