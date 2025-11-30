import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Force dynamic rendering to avoid build-time API initialization
export const dynamic = 'force-dynamic';

const FEEDBACK_PROMPT = `{{conversation}}

Based on this Interview Conversation between assistant and user, 

Give me feedback for user interview. Give me rating out of 10 for technical Skills, 

Communication, Problem Solving, Experience. Also give me summary in 3 lines 

about the interview and one line to let me know whether is recommended 

for hire or not with message very strictly. Give me response in JSON format

{
    feedback:{
        rating:{
            TechnicalSkills:5,
            Communication:6,
            ProblemSolving:4,
            Experience:7,
            Behavioral:8,
            Analysis:9
        },
        summary:<in 3 Line>,
        Recommendation:'',
        RecommendationMessage:''
    }
}`;

export async function POST(req) {
    try {
        const { conversation } = await req.json();
        console.log('Generating feedback with Gemini...');
        const FINAL_PROMPT = FEEDBACK_PROMPT.replace("{{conversation}}", JSON.stringify(conversation));
       
        const genAI = new GoogleGenAI({ 
            apiKey: process.env.GEMINI_API_KEY 
        });
        
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: FINAL_PROMPT,
        });
        
        const content = result.text || result.response?.text() || JSON.stringify(result);
        
        console.log('Gemini feedback response:', content);
        return NextResponse.json({ content });
    } catch (e) {
        console.error('Error generating feedback:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
