import { NextResponse } from 'next/server';
import { coursesTable, enrollCourseTable } from '@/config/schema';
import { getDb } from '@/config/db';
import { and, desc, eq, sql } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams?.get('courseId');
        const user = await currentUser();
        const db = await getDb();

        if(courseId == 0 ) {
            const result = await db.select().from(coursesTable)
                .where(sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`);
            return NextResponse.json(result);
        }
        
        if (courseId) {
            const result = await db.select().from(coursesTable)
                .where(eq(coursesTable.cid, courseId));
            return NextResponse.json(result[0]);
        } else {
            if (!user || !user.primaryEmailAddress?.emailAddress) {
                return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
            }
            const result = await db.select().from(coursesTable)
                .where(eq(coursesTable.userEmail, user.primaryEmailAddress.emailAddress))
                .orderBy(desc(coursesTable.id));
            return NextResponse.json(result);
        }
    } catch (error) {
        console.error('Error in GET /api/courses:', error);
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams?.get('courseId');
        const user = await currentUser();
        const db = await getDb();

        if (!courseId) return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const userEmail = user.primaryEmailAddress?.emailAddress;
        const course = await db.select().from(coursesTable)
            .where(and(eq(coursesTable.cid, courseId), eq(coursesTable.userEmail, userEmail)));

        if (course.length === 0) {
            return NextResponse.json({ error: 'Course not found or unauthorized' }, { status: 404 });
        }

        await db.delete(enrollCourseTable).where(eq(enrollCourseTable.cid, courseId));
        await db.delete(coursesTable).where(and(eq(coursesTable.cid, courseId), eq(coursesTable.userEmail, userEmail)));

        return NextResponse.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Delete course error:', error);
        return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
    }
}
