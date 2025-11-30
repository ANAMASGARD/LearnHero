import { db } from "@/config/db";
import { interviewResultsTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Force dynamic rendering to avoid build-time database connection
export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        
        if (!id) {
            return NextResponse.json({ error: 'Interview result ID is required' }, { status: 400 });
        }

        // Delete the interview result
        await db.delete(interviewResultsTable)
            .where(eq(interviewResultsTable.id, parseInt(id)));

        return NextResponse.json({ success: true, message: 'Interview result deleted successfully' });
    } catch (error) {
        console.error('Error deleting interview result:', error);
        return NextResponse.json({ error: 'Failed to delete interview result' }, { status: 500 });
    }
}


