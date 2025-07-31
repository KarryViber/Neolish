# Dify 工作流设计：文章大纲生成 Flow

## 1. 目标

该 Flow 的核心任务是接收用户提供的**文章要点** (`key_points`) 和选定的**风格画像** (`style_profile_json`)，利用 AI 生成一个结构清晰、符合所选风格的文章大纲。大纲应包含建议的标题、主要章节标题、各章节下的关键点，并可选择性地标注建议插入图片的位置。

## 2. 输入

*   `key_points`: 用户输入的核心观点列表（字符串数组）。
*   `style_profile_json`: 用户选择的风格画像 JSON 对象。

## 3. 核心流程

### 3.1 开始节点

*   **接收输入:** 获取用户传入的 `key_points` 和 `style_profile_json` 变量。

### 3.2 LLM 节点 (核心大纲生成)

*   **目标:** 基于 `key_points` 和 `style_profile_json` 生成结构化且格式友好的 **Markdown** 大纲。
*   **输入变量:** `key_points`, `style_profile_json`。
*   **Prompt 设计思路:**
    *   **System Prompt:** 设定 LLM 的角色（专业内容策划师）、核心任务（生成 Markdown 大纲）、强调风格遵循、并严格规定输出必须是纯净的 Markdown 格式，提供格式示例作为约束。
    *   **User Prompt:** 传入具体的 `key_points` 和 `style_profile_json`，并给出本次生成的具体指令。
    *   设定角色为专业内容策划师。
    *   清晰说明任务：结合核心观点和风格画像生成 **Markdown** 格式的大纲。
    *   强调需要严格遵循风格画像的特点（如语气、句式、词汇）。
    *   要求生成主标题、章节标题、章节要点，并使用标准的 Markdown 语法（如 `#` 用于标题, `-` 或 `*` 用于列表）。
    *   要求（可选地）建议图片插入位置和描述 (`image_suggestion`)，同样以 Markdown 格式嵌入。
    *   **强制要求** 输出为纯净的 **Markdown** 格式，不包含任何额外的解释或代码块标记。
*   **Prompt 示例:**

    ```prompt
    --- System Prompt ---
    # Role: 专业内容策划师
    你是一位专业的 AI 内容策划师。你的任务是根据用户提供的核心观点和指定的风格画像，创作一份结构清晰、符合风格的文章大纲。
    风格画像包含了作者信息、常用词汇、句子结构、语气、修辞手法等细节。
    你必须严格按照风格画像中的特点来构思大纲的标题、章节标题和要点措辞。

    ## Output Format Constraint:
    **你的输出必须是纯净的 Markdown 格式，绝对不能包含任何 JSON、代码块标记（如 ```）或任何解释性文字。**
    请严格遵循以下 Markdown 结构：

    ```markdown_example
    # [文章标题]

    ## [章节标题1]
    - [要点1]
    - [要点2]
    *(图片建议: [描述图片建议内容或 null])*

    ## [章节标题2]
    - [要点 A]
    - [要点 B]
    *(图片建议: [关于...的插图])*

    // ... more sections
    ```

    --- User Prompt ---
    ## Context:
    核心观点: {{key_points}}
    风格画像: {{style_profile_json}}

    ## Requirement:
    1.  为文章生成一个吸引人且符合风格的主标题 (一级标题 `#`)。
    2.  将核心观点合理地组织成多个章节，每个章节有明确的标题 (二级标题 `##`)。
    3.  在每个章节下，列出支撑该章节标题的关键要点 (无序列表 `-` 或 `*`)，要点需体现风格画像特点。
    4.  （可选）在合适的章节下，建议图片插入位置和内容描述，格式为 `*(图片建议: [描述])*`。

    请根据以上要求，直接生成 Markdown 大纲：
    ```
*   **输出:** `generated_outline_markdown` (字符串，包含 Markdown 格式的大纲)。

### 3.3 (可选) 变量赋值节点

*   **目标:** (如果需要对 Markdown 进行初步处理或传递给后续特定节点) 可以将 LLM 输出的 Markdown 字符串赋值给一个变量。
*   **输入:** `generated_outline_markdown` (来自 LLM 节点)。
*   **处理:** 将输入字符串赋值给新变量，例如 `final_outline_markdown`。
*   **输出:** `final_outline_markdown` (字符串)。

### 3.4 (可选) 人工审核节点

*   **目标:** 允许用户查看、编辑和确认 AI 生成的 Markdown 大纲。
*   **输入:** `generated_outline_markdown` 或 `final_outline_markdown`。
*   **处理:** 向用户展示 Markdown 大纲内容，提供 Markdown 编辑器或预览界面。
*   **输出:** 用户确认或修改后的 Markdown 大纲字符串。

## 4. 输出

*   **最终输出 (Final Output):** Flow 的最终产出，是一个由 LLM 直接生成的（或经过用户审核修改的）、**Markdown 格式** 的文章大纲字符串 (`generated_outline_markdown` 或用户修改后的版本)，便于用户直接阅读和使用。
*   **Markdown 输出格式示例:**

    ```markdown
    # [AI 生成的文章标题]

    ## [章节标题1]
    - [要点1]
    - [要点2]
    *(图片建议: [描述图片建议内容或 null])*

    ## [章节标题2]
    - [要点 A]
    - [要点 B]
    *(图片建议: [关于...的插图])*

    // ... more sections
    ```

## 5. 关键考量与实现建议

*   **Prompt 的精确性:** **将 Prompt 拆分为 System 和 User 两部分**，有助于更稳定地控制 LLM 行为。System Prompt 负责设定角色和严格的格式约束，User Prompt 负责传递动态数据和具体任务。需要根据实际效果反复迭代优化，确保 LLM 不会添加额外字符或偏离格式。
*   **风格画像的有效性:** 风格画像 JSON 的结构和内容质量直接影响 LLM 理解和遵循风格的能力。
*   **Markdown 输出的稳定性:** 让 LLM 稳定输出格式**完全正确**的 Markdown 可能比 JSON 更困难。需要进行充分测试，并可能需要在 **System Prompt** 中加入更强的格式约束或示例。
*   **后续处理的复杂性:** 如果未来需要自动化处理这个大纲，解析 Markdown 会比解析结构化的 JSON 更复杂、更易出错。
*   **LLM 选择:** 选择能够较好理解复杂指令并能生成符合特定格式文本输出的 LLM 模型。
*   **图片建议的质量:** LLM 生成的图片建议可能较为初步，用户可能需要进一步细化才能用于实际的图片生成工具。
*   **变量传递:** 确保 `key_points`、`style_profile_json` 和 `generated_outline_markdown` 在节点间正确传递。
*   **用户体验:** 如果包含人工审核节点，界面应清晰展示 Markdown 大纲并提供便捷的编辑方式（最好有实时预览）。
