# /project:validate-golden

目的: Goldenケース品質検証（必須キー、JSON pointer の存在、重複ID等）

手順:
1) apps/engine ディレクトリで `python scripts/validate_golden.py` を実行
2) エラーが出た場合はケースを修正し、CIゲートを通す
