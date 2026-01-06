# /log - セッションログをGitHub Issueに記録

現在のセッションで行った作業をGitHub Issue #1にコメントとして追加してください。

## 手順

1. このセッションで行った作業を要約
2. 以下の形式でIssue #1にコメントを追加:

```
gh issue comment 1 --repo taiyousan15/3mei2026 --body "$(cat <<'EOF'
## セッションログ - $(date +%Y-%m-%d %H:%M)

### 実施内容
- [作業内容1]
- [作業内容2]

### 変更ファイル
- `path/to/file1`
- `path/to/file2`

### 次のステップ
- [ ] TODO1
- [ ] TODO2

---
🤖 Claude Code Auto-Log
EOF
)"
```

3. コメント追加後、URLを表示

## 注意
- セッション中の主要な作業のみ記録
- 機密情報は含めない
