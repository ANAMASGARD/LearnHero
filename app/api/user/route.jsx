import { getDb } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { email, name } = await request.json();
        if (!email || !name) {
            return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
        }

        const db = await getDb();
        const users = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (users.length === 0) {
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 30);
            
            const result = await db.insert(usersTable).values({
                name,
                email,
                subscriptionStatus: 'trial',
                subscriptionPlan: 'basic',
                subscriptionEndDate: trialEndDate,
            }).returning(usersTable);

            return NextResponse.json(result[0]);
        }

        return NextResponse.json(users[0]);
    } catch (error) {
        console.error('Error in POST /api/user:', error);
        return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
    }
}
