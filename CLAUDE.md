# Claude Code 開発規約（このリポジトリの"憲法"運用版）

## 参照（必読）
- 憲法（非交渉事項）: docs/requirements/00_CONSTITUTION.md
- 要件定義（全文・人間用）: docs/requirements/01_REQUIREMENTS.md
- 技術要件: docs/requirements/02_TECH_REQUIREMENTS.md
- 仕様（UI/API/DB）: docs/specs/
- ワークフロー: docs/process/WORKFLOW.md
- 実行計画書: docs/process/EXECUTION_PLAN.md

## Claude Code が必ず守ること（最重要）
1. 近似禁止（節入り・真太陽時・JDN/JD・蔵干境界）
2. 流派差分は設定化（0:00/23:00、晩子時/早子時、南半球モード等）
3. 変更は必ずテストで担保（Golden回帰が「定義上の正しさ」）
4. 再現性メタ（engine_version / schema_version / config_hash / tables_version / flags）を出力・保存する
5. Golden expected を「テストを通すため」に書き換えない（根拠ある仕様変更のみ例外）

## CIゲート（必須順）
- Gate 1: Goldenケース品質検証（validate_golden）
- Gate 2: Golden回帰（pytest tests/golden）
（推奨）Gate 0: テーブル検証（validate_tables）

## 作業方針（Claude Codeへの指示テンプレ）
- 実装/修正前に、対象の要件ID/仕様IDを明示する
- 影響範囲を docs とコードの両方に反映する
- 境界ケース（節入り±数分、子刻境界）を優先してGoldenに追加する
- 実装は "決定論 + データ駆動（テーブル参照）" を優先する
- UIやDBの前に「計算エンジンの精度（Golden）」を固める
