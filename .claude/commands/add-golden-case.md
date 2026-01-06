# /project:add-golden-case

目的: 新しいGolden Caseを追加し、回帰テストに組み込む。

手順:
1) apps/engine/tests/data/golden/cases/_template.json を複製し新ファイルを作る
2) id/title/source/input/expected/assert.paths を埋める（例示値を残さない）
3) 境界ケースの場合、前後±数分のペアケースも追加する
4) `pytest -q tests/golden -k <id>` で検証する
