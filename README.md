# Apify Scraping Platform - Prototype

A modern web scraping platform prototype built with Next.js, featuring AI-powered lead intelligence and social listening capabilities.

## 🎯 Overview

This is a **prototype/mockup** demonstrating a scraping platform UI/UX for:
- Lead opportunity discovery
- Social media listening
- Data analytics and visualization
- Session management

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** Prisma (PostgreSQL)
- **Deployment:** Vercel

## 📂 Project Structure

```
apify-scraping-platform-v2/
├── app/                      # Next.js app router pages
│   ├── analytics/           # Analytics dashboard
│   ├── dashboard/           # Main dashboard
│   ├── sessions/            # Session management
│   ├── scrape/              # Scraping interface
│   └── mock/                # Mock/prototype pages
├── components/              # React components
│   ├── analytics/          # Analytics components
│   ├── dashboard/          # Dashboard components
│   ├── sessions/           # Session components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utilities and helpers
│   ├── apify/             # Apify client utilities
│   ├── db/                # Database queries
│   └── utils/             # Helper functions
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Supabase account)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Toeinakub/apify-scraping-platform-v2.git
cd apify-scraping-platform-v2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
DATABASE_URL="your-database-url"
APIFY_API_TOKEN="your-apify-token"
OPENAI_API_KEY="your-openai-key"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Features

### ✨ Implemented (Prototype)
- ✅ Modern dashboard UI
- ✅ Analytics visualization
- ✅ Session management interface
- ✅ Scraping form mockups
- ✅ Data table components
- ✅ Dark mode support
- ✅ Responsive design

### 🚧 In Development
- ⏳ Real-time scraping integration
- ⏳ AI-powered data classification
- ⏳ Advanced filtering and search
- ⏳ Export functionality
- ⏳ User authentication

## 🎨 Design System

This project uses a custom design system built with:
- **Colors:** HSL-based color palette with dark mode support
- **Typography:** Inter font family
- **Components:** shadcn/ui component library
- **Animations:** Framer Motion for smooth transitions

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔒 Security

⚠️ **Important:** Never commit sensitive data to the repository:
- API keys
- Database credentials
- Authentication tokens

All sensitive data should be stored in `.env.local` (which is gitignored).

## 📄 License

This is a prototype project for demonstration purposes.

## 🤝 Contributing

This is a prototype/mockup project. For questions or suggestions, please open an issue.

---

**Live Demo:** [https://apify-scraping-platform-v2.vercel.app](https://apify-scraping-platform-v2.vercel.app)

**Built with ❤️ using Next.js and shadcn/ui**
