# Loading Dialog 组件使用指南

## 概述

`LoadingDialogContent` 和 `LoadingButton` 是统一的Loading组件，用于替代项目中各种重复的loading UI代码，确保用户体验的一致性。

## LoadingDialogContent

### 基本用法

```tsx
import { LoadingDialogContent } from '@/components/ui/loading-dialog';

// 基本使用
<LoadingDialogContent
  title="正在生成大纲..."
  description="请稍候，系统正在生成大纲。"
  hint="这可能需要几分钟时间。"
  spinnerColor="blue"
/>
```

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 主要的loading标题（必需） |
| `description` | `string` | - | 副标题或描述信息（可选） |
| `hint` | `string` | - | 附加的提示信息（可选） |
| `spinnerSize` | `'sm' \| 'md' \| 'lg'` | `'lg'` | Spinner的大小 |
| `spinnerColor` | `'blue' \| 'purple' \| 'indigo' \| 'green'` | `'blue'` | Spinner的颜色主题 |
| `className` | `string` | - | 自定义容器类名 |
| `centered` | `boolean` | `true` | 是否显示垂直居中布局 |

## LoadingButton

### 基本用法

```tsx
import { LoadingButton } from '@/components/ui/loading-dialog';
import { FileText } from 'lucide-react';

// 基本使用
<LoadingButton
  isLoading={isAnalyzing}
  normalText="分析文件"
  normalIcon={<FileText size={16} />}
  variant="default"
  disabled={!selectedFile}
  onClick={handleAnalyze}
/>
```

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isLoading` | `boolean` | - | 是否处于loading状态（必需） |
| `normalText` | `string` | - | 正常状态的文字（必需） |
| `loadingText` | `string` | - | Loading时的文字（可选） |
| `normalIcon` | `React.ReactNode` | - | 正常状态的图标（可选） |
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | 按钮样式变体 |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | 按钮尺寸 |
| `iconSize` | `number` | `16` | Loading时显示的图标尺寸 |
| `disabled` | `boolean` | - | 是否禁用按钮 |
| `type` | `'button' \| 'submit'` | `'button'` | 按钮类型 |
| `onClick` | `() => void` | - | 点击事件 |
| `className` | `string` | - | 自定义类名 |

## 实际应用示例

### 1. 大纲生成Loading

```tsx
// 在Dialog中使用
{isGeneratingOutline && (
  <LoadingDialogContent
    title={t('modal.generating.title')}
    description={t('modal.generating.message')}
    hint={t('modal.generating.hint')}
    spinnerColor="blue"
    className="flex-grow"
  />
)}
```

### 2. 商材分析Loading

```tsx
// 分析阶段的loading
{newItemStage === 'analyzing' && (
  <LoadingDialogContent
    title={t('modal.add.analyzing.title')}
    description={t('modal.add.analyzing.description')}
    hint={t('modal.add.analyzing.message')}
    spinnerColor="blue"
    centered={false}
  />
)}
```

### 3. 分析按钮

```tsx
// 替代传统的loading按钮
<LoadingButton
  isLoading={isAnalyzingFile}
  normalText={t('buttons.analyzeFile')}
  normalIcon={<FileText size={16} />}
  variant="default"
  disabled={!selectedFile}
  onClick={handleAnalyzeFile}
  className="flex items-center"
/>
```

## 优势

1. **代码复用**: 消除重复的loading UI代码
2. **一致性**: 确保所有loading状态的视觉一致性
3. **可维护性**: 集中管理loading样式和行为
4. **国际化**: 支持多语言翻译
5. **可定制**: 支持多种颜色主题和尺寸选项

## 迁移指南

### 从旧的loading代码迁移

**旧代码:**
```tsx
<div className="py-10 flex flex-col items-center justify-center space-y-4">
  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
  <p className="text-lg text-gray-700">{t('loading.message')}</p>
  <p className="text-sm text-gray-500">{t('loading.hint')}</p>
</div>
```

**新代码:**
```tsx
<LoadingDialogContent
  title={t('loading.message')}
  hint={t('loading.hint')}
  spinnerColor="blue"
/>
```

### 从旧的loading按钮迁移

**旧代码:**
```tsx
<Button disabled={isLoading} onClick={handleClick}>
  {isLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Icon size={16} className="mr-2" />}
  {isLoading ? 'Loading...' : 'Normal Text'}
</Button>
```

**新代码:**
```tsx
<LoadingButton
  isLoading={isLoading}
  normalText="Normal Text"
  loadingText="Loading..."
  normalIcon={<Icon size={16} />}
  variant="default"
  onClick={handleClick}
/>
``` 