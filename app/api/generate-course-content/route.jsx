import { NextResponse } from 'next/server';
import { getAI } from '../generate-course-layout/route';
import { getEnv } from '@/lib/secrets';
import axios from 'axios';
import { db } from '@/config/db';
import { eq } from 'drizzle-orm';
import { coursesTable } from '@/config/schema';

export const dynamic = 'force-dynamic';
// 2,57,15
const PROMPT = `Generate content for each topic in HTML format based on the Chapter name and Topics provided.

IMPORTANT: Return ONLY valid JSON with no extra text, no markdown formatting, no code blocks.

Required JSON Schema:
{
  "chapterName": "chapter name here",
  "topics": [
    {
      "topic": "topic name",
      "content": "HTML content here"
    }
  ]
}

User Input:

`;


export async function POST(req) {
    try {
        const {courseJson, courseTitle, courseId } = await req.json();

        const promises = courseJson?.chapters?.map(async (chapter, index) => {
            try {
                const config = {
                    responseMimeType: 'text/plain',
                };
                const model = 'gemini-2.5-flash';
                const contents = [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: PROMPT + JSON.stringify(chapter),
                            },
                        ],
                    },
                ];

  const ai = getAI();
  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });
//    console.log(response.candidates[0].content.parts[0].text);
   const RawResp = response.candidates[0].content.parts[0].text;
   
   console.log('Raw Gemini response:', RawResp);
   
   // Enhanced JSON cleaning to fix parsing errors
   let cleanJson = RawResp
     .replace(/```json/gi, '')
     .replace(/```/g, '')
     .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
     .trim();
   
   // Find the actual JSON content between first { and last }
   const firstBrace = cleanJson.indexOf('{');
   const lastBrace = cleanJson.lastIndexOf('}');
   
   if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
     cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
   }
   
   console.log('Cleaned JSON:', cleanJson);
   
   // Try to parse JSON with error handling
   let JSONResp;
   try {
     JSONResp = JSON.parse(cleanJson);
     console.log('Successfully parsed JSON for chapter:', chapter?.chapterName);
   } catch (parseError) {
     console.error('JSON Parse Error for chapter:', chapter?.chapterName, parseError);
     console.error('Problematic JSON:', cleanJson);
     
     // Try alternative parsing - sometimes Gemini returns array directly
     try {
       // Check if it's wrapped in extra structure
       const alternativeMatch = cleanJson.match(/\{[\s\S]*"topics"[\s\S]*\}/);
       if (alternativeMatch) {
         JSONResp = JSON.parse(alternativeMatch[0]);
         console.log('Parsed with alternative method');
       } else {
         throw new Error('Could not extract JSON');
       }
     } catch (altError) {
       console.error('Alternative parsing also failed');
       // Fallback: Create basic structure if parsing fails
       JSONResp = {
         chapterName: chapter?.chapterName,
         topics: chapter?.topics?.map(topic => ({
           topic: topic,
           content: `<h2>${topic}</h2><p>Content generation failed. Please regenerate this chapter.</p>`
         })) || []
       };
     }
   }

  // GET THE  YOUTUBE VIDEO ALSO 
  const youtubeData = await GetYoutubeVideo(chapter?.chapterName);

  console.log({
    youtubeVideo: youtubeData,
    courseData: JSONResp,
  })
  return {
    youtubeVideo: youtubeData,
    courseData: JSONResp,
  };
            } catch (chapterError) {
                console.error(`Error processing chapter ${index}:`, chapterError);
                
                // Return fallback data for failed chapter
                return {
                    youtubeVideo: [],
                    courseData: {
                        chapterName: chapter?.chapterName,
                        topics: [{
                            topic: "Introduction",
                            content: `Content for ${chapter?.chapterName} will be available soon.`
                        }]
                    }
                };
            }
        });
        
        const CourseContent = await Promise.all(promises);

        //Save to db
        const dbResp = await db.update(coursesTable).set({
            courseContent: CourseContent
        }).where(eq(coursesTable.cid, courseId));

        return NextResponse.json({
            courseName: courseTitle,
            CourseContent: CourseContent
        });
        
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to generate course content',
                details: error.message 
            }, 
            { status: 500 }
        );
    }
}
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const GetYoutubeVideo = async (topic) => {
    try {
        const YOUTUBE_API_KEY = getEnv('YOUTUBE_API_KEY');
        if (!YOUTUBE_API_KEY) {
            console.warn('YouTube API key not configured');
            return [];
        }

        const params = {
            part: 'snippet',
            q: topic,
            maxResults: 4,
            type: 'video',
            key: YOUTUBE_API_KEY,
        };
        
        const resp = await axios.get(YOUTUBE_BASE_URL, { params });
        const youtubeVideoListResp = resp.data.items || [];
        const youtubeVideoList = [];
        
        youtubeVideoListResp.forEach(item => {
            const data = {
                videoId: item.id?.videoId,
                title: item?.snippet?.title,
            }
            youtubeVideoList.push(data);
        });
        
        console.log("youtubeVideoList", youtubeVideoList);
        return resp.data.items;
    } catch (error) {
        console.error('YouTube API error:', error);
        return []; // Return empty array on error
    }
}