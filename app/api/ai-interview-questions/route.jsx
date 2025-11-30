import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Force dynamic rendering to avoid build-time API initialization
export const dynamic = 'force-dynamic';

const QUESTIONS_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions including candidate introduction, salary negotiation, and closing questions.

Job Title: {{jobPosition}}

Job Description: {{jobDescription}}

Interview Duration: {{duration}}

Interview Type: {{type}}

📝 Your task:

Analyze the job description to identify key responsibilities, required skills, and expected experience.

Generate a list of interview questions depends on interview duration

Adjust the number and depth of questions to match the interview duration or more.

Ensure the questions match the tone and structure of a real-life {{type}} interview.

🧩 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
 question:'',
 type:'Candidate selfIntroduction about education background, work experience/Candidate home and working locations/worked previous and current working company/Why Should we hire you/Present salary negotiation/Technical/Behavioral/Experience/Problem Solving/Leadership'
},{
...
}]

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobPosition}} role.`;

export async function POST(req) {
    try {
        const { jobPosition, jobDescription, duration, type } = await req.json();
        
        const FINAL_PROMPT = QUESTIONS_PROMPT
            .replace('{{jobPosition}}', jobPosition)
            .replace('{{jobDescription}}', jobDescription)
            .replace('{{duration}}', duration)
            .replace('{{type}}', Array.isArray(type) ? type.join(', ') : type);

        console.log('Generating questions with Gemini...');

        const genAI = new GoogleGenAI({ 
            apiKey: process.env.GEMINI_API_KEY 
        });
        
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: FINAL_PROMPT,
        });
        
        const content = result.text;
        
        console.log('Gemini response:', content);
        return NextResponse.json({ content });
    } catch (e) {
        console.error('Error generating questions:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
