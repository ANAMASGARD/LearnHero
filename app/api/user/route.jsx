import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Force dynamic rendering to avoid build-time database connection
export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        // Parse JSON body with error handling
        const body = await request.json();
        const { email, name } = body;

        // Validate required fields
        if (!email || !name) {
            return NextResponse.json(
                { error: 'Email and name are required' },
                { status: 400 }
            );
        }

        //if user already exists, return
        const users = await db.select().from(usersTable)
            .where(eq(usersTable.email, email));

        //if not then insert new user 
        if (users.length === 0) {
            // Initialize 30-day trial for new users
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 30);
            
            const result = await db.insert(usersTable).values({
                name: name,
                email: email,
                subscriptionStatus: 'trial',
                subscriptionPlan: 'basic',
                subscriptionEndDate: trialEndDate,
            }).returning(usersTable);

            console.log('User created with 30-day trial:', result);
        
            return NextResponse.json(result[0]);
        }

        return NextResponse.json(users[0]);
    } catch (error) {
        console.error('Error in POST /api/user:', error);
        return NextResponse.json(
            { 
                error: error.message || 'Failed to create user',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 400 }
        );
    }
}