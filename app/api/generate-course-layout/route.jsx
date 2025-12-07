import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { getEnv } from '@/lib/secrets';

export const dynamic = 'force-dynamic';

const generateCourseImage = async (topic, category) => {
  try {
    const baseUrl = getEnv('NEXT_PUBLIC_BASE_URL') || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/generate-course-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, category })
    });
    if (response.ok) {
      const imageData = await response.json();
      return imageData.imageUrl;
    }
  } catch (error) {
    console.error('Error generating course image:', error);
  }
  return "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=600&fit=crop";
};

const PROMPT = `Genrate Learning Course depends on following details. In which Make sure to add Course Name, Description,Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, , Topic under each chapters , Duration for each chapters etc, in JSON format only

Schema:

{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": ["string"]
      }
    ]
  }
}

, User Input: `;

export function getAI() {
  const apiKey = getEnv('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  return new GoogleGenAI({ apiKey });
}

export async function POST(request) {
  try {
    const { courseId, ...formData } = await request.json();
    const user = await currentUser();

    if (user?.primaryEmailAddress?.emailAddress) {
      const { checkSubscriptionLimit } = await import('@/lib/subscription');
      const limitCheck = await checkSubscriptionLimit(user.primaryEmailAddress.emailAddress, 'course');
      if (!limitCheck.allowed) {
        return NextResponse.json({ error: limitCheck.reason, limit: limitCheck.limit }, { status: 403 });
      }
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: { responseMimeType: 'text/plain' },
      contents: [{ role: 'user', parts: [{ text: PROMPT + JSON.stringify(formData) }] }],
    });

    const RawResp = response?.candidates[0]?.content?.parts[0]?.text;
    const RawJson = RawResp.replace('```json', '').replace('```', '');
    const JSONResp = JSON.parse(RawJson);

    const courseImage = await generateCourseImage(
      formData.name || formData.topic || 'education',
      formData.category || 'learning'
    );

    await db.insert(coursesTable).values({
      ...formData,
      courseJson: JSONResp,
      courseImage: courseImage,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      cid: courseId,
    });

    return NextResponse.json({ courseId, courseImage });
  } catch (error) {
    console.error('Error in generate-course-layout:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate course' }, { status: 500 });
  }
}
