#!/bin/bash
# session-start.sh - セッション開始時にIssueを自動作成
#
# 使用: settings.json の PreToolUse または手動実行

set -e

REPO="taiyousan15/3mei2026"
SESSION_FILE=".claude/.current-session"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
DATE_LABEL=$(date "+%Y-%m-%d")

# 既存セッションがあればスキップ
if [ -f "$SESSION_FILE" ]; then
  EXISTING=$(cat "$SESSION_FILE")
  if [ -n "$EXISTING" ]; then
    echo "Session already active: Issue #$EXISTING"
    exit 0
  fi
fi

# 新規Issue作成
ISSUE_URL=$(gh issue create --repo "$REPO" \
  --title "セッションログ: $DATE_LABEL" \
  --label "session-log" \
  --body "$(cat <<EOF
## セッション開始: $TIMESTAMP

**作業ディレクトリ**: $(pwd)
**ブランチ**: $(git branch --show-current 2>/dev/null || echo "N/A")

---

このIssueにセッション中の作業ログが自動記録されます。

🤖 Auto-created by Claude Code
EOF
)" 2>/dev/null)

# Issue番号を抽出して保存
ISSUE_NUMBER=$(echo "$ISSUE_URL" | grep -oE '[0-9]+$')
echo "$ISSUE_NUMBER" > "$SESSION_FILE"

echo "Created session Issue #$ISSUE_NUMBER: $ISSUE_URL"
