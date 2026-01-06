# /project:verify-golden

目的: Golden回帰テストを実行し、差分が出た場合に原因を特定する。

手順:
1) apps/engine ディレクトリで `pytest -q tests/golden` を実行する
2) 失敗ケースを列挙し、差分（期待 vs 実値）を最小限で示す
3) 原則としてコード側を修正し、Golden expected は変更しない
4) 例外で expected を変更する場合は、ケースの source に根拠を追記する
