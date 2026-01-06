#!/bin/bash
# session-log-github.sh - セッション終了時にGitHub Issueへ自動ログ
#
# 使用方法: settings.json または settings.local.json に追加
# {
#   "hooks": {
#     "Stop": [{ "command": ".claude/hooks/session-log-github.sh" }]
#   }
# }

set -e

REPO="taiyousan15/3mei2026"
ISSUE_NUMBER="1"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

# 最新のgitログを取得（直近のコミット）
RECENT_COMMITS=$(git log --oneline -5 2>/dev/null || echo "No commits")

# 変更ファイルを取得
CHANGED_FILES=$(git diff --name-only HEAD~1 2>/dev/null | head -10 || echo "No changes")

# GitHub Issueにコメント追加
gh issue comment "$ISSUE_NUMBER" --repo "$REPO" --body "$(cat <<EOF
## セッション終了ログ - $TIMESTAMP

### 直近のコミット
\`\`\`
$RECENT_COMMITS
\`\`\`

### 変更ファイル
\`\`\`
$CHANGED_FILES
\`\`\`

---
🤖 Auto-logged by Claude Code (session end)
EOF
)" 2>/dev/null || echo "Failed to post to GitHub Issue"

echo "Session logged to GitHub Issue #$ISSUE_NUMBER"
