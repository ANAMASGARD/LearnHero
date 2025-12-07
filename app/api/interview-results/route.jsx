import { getDb } from "@/config/db";
import { interviewResultsTable, interviewsTable } from "@/config/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('email');
        if (!userEmail) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

        const db = await getDb();
        const userInterviews = await db.select().from(interviewsTable).where(eq(interviewsTable.createdBy, userEmail));
        const interviewIds = userInterviews.map(i => i.interview_id);

        if (interviewIds.length === 0) return NextResponse.json([]);

        const allResults = await db.select().from(interviewResultsTable).orderBy(desc(interviewResultsTable.completed_at));
        const results = allResults.filter(r => interviewIds.includes(r.interview_id));

        const resultsWithInterviewData = results.map(result => ({
            ...result,
            interview: userInterviews.find(i => i.interview_id === result.interview_id) || null
        }));

        return NextResponse.json(resultsWithInterviewData);
    } catch (error) {
        console.error('Error fetching interview results:', error);
        return NextResponse.json({ error: 'Failed to fetch interview results' }, { status: 500 });
    }
}
