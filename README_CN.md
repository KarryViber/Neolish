# Neolish - AI营销内容创作平台

**Languages:** [English](README.md) | [中文](README_CN.md) | [日本語](README_JP.md)

## 🎯 项目简介

Neolish 是一个专为营销人员打造的AI内容创作平台，帮助用户高效创建高质量的营销内容。通过智能化的工作流程，从风格定义到内容生成，让营销内容创作变得简单而专业。

## ✨ 核心功能

### 1. 团队协作管理
- **多团队支持**：用户可以创建或加入多个团队，实现团队协作
- **权限管理**：支持团队所有者、管理员、成员等不同角色权限
- **激活码系统**：通过激活码控制团队成员注册和加入

### 2. 风格配置管理 (Style Profiles)
- **手动创建**：用户可以手动定义品牌的写作风格和语调
- **智能提取**：通过分析网页文章URL，自动提取并生成风格配置
- **风格要素**：包含作者信息、风格特征、示例文本等完整风格画像

### 3. 商材管理 (Merchandise)
- **多源导入**：支持URL链接、文件上传、手动输入等多种方式
- **智能总结**：AI自动提取和总结商材的核心信息
- **标签分类**：通过标签系统便于商材的分类和检索

### 4. 受众画像 (Audience)
- **精准定位**：创建详细的目标受众画像
- **多维描述**：包含受众特征、需求、行为等多维度信息
- **标签管理**：通过标签系统实现受众的精细化管理

### 5. 文章大纲 (Outlines)
- **智能生成**：基于风格配置、商材信息和用户要点生成文章大纲
- **受众关联**：为大纲指定目标受众，确保内容针对性
- **Markdown编辑**：支持富文本编辑，便于大纲的调整和完善

### 6. 文章创作 (Articles)
- **AI辅助写作**：基于大纲、受众和写作目的生成文章初稿
- **富文本编辑器**：采用Tiptap编辑器，提供现代化的编辑体验
- **实时预览**：支持Markdown格式的实时预览和编辑
- **图片生成**：集成AI图片生成功能，为文章配图

## 🏗️ 技术架构

### 前端技术栈
- **框架**：Next.js 15+ (App Router)
- **UI库**：React 19+, TypeScript
- **样式**：Tailwind CSS, Radix UI
- **图标**：Lucide Icons
- **编辑器**：Tiptap (富文本编辑)
- **表单**：React Hook Form + Zod验证
- **状态管理**：React Context/Hooks
- **HTTP客户端**：Axios
- **通知系统**：Sonner

### 后端技术栈
- **数据库**：PostgreSQL + Prisma ORM
- **认证**：NextAuth.js (Credentials Provider)
- **密码加密**：bcryptjs
- **国际化**：next-intl
- **主题**：next-themes

### AI集成
- **AI工作流**：集成Dify AI平台
- **功能**：风格提取、大纲生成、文章创作、图片生成
- **处理方式**：异步任务处理，实时状态更新

## 📊 数据模型

### 核心实体关系
```
用户 (User) 
├── 团队 (Team) - 一对多关系
├── 风格配置 (StyleProfile) - 一对多关系
├── 商材 (Merchandise) - 一对多关系
├── 受众 (Audience) - 一对多关系
├── 大纲 (Outline) - 一对多关系
└── 文章 (Article) - 一对多关系

团队 (Team)
├── 成员关系 (Membership) - 多对多关系
├── 激活码 (ActivationCode) - 一对多关系
└── 所有资源按团队隔离

内容创作流程
风格配置 → 商材 → 受众 → 大纲 → 文章
```

### 主要数据表
- **User**: 用户基本信息和认证
- **Team**: 团队信息和权限管理
- **StyleProfile**: 写作风格配置
- **Merchandise**: 商材信息管理
- **Audience**: 目标受众画像
- **Outline**: 文章大纲结构
- **Article**: 最终文章内容
- **ImageGenerationJob**: AI图片生成任务

## 🚀 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 数据库
- Dify AI平台账号

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd v0.9_Neolish
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置以下关键变量：
```env
# 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/neolish"

# NextAuth配置
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Dify AI配置
DIFY_API_KEY="your-dify-api-key"
DIFY_BASE_URL="https://api.dify.ai/v1"
```

4. **初始化数据库**
```bash
npx prisma migrate dev
npx prisma db seed
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 `http://localhost:3000` 开始使用。

## 📱 使用指南

### 基本工作流程

1. **注册登录**
   - 使用激活码注册账号
   - 登录后自动加入对应团队

2. **创建风格配置**
   - 手动输入品牌风格信息
   - 或通过URL自动提取风格特征

3. **管理商材**
   - 添加产品或服务信息
   - 支持多种导入方式

4. **定义受众**
   - 创建目标受众画像
   - 设置受众标签和特征

5. **生成大纲**
   - 选择风格配置和商材
   - 输入文章要点
   - AI生成结构化大纲

6. **创作文章**
   - 基于大纲生成文章初稿
   - 使用富文本编辑器完善内容
   - 添加AI生成的配图

### 团队协作

- **团队管理**：团队所有者可以管理成员和权限
- **资源共享**：团队内所有资源（风格、商材、受众等）共享
- **权限控制**：不同角色拥有不同的操作权限

## 🔧 开发说明

### 项目结构
```
src/
├── app/                 # Next.js App Router页面
│   ├── [locale]/       # 国际化路由
│   └── api/            # API路由
├── components/         # React组件
├── lib/               # 工具库和配置
├── utils/             # 工具函数
└── i18n/              # 国际化配置

prisma/
├── schema.prisma      # 数据库模型定义
└── migrations/        # 数据库迁移文件
```

### 核心组件

- **认证系统**：基于NextAuth.js的用户认证
- **数据库层**：Prisma ORM + PostgreSQL
- **UI组件**：基于Radix UI的现代化界面
- **编辑器**：Tiptap富文本编辑器
- **AI集成**：Dify工作流集成

### API接口

主要API端点：
- `/api/auth/*` - 用户认证
- `/api/teams/*` - 团队管理
- `/api/style-profiles/*` - 风格配置
- `/api/merchandise/*` - 商材管理
- `/api/outlines/*` - 大纲管理
- `/api/articles/*` - 文章管理

## 🎨 界面特色

### 现代化设计
- **响应式布局**：适配桌面和移动设备
- **暗色主题**：支持明暗主题切换
- **国际化**：支持中文、英文、日文

### 用户体验
- **直观导航**：清晰的功能分类和导航
- **实时反馈**：操作状态和进度提示
- **快捷操作**：键盘快捷键和批量操作

## 📈 功能状态

### ✅ 已完成功能
- 用户注册、登录、团队管理
- 激活码系统（普通码和万能码）
- 风格配置管理（手动创建和URL提取）
- 商材管理（多源导入和AI总结）
- 受众画像管理
- 文章大纲生成和编辑
- 文章创作和富文本编辑
- AI图片生成集成
- 密码强度验证（多语言支持）

### 🚧 开发中功能
- 工作区概念实现
- 主动式AI助手
- 可视化策略画布
- 高级分析工具

### 📋 计划中功能
- 市场分析助手
- 社交媒体发布
- 营销漏斗分析
- 协作评论系统

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

如有问题或建议，请通过以下方式联系：
- 邮箱: karry.viber@gmail.com

---

*Neolish - 让AI成为你的营销内容创作伙伴* 🚀
