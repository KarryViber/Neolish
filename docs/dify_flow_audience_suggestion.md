# Dify Flow 设计：受众建议

## 1. Flow 目标

根据用户提供的文章大纲，利用 LLM 分析内容，自动推荐相关的目标受众群体列表，帮助用户更好地定位内容。

## 2. 输入 (Input)

*   **变量名:** `article_outline`
*   **类型:** 字符串 (String)
*   **描述:** 用户确认后的文章大纲，建议使用 Markdown 格式或纯文本。

## 3. 输出 (Output)

*   **变量名:** `suggested_audiences`
*   **类型:** JSON 字符串 (String containing JSON)
*   **描述:** 一个包含推荐受众对象的 JSON 数组。每个对象应包含：
    *   `audience_name` (String): 推荐的受众群体名称 (例如："技术爱好者", "小型企业主 (ToB)")。
    *   `description` (String): 对该受众群体的简短描述，说明他们为何可能对该文章内容感兴趣。
    *   `tags` (Array of Strings): 相关的标签 (例如：["ToC", "Technology", "Gadgets"], ["ToB", "SMB", "Business Strategy"])。
*   **示例 JSON 格式:**

```json
[
  {
    "audience_name": "示例受众1 (分类)",
    "description": "描述为什么这类受众会关心这个大纲的内容。",
    "tags": ["标签1", "标签2"]
  },
  {
    "audience_name": "示例受众2 (分类)",
    "description": "描述为什么这类受众会关心这个大纲的内容。",
    "tags": ["标签3", "标签4"]
  }
]
```

## 4. Flow 结构 (Nodes)

1.  **开始 (Start) 节点:**
    *   定义输入变量 `article_outline`。
2.  **LLM 节点:**
    *   接收 `article_outline` 作为输入。
    *   使用精心设计的 Prompt (见下一节) 进行分析。
    *   输出包含受众建议的 JSON 字符串。
3.  **结束 (End) 节点:**
    *   将 LLM 节点的输出映射到 `suggested_audiences` 变量。

## 5. LLM Prompt 设计

(待填充 - 这是设计的核心部分)

**System Prompt:**

```markdown
你是一位专业的市场分析师和内容策略师。你的任务是根据提供的文章大纲，分析其核心内容、潜在价值点，并据此推荐 3-5 个最相关、最具体的目标受众群体。

你需要为每个推荐的受众提供以下信息：
1.  **受众名称 (audience_name):** 清晰、具体，能准确描述群体特征。如果适用，请在括号内标注 ToB 或 ToC。
2.  **描述 (description):** 简明扼要地解释为什么这个群体会对基于该大纲的文章内容感兴趣，突出文章能为他们解决的问题或提供的价值。
3.  **标签 (tags):** 提供 3-5 个精准描述该群体的关键词标签，便于分类和理解。

**输出要求:**
*   严格按照 JSON 数组格式输出结果。
*   数组中的每个元素都是一个代表受众群体的 JSON 对象，包含 `audience_name`, `description`, 和 `tags` 三个键。
*   确保输出的 JSON 格式有效且完整。
*   **绝对不要** 在 JSON 输出之外添加任何额外的文本、解释或注释。只输出纯粹的 JSON 数组。

**示例输出格式:**

```json
[
  {
    "audience_name": "示例受众1 (ToC)",
    "description": "因为文章解决了他们 [痛点A] 并提供了 [价值B]。",
    "tags": ["兴趣1", "特征1", "需求1"]
  },
  {
    "audience_name": "示例受众2 (ToB)",
    "description": "该群体关注 [业务目标C]，文章中的 [内容D] 能帮助他们实现。",
    "tags": ["行业2", "职位2", "规模2"]
  }
]
```

**User Prompt:**

```markdown
请分析以下文章大纲，并根据你作为专业市场分析师的角色和要求，推荐 3-5 个目标受众群体。

**文章大纲:**
```
{{article_outline}}
```

请务必严格遵循 System Prompt 中定义的 JSON 输出格式。
