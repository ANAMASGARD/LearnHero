import { getDb } from "@/config/db";
import { interviewsTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { checkSubscriptionLimit } from "@/lib/subscription";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await currentUser();
        const userEmail = user?.emailAddresses?.[0]?.emailAddress;
        if (!userEmail) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

        const { interview_id, jobPosition, jobDescription, duration, type, questionList, createdBy } = await request.json();
        const creatorEmail = createdBy || userEmail;

        const limitCheck = await checkSubscriptionLimit(creatorEmail, 'interview');
        if (!limitCheck.allowed) {
            return NextResponse.json({ error: limitCheck.reason, limit: limitCheck.limit }, { status: 403 });
        }

        const db = await getDb();
        const result = await db.insert(interviewsTable).values({
            interview_id, jobPosition, jobDescription, duration, type, questionList, createdBy: creatorEmail,
        }).returning();

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error creating interview:', error);
        return NextResponse.json({ error: error.message || 'Failed to create interview' }, { status: 500 });
    }
}
