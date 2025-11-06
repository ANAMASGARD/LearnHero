import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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
            const result = await db.insert(usersTable).values({
                name: name,
                email: email,
            }).returning(usersTable);

            console.log(result);
        
            return NextResponse.json(result[0]);
        }

        return NextResponse.json(users[0]);
    } catch (error) {
        console.error('Error in POST /api/user:', error);
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}