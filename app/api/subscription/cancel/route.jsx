import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

// Force dynamic rendering to avoid build-time database connection
export const dynamic = 'force-dynamic';

// Lazy initialization to avoid build-time errors
let stripeInstance = null;

function getStripe() {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeInstance = new Stripe(secretKey);
  }
  return stripeInstance;
}

export async function POST(request) {
  try {
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = user.primaryEmailAddress.emailAddress;

    // Get user record
    const userRecord = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!userRecord || userRecord.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const stripeSubscriptionId = userRecord[0].stripeSubscriptionId;

    if (!stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Cancel subscription at period end
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.update(
      stripeSubscriptionId,
      {
        cancel_at_period_end: true
      }
    );

    return NextResponse.json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
      cancelAt: subscription.cancel_at
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}

