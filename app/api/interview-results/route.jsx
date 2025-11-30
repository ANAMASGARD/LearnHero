import { db } from "@/config/db";
import { interviewResultsTable, interviewsTable } from "@/config/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('email');
        
        if (!userEmail) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Get all interviews created by the user
        const userInterviews = await db
            .select()
            .from(interviewsTable)
            .where(eq(interviewsTable.createdBy, userEmail));

        const interviewIds = userInterviews.map(interview => interview.interview_id);

        if (interviewIds.length === 0) {
            return NextResponse.json([]);
        }

        // Get all results and filter in JavaScript (simpler approach)
        const allResults = await db
            .select()
            .from(interviewResultsTable)
            .orderBy(desc(interviewResultsTable.completed_at));

        // Filter results for user's interviews
        const results = allResults.filter(result => 
            interviewIds.includes(result.interview_id)
        );

        // Join with interview data
        const resultsWithInterviewData = results.map(result => {
            const interview = userInterviews.find(i => i.interview_id === result.interview_id);
            return {
                ...result,
                interview: interview || null
            };
        });

        return NextResponse.json(resultsWithInterviewData);
    } catch (error) {
        console.error('Error fetching interview results:', error);
        return NextResponse.json({ error: 'Failed to fetch interview results' }, { status: 500 });
    }
}

