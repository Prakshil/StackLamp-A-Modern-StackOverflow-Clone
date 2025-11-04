# StackLamp - Modern Stack Overflow Clone

A modern, animated Q&A platform built with Next.js 16, Appwrite, and shadcn-style components.

## Features

✅ **Complete Q&A System**
- Ask questions with rich text, tags, and file attachments
- Answer questions with inline reply forms
- Upvote/downvote system with real-time vote counts
- View questions list on homepage

✅ **Authentication**
- Email/password authentication via Appwrite
- Google OAuth integration
- Protected routes (login required for posting/voting)

✅ **Modern UI**
- shadcn-inspired component library
- Responsive design
- Clean, minimal interface
- Smooth transitions and hover states

✅ **File Uploads**
- Attach files to questions via Appwrite Storage
- Upload indicator and file preview
- Easy file removal before posting

## Getting Started

### Prerequisites

- Node.js 18+
- Appwrite project with:
  - Database `stackoverflow_db`
  - Collections: `questions`, `answers`, `votes`, `comments`
  - Storage bucket for attachments
  - Google OAuth provider configured

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_APPWRITE_HOST_URL=https://fra.cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   APPWRITE_API_KEY=your_api_key
   NEXT_PUBLIC_APPWRITE_BUCKET_ID=attachments
   ```

3. **Run the dev server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Build for production

```bash
npm run build
npm start
```

## Routes

| Route              | Description                          |
|--------------------|--------------------------------------|
| `/`                | Homepage - browse questions          |
| `/ask`             | Ask a new question (auth required)   |
| `/question/[id]`   | Question detail + answers + voting   |
| `/login`           | Login page                           |
| `/register`        | Sign up page                         |

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Backend**: Appwrite (Auth, Database, Storage)
- **Styling**: Tailwind CSS
- **State**: Zustand (auth state management)
- **Icons**: Tabler Icons
- **TypeScript**: Full type safety

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage (questions list)
│   ├── ask/page.tsx                # Ask question form
│   ├── question/[id]/page.tsx      # Question detail + voting + answers
│   ├── (auth)/login                # Login page
│   ├── (auth)/register             # Register page
│   └── api/                        # API routes
├── components/ui/                  # UI components
├── models/                         # Appwrite configs
└── store/                          # State management
```

---

**StackLamp** - Ask, answer, and share knowledge.
