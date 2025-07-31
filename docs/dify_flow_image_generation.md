# Dify Flow - 图像生成工作流 (Image Generation)

## 目标

根据用户提供的初步 Prompt、可选的参考图和可选的风格关键词，先通过 LLM 加工生成详细的图像生成 Prompt，然后调用 Dify 内置的 `gpt-image-api` 工具生成配图。

## 工作流程

1.  **接收输入:** 获取用于生成图像的初步文字描述 (`initial_prompt`)，以及可选的用户上传的参考图 (`reference_image`)、风格关键词 (`style_keywords`) 和图像规格 (`image_specifications`)。
2.  **解析风格 (初步):** 
    *   **优先使用参考图:** 如果用户提供了 `reference_image`，记录需要参考该图像风格。
    *   **其次使用关键词:** 如果没有提供参考图，但提供了 `style_keywords`，记录这些风格关键词。
    *   **记录规格:** 从 `image_specifications` 中提取宽高比等信息。
3.  **生成详细 Prompt (LLM):** 
    *   **调用 LLM 节点:** 使用一个 LLM 节点来加工 Prompt。
    *   **输入:** 将 `initial_prompt`、解析后的风格信息（参考图提示或关键词）、图像规格（如宽高比）等传递给 LLM。
    *   **任务:** 指示 LLM 根据提供的要素，生成一个结构化、详细的最终图像生成 Prompt (`final_image_prompt`)，遵循预定义的格式（见下方示例）。
    *   **输出:** `final_image_prompt` (string)。
4.  **构建 API 请求:** 准备调用 Dify `gpt-image-api` 工具所需的参数。
    *   **核心输入:** 使用上一步生成的 `final_image_prompt`。
    *   **其他参数:** 可能还包括 `reference_image` (如果 API 支持直接输入图像作为参考) 和 `image_specifications` 中的具体数值（如宽度、高度、数量，取决于工具支持）。
5.  **调用工具:** 在 Dify 工作流中，调用配置好的 `gpt-image-api` 工具节点，并传入构建好的参数。
6.  **处理响应:** 接收 `gpt-image-api` 工具返回的图像结果。
7.  **输出结果:** 将生成的图像信息返回给工作流的后续节点。

## 输入参数

*   `initial_prompt` (string): 描述图像内容的初步或核心文字提示。
*   `reference_image` (file, 可选): 用户在初始节点上传的参考图，用于风格参考。
*   `style_keywords` (string, 可选): 描述图像风格的关键词。当未提供 `reference_image` 时使用。
*   `image_specifications` (object, 可选): 图像规格，如尺寸 (`width`, `height`)、长宽比 (`aspect_ratio`)、生成数量 (`count`) 等。

## 内部变量 (示例)

*   `final_image_prompt` (string): 由步骤 3 的 LLM 节点生成的、用于调用 `gpt-image-api` 的详细 Prompt。

## 输出结果

*   `generated_images` (list): 包含生成图像信息的列表，具体格式取决于 `gpt-image-api` 工具的输出。
    *   `url` (string / file_id): 图像的访问链接或 Dify 文件 ID。
    *   `metadata` (object): 其他元数据。

## Prompt 加工 LLM 节点示例

*   **System Prompt (示例):** 
    ```
    你是一位专业的提示词工程师 (Prompt Engineer)，擅长将用户的初步想法和需求，转换成结构清晰、细节丰富、适合 AI 图像生成模型（如 DALL-E, Stable Diffusion, Midjourney）理解的详细 Prompt。
    请根据用户提供的初步描述、风格参考（可能是文字关键词或提示需要参考图片）和图像规格，生成一个符合以下 Markdown 格式的最终 Prompt：

    ## Image Generation Request

    **1. Image Type:** [推断或选择合适的类型，如: 插画, 照片, 3D渲染]
    **2. Aspect Ratio:** [根据输入规格填写，如: 16:9]
    **3. Core Subject & Scene Description:** [详细描述画面主体、动作、场景和氛围]
    **4. Key Elements (Must Include):** [列出必须包含的具体元素]
    **5. Artistic Style:** [结合风格参考描述艺术风格]
    **6. Color Palette & Tone:** [描述色彩和色调]
    **7. Background & Setting:** [描述背景环境]
    **8. Composition & Layout:** [建议构图或视角]
    **9. Intended Purpose (Context):** [说明图像用途]
    **10. Language:** [如需，指定语言]
    **11. Negative Prompts (Avoid):** [列出要避免的元素或效果]

    请确保生成的 Prompt 内容丰富、逻辑清晰、用词精准，以最大限度地引导 AI 生成符合用户期望的高质量图像。
    ```
*   **输入变量 (示例):** (这些变量将填充到下面的 User Prompt 模板中)
    ```
    initial_prompt: "Dify平台的chatflow界面截图，展示设计自律型Agent的工作流。画面中心是一个复杂的节点连接图，包含明显标记的\"任务分解\"、\"循环\"、\"执行\"和\"总结\"节点，节点之间用方向箭头连接。界面应使用Dify的品牌配色，干净整洁，体现专业的开发环境。图中还应包含会话变量设置面板，显示任务状态变量的配置方式。"
    style_keywords: "现代UI设计, 科技感"
    aspect_ratio: "16:9"
    reference_image_status: "无参考图"
    ```
*   **User Prompt (模板示例):**
    ```
    请根据以下信息，为 AI 图像生成模型创建一个详细的、结构化的 Prompt。

    **初步描述:** {{initial_prompt}}
    **风格关键词:** {{style_keywords}}
    **宽高比:** {{aspect_ratio}}
    **参考图:** {{reference_image_status}}  // (这里可以是 "无参考图" 或 "有参考图，请在风格中体现")

    请严格按照 System Prompt 中定义的 Markdown 格式输出最终 Prompt。
    ```
*   **LLM Output (示例 `final_image_prompt`):**
    ```markdown
    ## Image Generation Request

    **1. Image Type:** UI截图/软件界面插画
    **2. Aspect Ratio:** 16:9
    **3. Core Subject & Scene Description:** Dify 平台的 Chatflow 界面截图，核心展示了一个设计完善的自律型 Agent 工作流。画面中心是一个清晰、复杂的节点连接图。
    **4. Key Elements (Must Include):** 节点连接图 (包含"任务分解", "循环", "执行", "总结"节点), 节点间的方向箭头, Dify 品牌配色界面, 会话变量设置面板 (展示任务状态变量配置)。
    **5. Artistic Style:** 现代、干净、专业的 UI 设计风格，具有科技感，符合 Dify 的品牌视觉。
    **6. Color Palette & Tone:** 主要使用 Dify 的品牌色（例如，通常是蓝色调、灰色和白色），整体色调专业、整洁、清晰。
    **7. Background & Setting:** Dify 应用的界面背景，可能是浅灰色或白色，保持简洁。
    **8. Composition & Layout:** 节点图位于画面中心，占据主要视觉区域。会话变量面板可以放在侧边或角落，不干扰主图。整体布局均衡、信息层级清晰。
    **9. Intended Purpose (Context):** 用于文档配图、教程演示或博客文章，解释 Dify 中 Agent 工作流的构建。
    **10. Language:** 界面元素中的文字可能是英文（如 Dify 默认）或根据需要指定。
    **11. Negative Prompts (Avoid):** 杂乱的界面, 过时的 UI 风格, 与 Dify 品牌无关的颜色, 模糊不清的节点文字。
    ```

## 依赖

*   需要配置并启用 Dify 的 `gpt-image-api` 工具。
*   需要 Dify 的 `gpt-image-api` 工具支持通过图像输入进行风格参考 (如果使用了 `reference_image`)。
*   需要在工作流中添加一个 **LLM 节点** 用于执行 Prompt 加工步骤。
