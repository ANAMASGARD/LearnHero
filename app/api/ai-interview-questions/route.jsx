import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getEnvAsync } from "@/lib/secrets";

export const dynamic = 'force-dynamic';

const QUESTIONS_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions.

Job Title: {{jobPosition}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

Generate questions matching the interview duration. Format in JSON:
interviewQuestions=[{question:'',type:'Technical/Behavioral/Experience/Problem Solving'}]`;

export async function POST(req) {
    try {
        const { jobPosition, jobDescription, duration, type } = await req.json();
        const FINAL_PROMPT = QUESTIONS_PROMPT
            .replace('{{jobPosition}}', jobPosition)
            .replace('{{jobDescription}}', jobDescription)
            .replace('{{duration}}', duration)
            .replace('{{type}}', Array.isArray(type) ? type.join(', ') : type);

        const apiKey = await getEnvAsync('GEMINI_API_KEY');
        if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

        const genAI = new GoogleGenAI({ apiKey });
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: FINAL_PROMPT,
        });

        return NextResponse.json({ content: result.text });
    } catch (e) {
        console.error('Error generating questions:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
