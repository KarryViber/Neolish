/**
 * 集中的Loading配置文件
 * 
 * 统一管理各种loading场景的翻译键和配置，
 * 确保所有loading弹窗的一致性和可维护性
 */

export const LoadingConfigs = {
  // 大纲生成相关
  outlines: {
    generation: {
      titleKey: 'modal.generating.title',
      descriptionKey: 'modal.generating.message', 
      hintKey: 'modal.generating.hint',
      spinnerColor: 'blue' as const,
      namespace: 'outlines'
    }
  },

  // 商材分析相关
  merchandise: {
    analysis: {
      titleKey: 'modal.add.analyzing.title',
      descriptionKey: 'modal.add.analyzing.description',
      hintKey: 'modal.add.analyzing.message',
      spinnerColor: 'blue' as const,
      namespace: 'merchandise'
    }
  },

  // 风格配置分析相关
  styleProfiles: {
    analysis: {
      titleKey: 'modal.analyzing.title',
      descriptionKey: 'modal.analyzing.description',
      spinnerColor: 'blue' as const,
      namespace: 'style-profiles'
    }
  },

  // 文章生成相关
  articles: {
    generation: {
      titleKey: 'loading',
      descriptionKey: 'generating',
      spinnerColor: 'green' as const,
      namespace: 'articles'
    }
  },

  // 图片生成相关
  images: {
    generation: {
      titleKey: 'generating',
      descriptionKey: 'loading',
      spinnerColor: 'purple' as const,
      namespace: 'articles'
    }
  },

  // 发布相关
  publishing: {
    coverGeneration: {
      titleKey: 'coverImage.generating',
      spinnerColor: 'blue' as const,
      namespace: 'publishing'
    },
    tweetGeneration: {
      titleKey: 'generating',
      spinnerColor: 'blue' as const,
      namespace: 'publishing'
    }
  }
} as const;

/**
 * 获取loading配置的辅助函数
 * 
 * @param config - 配置对象
 * @param t - 翻译函数
 * @returns 处理后的loading配置
 */
export function getLoadingConfig(
  config: {
    titleKey: string;
    descriptionKey?: string;
    hintKey?: string;
    spinnerColor: 'blue' | 'purple' | 'indigo' | 'green';
    namespace?: string;
  },
  t: any
) {
  return {
    title: t(config.titleKey),
    description: config.descriptionKey ? t(config.descriptionKey) : undefined,
    hint: config.hintKey ? t(config.hintKey) : undefined,
    spinnerColor: config.spinnerColor
  };
}

export default LoadingConfigs; 