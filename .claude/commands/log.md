# /log - 現在のセッションIssueにログを追加

現在のセッションで行った作業をGitHub Issueにコメントとして追加します。

## 手順

1. まず現在のセッションIssue番号を確認:
```bash
cat .claude/.current-session
```

2. Issue番号がない場合は新規作成:
```bash
.claude/hooks/session-start.sh
```

3. このセッションで行った作業を要約し、以下のコマンドでIssueにコメント追加:
```bash
ISSUE=$(cat .claude/.current-session)
gh issue comment $ISSUE --repo taiyousan15/3mei2026 --body "$(cat <<'EOF'
## 作業ログ - $(date "+%Y-%m-%d %H:%M")

### 実施内容
- [作業内容を箇条書き]

### 変更ファイル
- `path/to/file`

### 次のステップ
- [ ] TODO

---
🤖 Claude Code Log
EOF
)"
```

4. コメント追加後、Issue URLを表示

## 自動化

- **セッション開始**: `.claude/hooks/session-start.sh` でIssue自動作成
- **セッション終了**: `.claude/hooks/session-log-github.sh` で自動ログ＆クローズ
