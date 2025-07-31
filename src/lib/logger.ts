/**
 * 环境变量控制的日志系统
 * 开发环境：显示所有日志
 * 生产环境：只显示警告和错误
 */

export const isDevelopment = process.env.NODE_ENV === 'development'
export const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === 'true'

export const logger = {
  // 调试日志 - 只在开发环境或启用调试模式时显示
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment || isDebugMode) {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  },

  // 信息日志 - 开发环境显示
  info: (message: string, ...args: any[]) => {
    if (isDevelopment || isDebugMode) {
      console.info(`[INFO] ${message}`, ...args)
    }
  },

  // 警告日志 - 总是显示
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args)
  },

  // 错误日志 - 总是显示
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args)
  },

  // 编辑器特定的调试日志
  editor: {
    debug: (component: string, message: string, ...args: any[]) => {
      if (isDevelopment || isDebugMode) {
        console.log(`[EDITOR:${component}] ${message}`, ...args)
      }
    },
    warn: (component: string, message: string, ...args: any[]) => {
      console.warn(`[EDITOR:${component}] ${message}`, ...args)
    },
    error: (component: string, message: string, ...args: any[]) => {
      console.error(`[EDITOR:${component}] ${message}`, ...args)
    }
  }
} 