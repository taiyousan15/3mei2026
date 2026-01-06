# Definition of Done（DoD）

## 変更（共通）
- [ ] 要件/仕様に追記・更新（該当箇所）
- [ ] PRに影響範囲を記載
- [ ] 境界影響（節入り/子刻/真太陽時）を確認

## Engine変更
- [ ] Goldenケース品質検証（validate_golden）が成功
- [ ] Golden回帰（pytest tests/golden）が成功
- [ ] 必要に応じGoldenケース追加（境界中心）
- [ ] 再現性メタ（version/hash/table）更新が必要なら反映

## Web変更
- [ ] lint/typecheck/build が成功
- [ ] Prisma schema/migration が妥当
- [ ] API互換（schema_version）遵守
