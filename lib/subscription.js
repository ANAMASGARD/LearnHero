import { db } from "@/config/db";
import { usersTable, coursesTable, interviewsTable } from "@/config/schema";
import { eq, count } from "drizzle-orm";

/**
 * Get subscription status for a user
 */
export async function getSubscriptionStatus(userEmail) {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail))
      .limit(1);

    if (!user || user.length === 0) {
      return {
        status: 'free',
        plan: 'basic',
        isTrial: false,
        trialEndDate: null,
        isActive: false
      };
    }

    const userData = user[0];
    const isTrial = userData.subscriptionStatus === 'trial';
    const isActive = userData.subscriptionStatus === 'pro' || isTrial;
    
    // Check if trial has expired
    let trialExpired = false;
    if (isTrial && userData.subscriptionEndDate) {
      const endDate = new Date(userData.subscriptionEndDate);
      trialExpired = endDate < new Date();
    }

    return {
      status: trialExpired ? 'free' : (userData.subscriptionStatus || 'free'),
      plan: userData.subscriptionPlan || 'basic',
      isTrial: isTrial && !trialExpired,
      trialEndDate: userData.subscriptionEndDate,
      isActive: isActive && !trialExpired,
      stripeCustomerId: userData.stripeCustomerId,
      stripeSubscriptionId: userData.stripeSubscriptionId
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      status: 'free',
      plan: 'basic',
      isTrial: false,
      trialEndDate: null,
      isActive: false
    };
  }
}

/**
 * Get remaining limits for a user
 */
export async function getRemainingLimits(userEmail) {
  try {
    const subscription = await getSubscriptionStatus(userEmail);
    
    // If Pro plan, return unlimited
    if (subscription.plan === 'pro' && subscription.isActive) {
      return {
        courses: { used: 0, limit: -1, remaining: -1 }, // -1 means unlimited
        interviews: { used: 0, limit: -1, remaining: -1 }
      };
    }

    // Count courses
    const coursesResult = await db
      .select({ count: count(coursesTable.id) })
      .from(coursesTable)
      .where(eq(coursesTable.userEmail, userEmail));

    const coursesCount = coursesResult[0]?.count || 0;

    // Count interviews
    const interviewsResult = await db
      .select({ count: count(interviewsTable.id) })
      .from(interviewsTable)
      .where(eq(interviewsTable.createdBy, userEmail));

    const interviewsCount = interviewsResult[0]?.count || 0;

    // Basic plan limits
    const COURSE_LIMIT = 10;
    const INTERVIEW_LIMIT = 10;

    return {
      courses: {
        used: coursesCount,
        limit: COURSE_LIMIT,
        remaining: Math.max(0, COURSE_LIMIT - coursesCount)
      },
      interviews: {
        used: interviewsCount,
        limit: INTERVIEW_LIMIT,
        remaining: Math.max(0, INTERVIEW_LIMIT - interviewsCount)
      }
    };
  } catch (error) {
    console.error('Error getting remaining limits:', error);
    return {
      courses: { used: 0, limit: 10, remaining: 10 },
      interviews: { used: 0, limit: 10, remaining: 10 }
    };
  }
}

/**
 * Check if user can create a course
 */
export async function checkSubscriptionLimit(userEmail, type) {
  try {
    const subscription = await getSubscriptionStatus(userEmail);
    const limits = await getRemainingLimits(userEmail);

    // Pro plan has unlimited access
    if (subscription.plan === 'pro' && subscription.isActive) {
      return { allowed: true, reason: null };
    }

    // Check specific limit
    if (type === 'course') {
      if (limits.courses.remaining <= 0 && limits.courses.limit !== -1) {
        return {
          allowed: false,
          reason: `You've reached your course limit (${limits.courses.limit}). Upgrade to Pro for unlimited courses.`,
          limit: limits.courses
        };
      }
    } else if (type === 'interview') {
      if (limits.interviews.remaining <= 0 && limits.interviews.limit !== -1) {
        return {
          allowed: false,
          reason: `You've reached your interview limit (${limits.interviews.limit}). Upgrade to Pro for unlimited interviews.`,
          limit: limits.interviews
        };
      }
    }

    return { allowed: true, reason: null, limit: type === 'course' ? limits.courses : limits.interviews };
  } catch (error) {
    console.error('Error checking subscription limit:', error);
    return { allowed: false, reason: 'Error checking subscription limits. Please try again.' };
  }
}

/**
 * Initialize trial for new user
 */
export async function initializeTrial(userEmail) {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail))
      .limit(1);

    if (!user || user.length === 0) {
      return false;
    }

    const userData = user[0];
    
    // Only initialize trial if user doesn't have one already
    if (userData.subscriptionStatus === 'trial' || userData.subscriptionStatus === 'pro') {
      return true;
    }

    // Set 30-day trial
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    await db
      .update(usersTable)
      .set({
        subscriptionStatus: 'trial',
        subscriptionPlan: 'basic',
        subscriptionEndDate: trialEndDate
      })
      .where(eq(usersTable.email, userEmail));

    return true;
  } catch (error) {
    console.error('Error initializing trial:', error);
    return false;
  }
}

