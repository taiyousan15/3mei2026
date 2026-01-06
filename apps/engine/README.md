# apps/engine（高精度計算エンジン）

ここに計算エンジン（天文カーネル + 暦ロジック + 算命学ロジック）を実装します。

必須:
- Golden Data と100%一致（= 精度の定義）
- 近似禁止（節入り/真太陽時/蔵干境界）
- 十大主星/十二大従星はテーブル参照（データ駆動）
- 出力に再現性メタを必ず含める

推奨:
- APIフレームワーク: FastAPI（Cloud Runで運用しやすい）
- tests/golden に Golden 回帰テストを配置
- scripts/validate_golden.py / validate_tables.py を配置
