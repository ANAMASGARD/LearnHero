# 🚀 LearnHero - AI-Powered Learning Platform

<div align="center">

**Transform your learning journey with AI-powered course creation and interactive interviews**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=for-the-badge)](https://clerk.com/)

</div>

---

## 📖 What is LearnHero?

LearnHero is an AI-powered educational platform that helps you:
- 🤖 **Create AI-generated courses** in minutes
- 🎤 **Conduct AI-powered interviews** with real-time feedback
- 📊 **Track your learning progress** with detailed analytics
- 🎨 **Beautiful, responsive design** with dark mode

---

## ✨ Features

- **AI Course Generation**: Generate complete courses with chapters and content
- **AI Interviews**: Create and conduct voice-based interviews
- **Progress Tracking**: Monitor your learning journey
- **Interview Analytics**: View performance insights with GitHub-style graphs
- **Dark Mode**: Beautiful themes with smooth transitions
- **Responsive Design**: Works perfectly on all devices

---

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **Authentication**: Clerk
- **AI**: Google Gemini, Vapi.ai
- **Database**: PostgreSQL (Neon or AWS RDS)
- **Animations**: Framer Motion

---

## 📋 Prerequisites

Before starting, make sure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **PostgreSQL** database ([Neon](https://neon.tech/) or AWS RDS)
- **Git** ([Download](https://git-scm.com/))

### Required Accounts

- [Clerk](https://clerk.com/) - For authentication
- [Google AI Studio](https://aistudio.google.com/) - For AI features
- [Vapi.ai](https://vapi.ai/) - For AI interviews
- [AWS Account](https://aws.amazon.com/) - For deployment

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/LearnHero.git
cd LearnHero
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication (get from https://dashboard.clerk.com/)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/workspace
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/workspace

# Database (get from Neon or AWS RDS)
DATABASE_URL=postgresql://user:password@host:port/database

# Google AI (get from https://aistudio.google.com/)
GOOGLE_GEN_AI_API_KEY=your_google_ai_key_here

# Vapi.ai (get from https://dashboard.vapi.ai/)
VAPI_API_KEY=your_vapi_key_here
VAPI_ASSISTANT_ID=your_vapi_assistant_id_here

# Unsplash (optional)
UNSPLASH_ACCESS_KEY=your_unsplash_key_here
```

### 4. Set Up Database

**Option 1: Using Neon (Easiest for Development)**

1. Sign up at [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string
4. Add it to `.env.local` as `DATABASE_URL`

**Option 2: Using AWS RDS**

1. Create a PostgreSQL database in AWS RDS
2. Get the connection string
3. Add it to `.env.local` as `DATABASE_URL`

### 5. Run Database Migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

---

## 🏗 Project Structure

```
LearnHero/
├── app/                    # Next.js pages and routes
│   ├── (auth)/            # Sign in/up pages
│   ├── (main)/            # Dashboard routes
│   ├── api/               # API endpoints
│   ├── workspace/         # Course workspace
│   └── page.js            # Landing page
├── components/            # Reusable components
├── config/                # Database config
└── public/                # Static files
```

---

## 🚢 Deploy to AWS

### Step 1: Prepare Your Application

1. Build the application:
   ```bash
   npm run build
   ```

2. Test the production build locally:
   ```bash
   npm start
   ```

### Step 2: Deploy Using AWS Amplify (Recommended)

1. **Push to GitHub**
   - Push your code to a GitHub repository

2. **Connect to AWS Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Select your branch (usually `main`)

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Output directory: `.next`
   - Node version: `18.x` or higher

4. **Add Environment Variables**
   - Add all variables from your `.env.local` file
   - Go to "Environment variables" in Amplify console
   - Add each variable one by one

5. **Deploy**
   - Click "Save and deploy"
   - Wait for deployment to complete
   - Your app will be live! 🎉

### Step 3: Deploy Using AWS Elastic Beanstalk (Alternative)

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize Elastic Beanstalk**
   ```bash
   eb init -p node.js learnhero
   ```

3. **Create Environment**
   ```bash
   eb create learnhero-env
   ```

4. **Set Environment Variables**
   ```bash
   eb setenv NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key CLERK_SECRET_KEY=your_key DATABASE_URL=your_url
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

### Step 4: Set Up Database (AWS RDS)

1. **Create RDS Instance**
   - Go to [AWS RDS Console](https://console.aws.amazon.com/rds/)
   - Click "Create database"
   - Choose PostgreSQL
   - Select "Free tier" for development
   - Set database name: `learnhero`
   - Note your endpoint and credentials

2. **Update Environment Variables**
   - Update `DATABASE_URL` in your deployment with RDS connection string
   - Format: `postgresql://username:password@endpoint:5432/learnhero`

3. **Run Migrations**
   - Connect to your RDS instance
   - Run: `npx drizzle-kit migrate`

---

## 📚 How to Use

### Creating a Course

1. Sign up/Login to your account
2. Go to Workspace
3. Click "Create New Course"
4. Fill in course details
5. AI generates your course automatically!

### Creating an Interview

1. Go to Dashboard
2. Click "Create New Interview"
3. Enter job position and description
4. Generate questions
5. Share the interview link with candidates
6. View results in the Interviews section

---

## 🔧 Troubleshooting

### Common Issues

**Issue**: "Clerk: Missing publishableKey"
- **Fix**: Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is in `.env.local` and restart the server

**Issue**: Database connection error
- **Fix**: Check your `DATABASE_URL` is correct and database is accessible

**Issue**: Build fails on AWS
- **Fix**: Make sure all environment variables are set in AWS console

---

## 🤝 Contributing

Contributions are welcome! 

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/LearnHero/issues)


---

<div align="center">

**Made with ❤️ by the Gaurav Chaudhary**

[⬆ Back to Top](#-learnhero---ai-powered-learning-platform)

</div>
