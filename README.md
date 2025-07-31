# Neolish - AI-Powered Marketing Content Creation Platform

**Languages:** [English](README.md) | [中文](README_CN.md) | [日本語](README_JP.md)

## 🎯 Project Overview

Neolish is an AI-powered content creation platform designed specifically for marketing professionals, helping users efficiently create high-quality marketing content. Through intelligent workflows, from style definition to content generation, it makes marketing content creation simple and professional.

<img width="1200" height="619" alt="image" src="https://github.com/user-attachments/assets/a30dae89-a08d-4e14-becf-5c59823873d8" />
<img width="832" height="480" alt="image" src="https://github.com/user-attachments/assets/8aa7ec95-bb12-4ce9-a440-de50f7c83a9b" />
<img width="1200" height="615" alt="image" src="https://github.com/user-attachments/assets/4e1f83a4-a1b0-442a-91c9-c6fe03115a28" />
<img width="832" height="480" alt="image" src="https://github.com/user-attachments/assets/509b93b1-257c-414a-9f6b-dc45ace53174" />


## ✨ Core Features

### 1. Team Collaboration Management
- **Multi-team Support**: Users can create or join multiple teams for collaborative work
- **Permission Management**: Supports different role permissions including team owners, administrators, and members
- **Activation Code System**: Controls team member registration and joining through activation codes

### 2. Style Profile Management
- **Manual Creation**: Users can manually define brand writing styles and tones
- **Intelligent Extraction**: Automatically extracts and generates style profiles by analyzing web article URLs
- **Style Elements**: Includes complete style profiles with author information, style features, sample text, etc.

### 3. Merchandise Management
- **Multi-source Import**: Supports URL links, file uploads, manual input, and other import methods
- **Intelligent Summarization**: AI automatically extracts and summarizes core information from merchandise
- **Tag Classification**: Facilitates merchandise classification and retrieval through tag systems

### 4. Audience Profiling
- **Precise Targeting**: Creates detailed target audience profiles
- **Multi-dimensional Description**: Includes audience characteristics, needs, behaviors, and other multi-dimensional information
- **Tag Management**: Enables refined audience management through tag systems

### 5. Article Outlines
- **Intelligent Generation**: Generates article outlines based on style profiles, merchandise information, and user key points
- **Audience Association**: Assigns target audiences to outlines to ensure content relevance
- **Markdown Editing**: Supports rich text editing for easy outline adjustment and refinement

### 6. Article Creation
- **AI-Assisted Writing**: Generates article drafts based on outlines, audiences, and writing purposes
- **Rich Text Editor**: Uses Tiptap editor for modern editing experience
- **Real-time Preview**: Supports real-time preview and editing in Markdown format
- **Image Generation**: Integrates AI image generation functionality for article illustrations

## 🏗️ Technical Architecture

### Frontend Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **UI Library**: React 19+, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Icons**: Lucide Icons
- **Editor**: Tiptap (Rich Text Editor)
- **Forms**: React Hook Form + Zod Validation
- **State Management**: React Context/Hooks
- **HTTP Client**: Axios
- **Notification System**: Sonner

### Backend Tech Stack
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider)
- **Password Encryption**: bcryptjs
- **Internationalization**: next-intl
- **Theming**: next-themes

### AI Integration
- **AI Workflow**: Integrated with Dify AI Platform
- **Features**: Style extraction, outline generation, article creation, image generation
- **Processing**: Asynchronous task processing with real-time status updates

## 📊 Data Model

### Core Entity Relationships
```
User 
├── Team - One-to-many relationship
├── StyleProfile - One-to-many relationship
├── Merchandise - One-to-many relationship
├── Audience - One-to-many relationship
├── Outline - One-to-many relationship
└── Article - One-to-many relationship

Team
├── Membership - Many-to-many relationship
├── ActivationCode - One-to-many relationship
└── All resources are team-isolated

Content Creation Workflow
StyleProfile → Merchandise → Audience → Outline → Article
```

### Main Data Tables
- **User**: User basic information and authentication
- **Team**: Team information and permission management
- **StyleProfile**: Writing style configuration
- **Merchandise**: Merchandise information management
- **Audience**: Target audience profiles
- **Outline**: Article outline structure
- **Article**: Final article content
- **ImageGenerationJob**: AI image generation tasks

## 🚀 Quick Start

### Requirements
- Node.js 18+
- PostgreSQL database
- Dify AI platform account

### Installation Steps

1. **Clone the Project**
```bash
git clone <repository-url>
cd v0.9_Neolish
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
```bash
cp .env.example .env.local
```

Edit the `.env.local` file and configure the following key variables:
```env
# Database connection
DATABASE_URL="postgresql://username:password@localhost:5432/neolish"

# NextAuth configuration
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Dify AI configuration
DIFY_API_KEY="your-dify-api-key"
DIFY_BASE_URL="https://api.dify.ai/v1"
```

4. **Initialize Database**
```bash
npx prisma migrate dev
npx prisma db seed
```

5. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to start using the application.

## 📱 User Guide

### Basic Workflow

1. **Registration and Login**
   - Register an account using activation code
   - Automatically join the corresponding team after login

2. **Create Style Profiles**
   - Manually input brand style information
   - Or automatically extract style features through URLs

3. **Manage Merchandise**
   - Add product or service information
   - Support multiple import methods

4. **Define Audiences**
   - Create target audience profiles
   - Set audience tags and characteristics

5. **Generate Outlines**
   - Select style profiles and merchandise
   - Input article key points
   - AI generates structured outlines

6. **Create Articles**
   - Generate article drafts based on outlines
   - Use rich text editor to refine content
   - Add AI-generated illustrations

### Team Collaboration

- **Team Management**: Team owners can manage members and permissions
- **Resource Sharing**: All resources within a team (styles, merchandise, audiences, etc.) are shared
- **Permission Control**: Different roles have different operational permissions

## 🔧 Development Guide

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── [locale]/       # Internationalized routes
│   └── api/            # API routes
├── components/         # React components
├── lib/               # Utility libraries and configurations
├── utils/             # Utility functions
└── i18n/              # Internationalization configuration

prisma/
├── schema.prisma      # Database model definitions
└── migrations/        # Database migration files
```

### Core Components

- **Authentication System**: User authentication based on NextAuth.js
- **Database Layer**: Prisma ORM + PostgreSQL
- **UI Components**: Modern interface based on Radix UI
- **Editor**: Tiptap rich text editor
- **AI Integration**: Dify workflow integration

### API Endpoints

Main API endpoints:
- `/api/auth/*` - User authentication
- `/api/teams/*` - Team management
- `/api/style-profiles/*` - Style profile management
- `/api/merchandise/*` - Merchandise management
- `/api/outlines/*` - Outline management
- `/api/articles/*` - Article management

## 🎨 Interface Features

### Modern Design
- **Responsive Layout**: Adapts to desktop and mobile devices
- **Dark Theme**: Supports light and dark theme switching
- **Internationalization**: Supports Chinese, English, and Japanese

### User Experience
- **Intuitive Navigation**: Clear feature categorization and navigation
- **Real-time Feedback**: Operation status and progress indicators
- **Quick Operations**: Keyboard shortcuts and batch operations

## 📈 Feature Status

### ✅ Completed Features
- User registration, login, team management
- Activation code system (regular and universal codes)
- Style profile management (manual creation and URL extraction)
- Merchandise management (multi-source import and AI summarization)
- Audience profile management
- Article outline generation and editing
- Article creation and rich text editing
- AI image generation integration
- Password strength validation (multi-language support)

### 🚧 In Development
- Workspace concept implementation
- Proactive AI assistant
- Visual strategy canvas
- Advanced analytics tools

### 📋 Planned Features
- Market analysis assistant
- Social media publishing
- Marketing funnel analysis
- Collaborative commenting system

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or suggestions, please contact me through:
- Email: karry.viber@gmail.com

---

*Neolish - Let AI be your marketing content creation partner* 🚀
