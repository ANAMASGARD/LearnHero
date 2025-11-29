# 🖼️ Unsplash Dynamic Course Images - Setup Guide

## ✅ What Was Implemented

Your course generation system now automatically fetches relevant, high-quality images from Unsplash for each course based on the topic and category.

### Files Created/Modified:
1. ✅ `app/api/generate-course-image/route.jsx` - New API endpoint
2. ✅ `next.config.js` - Added Unsplash image domains
3. ✅ `config/schema.js` - Added `courseImage` field to database
4. ✅ `app/api/generate-course-layout/route.jsx` - Integrated image generation
5. ✅ `.env` - Added Unsplash configuration placeholders

---

## 🔑 Setup Instructions

### Step 1: Add Your Unsplash Access Key

Open your `.env` file and replace:
```env
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

With your actual Access Key:
```env
UNSPLASH_ACCESS_KEY=YOUR_ACTUAL_ACCESS_KEY
```

**Important:** Use the **Access Key**, NOT the Secret Key!

---

### Step 2: Update Database Schema

Run this command to update your database with the new `courseImage` field:

```bash
npm run db:push
```

Or if using Drizzle Kit:
```bash
npx drizzle-kit push
```

---

### Step 3: Test the Feature

1. Start your development server:
```bash
npm run dev
```

2. Create a new course through your UI
3. The system will automatically:
   - Generate course content with AI
   - Fetch a relevant image from Unsplash
   - Save the image URL to the database
   - Return the course with the image

---

## 🎨 How It Works

1. When a course is created, the system calls `/api/generate-course-image`
2. It searches Unsplash with: `{topic} {category} education learning technology`
3. Returns a random image from the top 5 results
4. If Unsplash fails or no API key is set, it uses a fallback educational image
5. The image URL is stored in the `courseImage` field in the database

---

## 🖼️ Displaying Images in Your UI

In your course display components, use the `courseImage` field:

```jsx
import Image from 'next/image';

<Image
  src={course.courseImage || "/rocket.gif"}
  alt={course.name}
  width={1200}
  height={600}
  className="rounded-lg object-cover"
/>
```

---

## 🔧 Troubleshooting

### No images showing?
- Check that your Unsplash Access Key is correct in `.env`
- Verify you ran `npm run db:push` to update the database
- Check browser console for errors

### Fallback image showing?
- This means Unsplash API failed or no key is set
- Check your API key and Unsplash account status
- Unsplash free tier: 50 requests/hour

### Images not loading?
- Ensure `next.config.js` has the Unsplash domains configured
- Restart your dev server after changing `next.config.js`

---

## 📊 API Limits

Unsplash Free Tier:
- 50 requests per hour
- 5,000 requests per month

This is plenty for development and small-scale production use!

---

## 🚀 Production Deployment

Before deploying, update your `.env` in production:

```env
UNSPLASH_ACCESS_KEY=your_production_access_key
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## ✨ Features

- ✅ Automatic relevant image selection
- ✅ Fallback system if API fails
- ✅ High-quality images from Unsplash
- ✅ No breaking changes to existing courses
- ✅ Works with your existing course generation flow

---

**Need help?** Check the Unsplash API docs: https://unsplash.com/documentation
