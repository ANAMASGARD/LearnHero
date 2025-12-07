import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { coursesTable , enrollCourseTable } from "@/config/schema"; // Note the "s" in Courses
import { and, desc ,eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Force dynamic rendering to avoid build-time database connection
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { courseId } = await request.json(); 
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    //if course already enrolled 
    const enrollCourses = await db.select().from(enrollCourseTable)
      .where(and(eq(enrollCourseTable.userEmail, userEmail), 
      eq(enrollCourseTable.cid, courseId)))

    if(enrollCourses?.length == 0) {
        const result = await db.insert(enrollCourseTable).values({
          cid: courseId,
          userEmail: userEmail,
        }).returning(enrollCourseTable);

        // Serialize the result to fix JSON serialization error
        const serializedResult = JSON.parse(JSON.stringify(result));
        return NextResponse.json(serializedResult);
    }
      
    return NextResponse.json('resp : Already enrolled in this course');
  } catch (error) {
    console.error("Error in POST /api/enroll-course:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {  // Use 'request' not 'req'
  try {
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;
    const { searchParams } = new URL(request.url);  // Fixed line
    const courseId = searchParams.get('courseId');

    if(courseId) {
      const result = await db.select().from(coursesTable)
      .innerJoin(enrollCourseTable,eq(coursesTable.cid, enrollCourseTable.cid))
      .where(and(eq(enrollCourseTable.userEmail, userEmail),
      eq(enrollCourseTable.cid, courseId)))
      .orderBy(desc(enrollCourseTable.id));

      // Serialize the result to fix JSON serialization error
      const serializedResult = result[0] ? JSON.parse(JSON.stringify(result[0])) : null;
      return NextResponse.json(serializedResult);
    } else {
      const result = await db.select().from(coursesTable)
      .innerJoin(enrollCourseTable,eq(coursesTable.cid, enrollCourseTable.cid))
      .where(eq(enrollCourseTable.userEmail, userEmail))
      .orderBy(desc(enrollCourseTable.id));

      // Serialize the result to fix JSON serialization error
      const serializedResult = JSON.parse(JSON.stringify(result));
      return NextResponse.json(serializedResult);
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const {completedChapter, courseId} = await req.json();
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;
    const result = await db.update(enrollCourseTable).set({
      completedChapters: completedChapter
    }).where(and(eq(enrollCourseTable.cid, courseId),
    eq(enrollCourseTable.userEmail, userEmail)))
    .returning(enrollCourseTable);
    
    // Serialize the result to fix JSON serialization error
    const serializedResult = JSON.parse(JSON.stringify(result));
    return NextResponse.json(serializedResult);
  } catch (error) {
    console.error("Error in PUT /api/enroll-course:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}