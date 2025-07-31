# Mevius 系统数据库模式文档

本文档详细描述了 Mevius 系统所需的数据库表结构及其字段定义。

## 1. 用户 (Users)

存储用户信息。

| 字段名         | 数据类型        | 约束/注释                                     | 用途                         | 数据来源          | 上下游关联/相关字段                                  |
| -------------- | --------------- | --------------------------------------------- | ---------------------------- | --------------- | -------------------------------------------------- |
| `user_id`      | INT             | AUTO_INCREMENT PRIMARY KEY                    | 用户唯一标识符               | 系统生成          | 作为外键关联到 StyleProfiles, Outlines, Articles, AsyncTasks |
| `username`     | VARCHAR(255)    | UNIQUE NOT NULL                               | 用户登录名                   | 用户注册          | 用于登录验证                                       |
| `email`        | VARCHAR(255)    | UNIQUE NOT NULL                               | 用户邮箱                     | 用户注册          | 用于登录、通知                                     |
| `password_hash`| VARCHAR(255)    | NOT NULL                                      | 加密后的用户密码             | 系统生成（基于用户输入） | 用于登录验证                                       |
| `created_at`   | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP                     | 记录创建时间                 | 系统生成          |                                                    |
| `updated_at`   | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 记录最后更新时间             | 系统生成          |                                                    |

## 2. 风格画像 (StyleProfiles)

存储用户分析或手动创建的写作风格。

| 字段名                | 数据类型        | 约束/注释                                     | 用途                                   | 数据来源                        | 上下游关联/相关字段                                  |
| --------------------- | --------------- | --------------------------------------------- | -------------------------------------- | ------------------------------- | -------------------------------------------------- |
| `profile_id`          | INT             | AUTO_INCREMENT PRIMARY KEY                    | 风格画像唯一标识符                     | 系统生成                        | 作为外键关联到 Articles                             |
| `user_id`             | INT             | NOT NULL, FK -> Users(user_id)                | 关联的用户                             | 系统（基于当前登录用户）      | 确定数据归属                                       |
| `name`                | VARCHAR(255)    | NOT NULL                                      | 用户命名的画像名称                     | 用户输入                        | 在 UI 中显示供用户选择                             |
| `source_urls`         | JSON            |                                               | 分析来源 URL 列表                        | 用户输入 (Flow 1 输入)           | 记录分析来源                                       |
| `analysis_result_raw` | JSON            | Flow 1 原始输出或编辑后结果                   | 存储 Dify Flow 1 的分析结果            | Dify Flow 1 输出 / 用户编辑     | 用于填充 author_info, style_features, sample_text |
| `author_info`         | TEXT            |                                               | 提取或手动输入的作者信息               | Dify Flow 1 输出 / 用户输入     | 可能用于内容生成参考                               |
| `style_features`      | TEXT            |                                               | 提取或手动输入的文体特征/关键词          | Dify Flow 1 输出 / 用户输入     | 可能用于内容生成参考                               |
| `sample_text`         | TEXT            |                                               | 提取或手动输入的样例文本               | Dify Flow 1 输出 / 用户输入     | 可能用于内容生成参考                               |
| `is_manual`           | BOOLEAN         | DEFAULT FALSE                                 | 是否为手动创建                         | 系统判断/用户选择               | 区分画像来源                                       |
| `created_at`          | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP                     | 记录创建时间                           | 系统生成                        |                                                    |
| `updated_at`          | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 记录最后更新时间                       | 系统生成                        |                                                    |

## 3. 目标受众 (Audiences)

存储目标受众信息。

| 字段名         | 数据类型     | 约束/注释                  | 用途             | 数据来源                       | 上下游关联/相关字段                          |
| -------------- | ------------ | -------------------------- | ---------------- | ------------------------------ | ------------------------------------------ |
| `audience_id`  | INT          | AUTO_INCREMENT PRIMARY KEY | 受众唯一标识符   | 系统生成                       | 作为外键关联到 OutlineAudiences            |
| `name`         | VARCHAR(255) | NOT NULL                   | 受众名称         | Dify Flow 3 建议 / 用户输入    | 在 UI 中显示，用于关联大纲             |
| `description`  | TEXT         |                            | 可选描述         | Dify Flow 3 建议 / 用户输入    | 补充说明                                   |
| `category`     | VARCHAR(50)  | 如 ToB, ToC                | 受众分类         | 从 Flow 3 tags 推断 / 用户输入 | 用于筛选或区分                             |
| `created_at`   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP  | 记录创建时间     | 系统生成                       |                                            |

## 4. 大纲 (Outlines)

存储文章大纲及其关联信息。

| 字段名                        | 数据类型     | 约束/注释                                           | 用途                                   | 数据来源                        | 上下游关联/相关字段                                                      |
| ----------------------------- | ------------ | --------------------------------------------------- | -------------------------------------- | ------------------------------- | ---------------------------------------------------------------------- |
| `outline_id`                  | INT          | AUTO_INCREMENT PRIMARY KEY                          | 大纲唯一标识符                         | 系统生成                        | 作为外键关联到 OutlineAudiences, Articles                               |
| `user_id`                     | INT          | NOT NULL, FK -> Users(user_id)                      | 关联的用户                             | 系统（基于当前登录用户）      | 确定数据归属                                                           |
| `name`                        | VARCHAR(255) | 可选, 用户命名                                      | 大纲名称                               | 用户输入                        | 在 UI 中显示                                                           |
| `key_points_input`            | TEXT         | Flow 2 输入                                         | 用户输入的原始要点                     | 用户输入                        | 作为 Flow 2 输入                                                       |
| `selected_style_profile_snapshot` | JSON         | Flow 2 输入 (风格画像快照)                          | 生成大纲时使用的风格画像               | 用户选择 (关联 StyleProfiles)   | 作为 Flow 2 输入                                                       |
| `generated_outline_markdown`  | TEXT         | Flow 2 输出                                         | Dify Flow 2 生成的原始大纲             | Dify Flow 2 输出              | 在 UI 中展示给用户确认                                                  |
| `confirmed_outline_markdown`  | TEXT         | 用户确认/编辑后的大纲                               | 最终确认用于生成内容的大纲             | 用户确认/编辑                   | 作为 Flow 3 (受众建议) 和 Flow 4 (内容生成) 的输入                     |
| `suggested_audiences_result`  | JSON         | Flow 3 输出                                         | Dify Flow 3 建议的目标受众结果         | Dify Flow 3 输出              | 在新建/编辑大纲时展示给用户，辅助选择关联受众                          |
| `created_at`                  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                           | 记录创建时间                           | 系统生成                        |                                                                        |
| `updated_at`                  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 记录最后更新时间                       | 系统生成                        |                                                                        |

## 5. 大纲-目标受众关联表 (OutlineAudiences)

用于存储大纲和目标受众的多对多关系。

| 字段名                | 数据类型   | 约束/注释                                           | 用途                     | 数据来源                     | 上下游关联/相关字段                                  |
| --------------------- | ---------- | --------------------------------------------------- | ------------------------ | ---------------------------- | -------------------------------------------------- |
| `outline_audience_id` | INT        | AUTO_INCREMENT PRIMARY KEY                          | 关联记录唯一标识符       | 系统生成                     |                                                    |
| `outline_id`          | INT        | NOT NULL, FK -> Outlines(outline_id) ON DELETE CASCADE | 关联的大纲 ID            | 用户选择 (在新建/编辑大纲时) | 连接 Outlines 表                                   |
| `audience_id`         | INT        | NOT NULL, FK -> Audiences(audience_id) ON DELETE CASCADE | 关联的受众 ID            | 用户选择 (在新建/编辑大纲时) | 连接 Audiences 表                                  |
| `created_at`          | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP                           | 记录关联创建时间         | 系统生成                     |                                                    |

## 6. 文章 (Articles)

核心内容实体。

| 字段名                        | 数据类型                                                                                             | 约束/注释                                      | 用途                               | 数据来源                          | 上下游关联/相关字段                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------- | --------------------------------- | -------------------------------------------------------------------------- |
| `article_id`                  | INT                                                                                                  | AUTO_INCREMENT PRIMARY KEY                     | 文章唯一标识符                     | 系统生成                          | 作为外键关联到 Images, PublishingTasks, AsyncTasks                          |
| `user_id`                     | INT                                                                                                  | NOT NULL, FK -> Users(user_id)                 | 关联的用户                         | 系统（基于当前登录用户）        | 确定数据归属                                                               |
| `outline_id`                  | INT                                                                                                  | NOT NULL, FK -> Outlines(outline_id)           | 关联的大纲                         | 用户选择 (在新建文章向导中)       | 连接 Outlines 表                                                           |
| `style_profile_id`            | INT                                                                                                  | NOT NULL, FK -> StyleProfiles(profile_id)      | 使用的风格画像                     | 用户选择 (在新建文章向导中)       | 连接 StyleProfiles 表, 作为 Flow 4 输入                                    |
| `writing_purposes`            | JSON                                                                                                 | NOT NULL, Flow 4 输入                            | 写作目的列表                       | 用户选择 (在新建文章向导中)       | 作为 Flow 4 输入                                                           |
| `target_audiences_snapshot`   | JSON                                                                                                 | Flow 4 输入 (生成时确认的受众快照)           | 生成文章时使用的目标受众           | 用户确认 (在新建文章向导中)       | 作为 Flow 4 输入, 参考自关联大纲的 OutlineAudiences                      |
| `title`                       | VARCHAR(255)                                                                                         | 可选                                           | 文章标题                           | 用户输入/内容生成                 | 在 UI 中显示                                                               |
| `status`                      | ENUM('Draft', 'GeneratingContent', ..., 'Error')                                                    | DEFAULT 'Draft' NOT NULL                       | 文章当前状态                       | 系统更新 (基于工作流/用户操作) | 在 UI 中显示, 控制可执行操作                                             |
| `generated_content_markdown`  | LONGTEXT                                                                                             | Flow 4 输出 (含图片Prompt)                     | Dify Flow 4 生成的原始文章内容     | Dify Flow 4 输出                | 展示给用户编辑, 作为 Flow 5 (润色) 输入的基础                              |
| `generated_image_prompts`     | JSON                                                                                                 | Flow 4 输出 (结构化图片Prompt)               | Flow 4 输出的图片 Prompt 列表       | Dify Flow 4 输出                | 用于触发 Flow 6 (图片生成)                                                 |
| `edited_content_markdown`     | LONGTEXT                                                                                             | 用户编辑后的内容 (含图片占位符/URL)          | 编辑器中保存的、包含图片的内容     | 用户编辑                          | 可能需要处理图片 URL 替换                                                   |
| `polished_content_markdown`   | LONGTEXT                                                                                             | Flow 5 输出                                    | Dify Flow 5 润色后的最终文章内容   | Dify Flow 5 输出                | 用于最终发布                                                               |
| `created_at`                  | TIMESTAMP                                                                                            | DEFAULT CURRENT_TIMESTAMP                      | 记录创建时间                       | 系统生成                          |                                                                            |
| `updated_at`                  | TIMESTAMP                                                                                            | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 记录最后更新时间                   | 系统生成                          |                                                                            |

## 7. 图片 (Images)

存储为文章生成的图片信息。

| 字段名                  | 数据类型                             | 约束/注释                                      | 用途                       | 数据来源                        | 上下游关联/相关字段                                    |
| ----------------------- | ------------------------------------ | ---------------------------------------------- | -------------------------- | ------------------------------- | ---------------------------------------------------- |
| `image_id`              | INT                                  | AUTO_INCREMENT PRIMARY KEY                     | 图片唯一标识符             | 系统生成                        |                                                      |
| `article_id`            | INT                                  | NOT NULL, FK -> Articles(article_id) ON DELETE CASCADE | 关联的文章                   | 系统 (基于触发操作的上下文)     | 连接 Articles 表                                       |
| `prompt_text`           | TEXT                                 | NOT NULL, Flow 6 输入                            | 生成时使用的 Prompt        | 系统提取 (从 Article) / 用户编辑 | 作为 Flow 6 输入                                       |
| `reference_image_url`   | VARCHAR(1024)                        | Flow 6 输入 (可选)                             | 参考图存储路径/URL         | 用户上传                        | 作为 Flow 6 输入                                       |
| `style_keywords`        | TEXT                                 | Flow 6 输入 (可选)                             | 风格关键词                 | 用户输入                        | 作为 Flow 6 输入                                       |
| `image_specifications`  | JSON                                 | Flow 6 输入 (可选)                             | 图像规格 (如尺寸)          | 用户输入/系统预设             | 作为 Flow 6 输入                                       |
| `image_url`             | VARCHAR(1024)                        | Flow 6 输出 (图片存储路径/URL)               | 生成图片的存储路径或 URL   | Dify Flow 6 输出 / 文件存储服务 | 在文章编辑器和最终内容中引用                           |
| `status`                | ENUM('Pending', ..., 'Failed')      | DEFAULT 'Pending' NOT NULL                     | 图片生成状态               | 系统更新                        | 在 UI 中显示                                           |
| `error_message`         | TEXT                                 | 生成失败时的错误信息                           | 记录失败原因               | 系统/Dify Flow 6                | 用于调试                                           |
| `created_at`            | TIMESTAMP                            | DEFAULT CURRENT_TIMESTAMP                      | 记录创建时间               | 系统生成                        |                                                      |
| `updated_at`            | TIMESTAMP                            | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 记录最后更新时间           | 系统生成                        |                                                      |

## 8. 异步任务 (AsyncTasks)

跟踪所有后台任务的状态。

| 字段名                | 数据类型                             | 约束/注释                                 | 用途                             | 数据来源                  | 上下游关联/相关字段                                          |
| --------------------- | ------------------------------------ | ----------------------------------------- | -------------------------------- | ------------------------- | ---------------------------------------------------------- |
| `task_id`             | VARCHAR(255)                         | PRIMARY KEY (UUID 或 Dify Task ID)          | 任务唯一标识符                   | 系统生成 / Dify API       |                                                            |
| `user_id`             | INT                                  | NOT NULL, FK -> Users(user_id)            | 关联的用户                       | 系统                      | 确定数据归属                                               |
| `task_type`           | ENUM('StyleAnalysis', ..., 'Other') | NOT NULL                                  | 任务类型                         | 系统 (基于触发的操作)     | 区分不同任务                                               |
| `status`              | ENUM('Pending', ..., 'Cancelled')   | DEFAULT 'Pending' NOT NULL                | 任务状态                         | 系统 / Dify Webhook       | 在任务中心显示, 控制流程                                   |
| `related_entity_type` | VARCHAR(50)                          | 可选, 关联实体类型 (如 Article, Outline)  | 任务关联的对象类型               | 系统                      | 方便查询特定对象的任务                                     |
| `related_entity_id`   | VARCHAR(255)                         | 可选, 关联实体的主键值                      | 任务关联的对象 ID                | 系统                      | 方便查询特定对象的任务                                     |
| `input_params`        | JSON                                 | 调用工作流时的输入参数快照                | 记录任务输入                     | 系统                      | 用于调试和重现                                             |
| `result_output`       | JSON                                 | 成功结果或失败错误信息                    | 记录任务输出                     | Dify API / Dify Webhook | 用于更新关联实体的数据或在 UI 显示错误                       |
| `progress`            | TINYINT UNSIGNED                     | DEFAULT 0 (0-100)                         | 任务进度                         | 系统 / Dify (如果支持)    | 在任务中心显示进度条                                       |
| `created_at`          | TIMESTAMP                            | DEFAULT CURRENT_TIMESTAMP                 | 记录创建时间                     | 系统生成                  |                                                            |
| `updated_at`          | TIMESTAMP                            | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 记录最后更新时间                 | 系统生成                  |                                                            |

## 9. 发布任务 (PublishingTasks)

存储发布到特定平台的任务信息 (如果需要比 AsyncTasks 更详细的信息)。

| 字段名                   | 数据类型               | 约束/注释                                      | 用途                     | 数据来源           | 上下游关联/相关字段                       |
| ------------------------ | ---------------------- | ---------------------------------------------- | ------------------------ | ------------------ | --------------------------------------- |
| `publish_task_id`        | INT                    | AUTO_INCREMENT PRIMARY KEY                     | 发布任务唯一标识符       | 系统生成           |                                         |
| `task_id`                | VARCHAR(255)           | UNIQUE, 可选, 关联 AsyncTasks ID               | 关联的异步任务           | 系统               | 连接 AsyncTasks 表                      |
| `article_id`