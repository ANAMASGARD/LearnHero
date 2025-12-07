import { NextResponse } from 'next/server';
import { getAI } from '../generate-course-layout/route';
import { getEnvAsync } from '@/lib/secrets';
import axios from 'axios';
import { getDb } from '@/config/db';
import { eq } from 'drizzle-orm';
import { coursesTable } from '@/config/schema';

export const dynamic = 'force-dynamic';

const PROMPT = `Generate content for each topic in HTML format based on the Chapter name and Topics provided.
IMPORTANT: Return ONLY valid JSON with no extra text, no markdown formatting, no code blocks.
Required JSON Schema:
{"chapterName": "chapter name here", "topics": [{"topic": "topic name", "content": "HTML content here"}]}
User Input:
`;

export async function POST(req) {
    try {
        const { courseJson, courseTitle, courseId } = await req.json();

        const promises = courseJson?.chapters?.map(async (chapter, index) => {
            try {
                const ai = await getAI();
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    config: { responseMimeType: 'text/plain' },
                    contents: [{ role: 'user', parts: [{ text: PROMPT + JSON.stringify(chapter) }] }],
                });

                const RawResp = response.candidates[0].content.parts[0].text;
                let cleanJson = RawResp.replace(/```json/gi, '').replace(/```/g, '').trim();
                const firstBrace = cleanJson.indexOf('{');
                const lastBrace = cleanJson.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1) cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);

                let JSONResp;
                try {
                    JSONResp = JSON.parse(cleanJson);
                } catch {
                    JSONResp = {
                        chapterName: chapter?.chapterName,
                        topics: chapter?.topics?.map(topic => ({
                            topic,
                            content: `<h2>${topic}</h2><p>Content generation failed.</p>`
                        })) || []
                    };
                }

                const youtubeData = await GetYoutubeVideo(chapter?.chapterName);
                return { youtubeVideo: youtubeData, courseData: JSONResp };
            } catch (chapterError) {
                console.error(`Error processing chapter ${index}:`, chapterError);
                return {
                    youtubeVideo: [],
                    courseData: { chapterName: chapter?.chapterName, topics: [{ topic: "Introduction", content: `Content for ${chapter?.chapterName} will be available soon.` }] }
                };
            }
        });

        const CourseContent = await Promise.all(promises);
        const db = await getDb();
        await db.update(coursesTable).set({ courseContent: CourseContent }).where(eq(coursesTable.cid, courseId));

        return NextResponse.json({ courseName: courseTitle, CourseContent });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to generate course content', details: error.message }, { status: 500 });
    }
}

const GetYoutubeVideo = async (topic) => {
    try {
        const YOUTUBE_API_KEY = await getEnvAsync('YOUTUBE_API_KEY');
        if (!YOUTUBE_API_KEY) return [];

        const resp = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: { part: 'snippet', q: topic, maxResults: 4, type: 'video', key: YOUTUBE_API_KEY }
        });
        return resp.data.items || [];
    } catch (error) {
        console.error('YouTube API error:', error);
        return [];
    }
};
