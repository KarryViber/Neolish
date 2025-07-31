/**
 * Markdown Callout 转换工具
 * 将 markdown 中的 > [!TYPE] 语法转换为 HTML callout 格式
 */

export function transformMarkdownCallouts(markdown: string): string {
  // 改进的正则表达式，支持多行callout
  const lines = markdown.split('\n');
  const result: string[] = [];
  let currentCallout: { type: string; content: string[] } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 检查是否是callout开始行
    const calloutMatch = line.match(/^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*(.*)$/i);
    
    if (calloutMatch) {
      // 如果之前有未完成的callout，先处理它
      if (currentCallout) {
        result.push(generateCalloutHTML(currentCallout.type, currentCallout.content));
        currentCallout = null;
      }
      
      // 开始新的callout
      const type = calloutMatch[1].toLowerCase();
      const content = calloutMatch[2] ? calloutMatch[2].trim() : '';
      currentCallout = { type, content: content ? [content] : [] };
    } else if (currentCallout && line.startsWith('>')) {
      // 继续当前callout的内容
      const contentLine = line.replace(/^>\s*/, '').trim();
      if (contentLine) {
        currentCallout.content.push(contentLine);
      } else {
        // 空行，添加换行
        currentCallout.content.push('');
      }
    } else {
      // 不是callout相关的行
      if (currentCallout) {
        // 结束当前callout
        result.push(generateCalloutHTML(currentCallout.type, currentCallout.content));
        currentCallout = null;
      }
      result.push(line);
    }
  }
  
  // 处理可能剩余的callout
  if (currentCallout) {
    result.push(generateCalloutHTML(currentCallout.type, currentCallout.content));
  }
  
  return result.join('\n');
}

/**
 * 生成callout的HTML
 */
function generateCalloutHTML(type: string, content: string[]): string {
  const contentHtml = content.length > 0 
    ? content.map(line => line ? `<p>${line}</p>` : '<br>').join('')
    : '<p></p>';
    
  return `<div data-type="callout" data-callout-type="${type}" class="callout callout-${type}">
${contentHtml}
</div>`;
}

/**
 * 预处理 markdown 内容，转换 callout 语法
 */
export function preprocessMarkdownForTiptap(markdown: string): string {
  console.log("[PreprocessMarkdown] Input:", markdown.substring(0, 200) + "...");
  const result = transformMarkdownCallouts(markdown);
  console.log("[PreprocessMarkdown] Output:", result.substring(0, 200) + "...");
  return result;
} 