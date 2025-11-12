import { db } from "@/config/db";
import { interviewResultsTable } from "@/config/schema";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { interview_id, fullname, email, conversation_transcript, feedback } = await request.json();
        
        const result = await db.insert(interviewResultsTable).values({
            interview_id,
            fullname,
            email,
            conversation_transcript,
            feedback,
        }).returning();
        
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error saving interview result:', error);
        return NextResponse.json({ error: 'Failed to save interview result' }, { status: 500 });
    }
}
