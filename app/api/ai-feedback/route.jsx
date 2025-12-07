import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getEnvAsync } from "@/lib/secrets";

export const dynamic = 'force-dynamic';

const FEEDBACK_PROMPT = `{{conversation}}

Based on this Interview Conversation between assistant and user, 
Give me feedback for user interview. Give me rating out of 10 for technical Skills, 
Communication, Problem Solving, Experience. Also give me summary in 3 lines 
about the interview and one line to let me know whether is recommended 
for hire or not with message very strictly. Give me response in JSON format

{
    feedback:{
        rating:{TechnicalSkills:5,Communication:6,ProblemSolving:4,Experience:7,Behavioral:8,Analysis:9},
        summary:<in 3 Line>,
        Recommendation:'',
        RecommendationMessage:''
    }
}`;

export async function POST(req) {
    try {
        const { conversation } = await req.json();
        const apiKey = await getEnvAsync('GEMINI_API_KEY');
        if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

        const genAI = new GoogleGenAI({ apiKey });
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: FEEDBACK_PROMPT.replace("{{conversation}}", JSON.stringify(conversation)),
        });

        const content = result.text || result.response?.text() || JSON.stringify(result);
        return NextResponse.json({ content });
    } catch (e) {
        console.error('Error generating feedback:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
