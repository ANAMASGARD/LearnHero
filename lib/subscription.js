import { getDb } from "@/config/db";
import { usersTable, coursesTable, interviewsTable } from "@/config/schema";
import { eq, count } from "drizzle-orm";

export async function getSubscriptionStatus(userEmail) {
  try {
    const db = await getDb();
    const user = await db.select().from(usersTable).where(eq(usersTable.email, userEmail)).limit(1);

    if (!user?.length) {
      return { status: 'free', plan: 'basic', isTrial: false, trialEndDate: null, isActive: false };
    }

    const userData = user[0];
    const isTrial = userData.subscriptionStatus === 'trial';
    let trialExpired = false;
    if (isTrial && userData.subscriptionEndDate) {
      trialExpired = new Date(userData.subscriptionEndDate) < new Date();
    }

    return {
      status: trialExpired ? 'free' : (userData.subscriptionStatus || 'free'),
      plan: userData.subscriptionPlan || 'basic',
      isTrial: isTrial && !trialExpired,
      trialEndDate: userData.subscriptionEndDate,
      isActive: (userData.subscriptionStatus === 'pro' || isTrial) && !trialExpired,
      stripeCustomerId: userData.stripeCustomerId,
      stripeSubscriptionId: userData.stripeSubscriptionId
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return { status: 'free', plan: 'basic', isTrial: false, trialEndDate: null, isActive: false };
  }
}

export async function getRemainingLimits(userEmail) {
  try {
    const subscription = await getSubscriptionStatus(userEmail);
    if (subscription.plan === 'pro' && subscription.isActive) {
      return { courses: { used: 0, limit: -1, remaining: -1 }, interviews: { used: 0, limit: -1, remaining: -1 } };
    }

    const db = await getDb();
    const coursesResult = await db.select({ count: count(coursesTable.id) }).from(coursesTable).where(eq(coursesTable.userEmail, userEmail));
    const interviewsResult = await db.select({ count: count(interviewsTable.id) }).from(interviewsTable).where(eq(interviewsTable.createdBy, userEmail));

    const coursesCount = coursesResult[0]?.count || 0;
    const interviewsCount = interviewsResult[0]?.count || 0;

    return {
      courses: { used: coursesCount, limit: 10, remaining: Math.max(0, 10 - coursesCount) },
      interviews: { used: interviewsCount, limit: 10, remaining: Math.max(0, 10 - interviewsCount) }
    };
  } catch (error) {
    console.error('Error getting remaining limits:', error);
    return { courses: { used: 0, limit: 10, remaining: 10 }, interviews: { used: 0, limit: 10, remaining: 10 } };
  }
}

export async function checkSubscriptionLimit(userEmail, type) {
  try {
    const subscription = await getSubscriptionStatus(userEmail);
    if (subscription.plan === 'pro' && subscription.isActive) return { allowed: true, reason: null };

    const limits = await getRemainingLimits(userEmail);
    const limit = type === 'course' ? limits.courses : limits.interviews;

    if (limit.remaining <= 0 && limit.limit !== -1) {
      return {
        allowed: false,
        reason: `You've reached your ${type} limit (${limit.limit}). Upgrade to Pro for unlimited ${type}s.`,
        limit
      };
    }
    return { allowed: true, reason: null, limit };
  } catch (error) {
    console.error('Error checking subscription limit:', error);
    return { allowed: false, reason: 'Error checking subscription limits. Please try again.' };
  }
}
