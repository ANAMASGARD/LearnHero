import { db } from "@/config/db";
import { interviewsTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        // Await params in Next.js 15+
        const { interview_id } = await params;
        
        console.log('Fetching interview:', interview_id);
        
        const interview = await db.select().from(interviewsTable)
            .where(eq(interviewsTable.interview_id, interview_id))
            .limit(1);
        
        console.log('Interview found:', interview);
        
        if (interview.length === 0) {
            return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
        }
        
        return NextResponse.json(interview[0]);
    } catch (error) {
        console.error('Error fetching interview:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch interview' }, { status: 500 });
    }
}
