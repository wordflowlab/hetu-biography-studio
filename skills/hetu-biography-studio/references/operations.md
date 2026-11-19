# 操作地图

由正式清单生成，执行前发现当前安装版Schema。

| 动作 | 用途 | 必填参数 | 效果 |
| --- | --- | --- | --- |
| list_projects | 查找歌词工程 |  | read |
| get_project | 读取固定歌词工程 | object_id | read |
| save_project | 保存完整歌词工程 | expected_revision, expected_sha256, operation_key, content | managed_write |
| get_source | 分块读取固定来源 | object_id, source_index | read |
| get_basis | 读取固定专业依据 | object_id, basis_index | read |
| compare_versions | 比较固定歌词修订 | object_id, from_revision, to_revision | read |
| export_project | 分块导出完整歌词数据 | object_id, format | read |
| build_context | 准备有界创作上下文 | object_id, goal, max_chars | read |
| create_handoff | 准备本工程AI接续 | object_id, goal | read |
| get_operation | 回读原操作 | operation_key | read |
| put_person | 维护人物身份 | object_id, expected_revision, expected_sha256, operation_key, person | managed_write |
| remove_person | 移除人物身份 | object_id, expected_revision, expected_sha256, operation_key, person_id | managed_write |
| put_evidence | 维护固定证据 | object_id, expected_revision, expected_sha256, operation_key, evidence | managed_write |
| put_event | 维护生平事件 | object_id, expected_revision, expected_sha256, operation_key, event | managed_write |
| remove_event | 移除生平事件 | object_id, expected_revision, expected_sha256, operation_key, event_id | managed_write |
| put_identity | 维护身份辨析 | object_id, expected_revision, expected_sha256, operation_key, identity | managed_write |
| put_chapter | 维护传记章节 | object_id, expected_revision, expected_sha256, operation_key, chapter | managed_write |
| remove_chapter | 移除传记章节 | object_id, expected_revision, expected_sha256, operation_key, chapter_id | managed_write |
| put_note | 维护固定意见 | object_id, expected_revision, expected_sha256, operation_key, note | managed_write |
| remove_note | 移除固定意见 | object_id, expected_revision, expected_sha256, operation_key, note_id | managed_write |
| target_digest | 读取固定目标摘要 | object_id, target_kind, target_id | read |
| normalize_date | 解释明确日期与未知范围 | raw | read |
| check_biography | 检查生平与叙述缺口 | object_id | read |
| timeline | 读取生平时间范围 | object_id | read |
| identity_report | 读取身份声明及冲突 | object_id | read |
| chapter_report | 读取章节依据变化 | object_id | read |
| event_digest | 读取固定生平事件摘要 | object_id, event_id | read |
| chapter_basis | 固定选定事件组合 | object_id, event_ids | read |
| person_dossier | 读取人物生平资料 | object_id, person_id | read |
| export_life | 导出专业阅读本 | object_id | read |
| export_review | 导出完整专业审核本 | object_id | read |
