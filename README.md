# 📖 Kamal's Diary - Personal Calendar & Finance Tracker

A beautiful, feature-rich personal diary application built with Next.js 16, MongoDB, and TypeScript. Track your todos, expenses, and daily notes all in one elegant interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)

## ✨ Features

- 📅 **Interactive Calendar** - Beautiful calendar interface with date selection
- ✅ **Todo Management** - Create, update, and track todos with priority levels
- 💰 **Expense Tracking** - Monitor your spending with categorized expenses
- 📝 **Daily Notes** - Write and save personal notes for each day
- 🎨 **Beautiful UI** - Diary-themed design with smooth animations
- 🔒 **Secure** - MongoDB Atlas cloud storage with authentication
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast** - Optimized with Next.js App Router and server-side rendering

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works great!)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd calendar-finance-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kamals-diary?retryWrites=true&w=majority
   ```
   
   > **Note**: If your password contains special characters, URL-encode them (e.g., `@` → `%40`)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

See [API.md](./API.md) for complete API reference with request/response examples.

### Quick API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/todos` | GET | Fetch todos for a date |
| `/api/todos` | POST | Create a new todo |
| `/api/todos` | PATCH | Update a todo |
| `/api/todos` | DELETE | Delete a todo |
| `/api/expenses` | GET | Fetch expenses for a date |
| `/api/expenses` | POST | Create a new expense |
| `/api/expenses` | PATCH | Update an expense |
| `/api/expenses` | DELETE | Delete an expense |
| `/api/notes` | GET | Fetch note for a date |
| `/api/notes` | POST | Create/update a note |
| `/api/notes` | PATCH | Update a note |
| `/api/notes` | DELETE | Delete a note |

## 🏗️ Project Structure

```
calendar-finance-app/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── todos/
│   │   │   ├── expenses/
│   │   │   ├── notes/
│   │   │   └── test-db/
│   │   ├── layout.tsx        # Root layout with metadata
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── Calendar.tsx
│   │   └── DayView.tsx
│   ├── lib/                  # Utilities
│   │   ├── mongodb.ts        # Database connection
│   │   └── api-utils.ts      # API helpers
│   ├── models/               # Mongoose models
│   │   ├── Todo.ts
│   │   ├── Expense.ts
│   │   └── Note.ts
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── .env.local               # Environment variables (not in git)
├── .env.example             # Environment template
└── package.json
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `MONGODB_URI` environment variable
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Styling**: TailwindCSS 4
- **Icons**: Lucide React
- **Hosting**: Vercel (recommended)

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |

## 🧪 Testing

Test the database connection:
```bash
curl http://localhost:3000/api/test-db
```

Expected response:
```json
{
  "success": true,
  "message": "MongoDB connection successful!",
  "details": {
    "status": "connected",
    "database": "kamals-diary"
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)

## 📧 Contact

Created by Kamal Kishore - feel free to reach out!

---

**Happy journaling! 📖✨**
