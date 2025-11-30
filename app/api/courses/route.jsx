import { NextResponse } from 'next/server';
import { coursesTable, enrollCourseTable } from '@/config/schema';
import { db } from '@/config/db';
import { and, desc, eq, sql } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import { checkSubscriptionLimit } from '@/lib/subscription';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get('courseId');
    const user = await currentUser(); // Renamed to "user" to match usage below


    if(courseId == 0 ) {
         const result = await db.select().from(coursesTable)
            .where(sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`);

            console.log(result);    

        return NextResponse.json(result);

    }
    if (courseId) {
        const result = await db.select().from(coursesTable)
            .where(eq(coursesTable.cid, courseId));

            console.log(result);    

        return NextResponse.json(result[0]);
    } else {
        const result = await db.select().from(coursesTable)
            .where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress))
            .orderBy(desc(coursesTable.id)); // <-- chain orderBy here

        console.log(result);
        return NextResponse.json(result);
    }
}

// DELETE a course (only by the owner)
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams?.get('courseId');
        const user = await currentUser();

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userEmail = user.primaryEmailAddress?.emailAddress;

        // First, verify the course belongs to the user
        const course = await db.select().from(coursesTable)
            .where(and(
                eq(coursesTable.cid, courseId),
                eq(coursesTable.userEmail, userEmail)
            ));

        if (course.length === 0) {
            return NextResponse.json({ error: 'Course not found or unauthorized' }, { status: 404 });
        }

        // Delete enrollments for this course first (foreign key constraint)
        await db.delete(enrollCourseTable)
            .where(eq(enrollCourseTable.cid, courseId));

        // Delete the course
        await db.delete(coursesTable)
            .where(and(
                eq(coursesTable.cid, courseId),
                eq(coursesTable.userEmail, userEmail)
            ));

        return NextResponse.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Delete course error:', error);
        return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
    }
}
