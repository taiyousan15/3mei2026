# /project:validate-tables

目的: data/tables のCSV/TSV破損を早期検知する

手順:
1) apps/engine ディレクトリで `python scripts/validate_tables.py --strict` を実行
2) エラーが出た場合はテーブルのフォーマット・値を修正する
