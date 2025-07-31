# Dify Flow: 内容生成 (Content Generation)

## 1. 目标 (Goal)

根据用户确认的文章大纲、选定的风格画像、写作目的和目标受众，生成结构完整、风格匹配、符合目的且面向特定受众的文章初稿，并为需要配图的位置生成相应的图片提示词 (Image Prompts)。本 Flow 设计为生成单个内容版本。

## 2. 输入变量 (Input Variables)

*   **`outline`** (String):
    *   描述：用户最终确认的结构化文章大纲文本，**为 Markdown 格式**，包含标题、章节、要点和可选的图片建议标记 (例如 `*(图片建议: ...)*`)。
    *   示例：
        ```markdown
        # 文章标题
        ## 引言
        - 引入主题...
        *(图片建议: 关于主题的背景图)*
        ## 第一部分
        - 要点 1...
        - 要点 2...
        *(图片建议: null)*
        ## 第二部分
        - 要点 3...
        *(图片建议: 关于要点3的详细图)*
        ## 结论
        - 总结观点...
        ```
*   **`style_profile`** (JSON Object):
    *   描述：用户选定的风格画像，包含作者信息、文体特征、语气和样例文本。
    *   示例：
        ```json
        {
          "author_persona": "一位资深的行业分析师",
          "writing_style": {
            "tone": "专业、客观、深入浅出",
            "vocabulary": "使用行业术语，但会解释",
            "sentence_structure": "偏向复杂句，逻辑清晰"
          },
          "sample_text": "过去的十年间，我们见证了..."
        }
        ```
*   **`writing_purpose`** (Array of Strings):
    *   描述：用户选择的一个或多个写作目的。
    *   示例：`["提高认知", "SEO 优化"]`
*   **`target_audience`** (Array of Strings):
    *   描述：用户选择的一个或多个目标受众。
    *   示例：`["技术爱好者", "产品经理"]`

## 3. 处理步骤/节点 (Processing Steps/Nodes)

### 节点 1: 内容生成 (LLM - Generate Article with Placeholders)

*   **功能**: 根据输入的 Markdown 大纲、风格、目的和受众，撰写文章主体内容。在需要插入图片的位置（根据大纲的 `*(图片建议: ...)*` 标记或上下文判断），插入**唯一的、序列化的占位符** (例如 `[IMAGE_PLACEHOLDER_1]`, `[IMAGE_PLACEHOLDER_2]`, ...)。同时，根据我们之前优化的要求，策略性地使用 Emoji 和 Markdown Callout 增强文章的可读性。
*   **输入变量**: `outline`, `style_profile`, `writing_purpose`, `target_audience`
*   **System Prompt**:
    ```
    你是一位才华横溢的内容创作者，并且懂得如何平衡内容深度与阅读体验。你的任务是根据提供的 Markdown 大纲、风格画像、写作目的和目标受众，创作一篇结构完整、引人入胜的文章初稿。

    你需要：
    1.  **遵循大纲和风格:** 严格按照 Markdown 大纲的结构和指定的风格、目的、受众进行写作。
    2.  **识别图片位置:** 在写作过程中，结合大纲中的 `*(图片建议: ...)*` 标记和上下文内容，判断哪些地方最适合插入图片。
    3.  **插入占位符:** 对于每一个确定需要图片的位置，**插入一个唯一的、序列化的占位符**。占位符的格式必须是 `[IMAGE_PLACEHOLDER_n]`，其中 `n` 是从 1 开始递增的整数 (例如: `[IMAGE_PLACEHOLDER_1]`, `[IMAGE_PLACEHOLDER_2]`)。**不要生成图片描述或 Prompt**，只插入占位符。
    4.  **提升阅读体验 (注意平衡):**
        *   **策略性使用 Emoji:** 仅在关键位置审慎地插入相关的 Emoji 😊，增加视觉提示和趣味性，坚决避免滥用。
        *   **有效运用 Callout:** 仅针对真正需要强调的核心观点、关键提示等，使用 Markdown Callout 格式（如 `> [!TIP]`）突出显示，确保内容精炼且必要。
        *   保持风格一致。
    5.  **输出:** 你的最终输出应该是**一篇完整的 Markdown 文章字符串**，其中包含了所有必要的 `[IMAGE_PLACEHOLDER_n]` 占位符以及用于提升阅读体验的 Emoji 和 Callout。**不要**包含任何实际的图片提示文本。

    **示例输出片段:**
    "...文章的第一段内容结束。💡\n\n[IMAGE_PLACEHOLDER_1]\n\n> [!TIP]\n> 记住，沟通是项目成功的关键。\n\n文章的第二段开始，讨论核心概念...\n\n这是另一个需要图片的地方：[IMAGE_PLACEHOLDER_2]\n\n继续写作..."
    ```
*   **User Prompt**:
    ```
    请根据以下信息，撰写文章，并在需要图片的位置插入占位符 `[IMAGE_PLACEHOLDER_n]`（n从1开始递增），同时适度使用 Emoji 和 Callout 增强可读性：

    **文章大纲 (Markdown 格式):**
    ```markdown
    {{outline}}
    ```
    (请参考其中的 `*(图片建议: ...)*` 标记来辅助判断图片位置。)

    **风格画像:**
    ```json
    {{style_profile}}
    ```

    **写作目的:** {{writing_purpose}}

    **目标受众:** {{target_audience}}

    **任务:**
    1.  撰写完整的文章内容，遵循大纲结构、风格、目的和受众要求。
    2.  在需要图片的位置，准确插入唯一的序列化占位符 `[IMAGE_PLACEHOLDER_n]`。
    3.  适度使用 Emoji 和 Markdown Callout。
    4.  最终只输出包含占位符、Emoji 和 Callout 的 Markdown 文章文本字符串。

    请开始撰写包含图片占位符的文章：
    ```
*   **输出变量**: `article_with_placeholders` (String) - 生成的包含图片占位符、Emoji 和 Callout 的 Markdown 文章文本。

### 节点 2: 图片 Prompt 生成 (LLM - Generate Chinese Prompts for Placeholders)

*   **功能**: 接收带有占位符的文章和原始大纲。分析每个占位符所在位置的上下文，并结合大纲中对应的 `*(图片建议: ...)*`（如果存在），为**每一个**占位符生成一个简洁、具体、描述性强的**中文**图片生成 Prompt。输出一个包含占位符到 Prompt 映射关系的 JSON 对象。
*   **输入变量**: `article_with_placeholders`, `outline`
*   **System Prompt**:
    ```
    你是一位富有创意的视觉概念设计师，专注于将文本概念转化为**具体、详细的中文图片 Prompt**，指导图像生成模型创造出精确且引人入胜的视觉效果。

    你的核心任务是为文章中的每个 `[IMAGE_PLACEHOLDER_n]` 生成一个**可执行的视觉描述**。

    你需要：
    1.  **解析上下文和意图:** 深入理解占位符前后的文本，以及原始大纲中对应的 `*(图片建议: ...)*`（如果存在），准确把握该处需要传达的核心视觉信息和情感基调。
    2.  **构思具体画面:** 将抽象概念转化为具体的视觉元素。**明确描述画面中应该包含的主要对象、人物、场景、图表类型（如流程图、柱状图）等。**
    3.  **描述构图与细节:** 说明元素的布局（居中、左右分布等）、视角（特写、鸟瞰、等轴测视图等）、动作或状态。加入关键细节，如**颜色基调、光线效果、特定符号或纹理**，让画面更生动。
    4.  **指定风格与媒介（可选但推荐）:** 如果上下文有暗示，可以建议图像的风格，例如“照片写实风格”、“扁平化插画风格”、“赛博朋克3D渲染”、“水墨画风格”等。
    5.  **生成简洁清晰的中文 Prompt:** 使用简洁、准确的中文描述画面。**避免使用过于抽象或模糊的词语**，专注于“画什么”和“怎么画”。
    6.  **输出 JSON 映射:** 你的输出必须是一个 **JSON 对象**，键是占位符字符串，值是你精心设计的中文 Prompt 字符串。确保 JSON 格式正确。

    **反面示例 (过于抽象):**
    *   `"一个关于创新的概念图"` (不够具体)
    *   `"展示团队协作的重要性"` (没有描述画面)

    **正面示例 (具体且视觉化):**
    *   `"一张明亮风格的扁平化插画，展示三个不同肤色的小人围在一张带有灯泡图标的桌子旁讨论，背景是柔和的蓝色渐变。"`
    *   `"科技蓝背景下的流程图，包含'数据输入'、'AI分析'、'结果输出'三个圆角矩形节点，节点间用发光的箭头连接，等轴测视角。"`
    *   `"特写镜头，一只机械手臂正在精确地将一个微小的芯片放置在复杂的电路板上，带有金属光泽和轻微的运动模糊效果，照片写实风格。"`

    **现在，请根据以下输入，为每个占位符生成具体、视觉化的中文图片 Prompt:**
    ```
*   **User Prompt**:
    ```
    请分析以下带有图片占位符的文章和原始大纲，为每个 `[IMAGE_PLACEHOLDER_n]` 生成具体、视觉化的中文图片 Prompt，并输出一个包含占位符到 Prompt 映射的 JSON 对象：

    **带有占位符的文章:**
    ```markdown
    {{article_with_placeholders}}
    ```

    **原始大纲:**
    ```markdown
    {{confirmed_outline}}
    ```

    请严格按照要求，仅输出占位符到中文 Prompt 的 JSON 映射。
    ```
*   **输出变量**: `prompt_mapping` (JSON Object) - 包含占位符到中文 Prompt 映射的 JSON 对象。

### 节点 3: 文本替换 (Code Node - Replace Placeholders with Prompts)

*   **功能**: 这是一个简单的代码执行节点 (例如 Dify 中的 Code 节点，可以使用 Python 或 Javascript)。它接收包含占位符的文章和 Prompt 映射 JSON。遍历 JSON 中的键值对，将文章中的每个占位符替换为最终的 `[图片提示: "对应的中文 Prompt"]` 格式。
*   **输入变量**: `article_with_placeholders`, `prompt_mapping`
*   **代码逻辑 (Python 示例)**:
    ```python
    import json

    def replace_placeholders(article_text, mapping_json_str):
        try:
            # Dify的JSON输入可能是字符串，需要解析
            if isinstance(mapping_json_str, str):
                prompt_mapping = json.loads(mapping_json_str)
            else: # 或者已经是dict/object
                prompt_mapping = mapping_json_str

            final_article = article_text
            # 按占位符编号排序替换，避免数字顺序混乱导致替换错误 (例如先替换[PH_10]再替换[PH_1])
            sorted_placeholders = sorted(prompt_mapping.keys(), key=lambda x: int(x.strip('[]').split('_')[-1]))

            for placeholder in sorted_placeholders:
                prompt = prompt_mapping[placeholder]
                replacement_tag = f'[图片提示: "{prompt}"]'
                final_article = final_article.replace(placeholder, replacement_tag)
            return {"final_article": final_article}
        except Exception as e:
            # Handle potential errors
            print(f"Error during replacement: {e}")
            # 返回错误信息或原始文本
            return {"final_article": article_text, "error": str(e)}

    # 假设 Dify 输入变量名为 article_with_placeholders 和 prompt_mapping
    output = replace_placeholders(article_with_placeholders, prompt_mapping)
    ```
*   **输出变量**: `final_article` (String) - 最终生成的、包含嵌入式中文 Prompt、Emoji 和 Callout 的 Markdown 文章文本。

## 4. 输出变量 (Flow Output Variables)

*   **`final_article`** (String):
    *   描述：经过内容生成、Prompt 生成和占位符替换后，最终得到的完整 Markdown 文章。文章中包含了根据上下文生成的中文图片 Prompt (格式为 `[图片提示: "..."]`)，以及适度使用的 Emoji 和 Callout。
    *   来源：节点 3 (文本替换)
