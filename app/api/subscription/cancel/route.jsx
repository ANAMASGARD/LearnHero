import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { getDb } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { getEnvAsync } from "@/lib/secrets";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    const db = await getDb();
    const userRecord = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    if (!userRecord?.length) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const stripeSubscriptionId = userRecord[0].stripeSubscriptionId;
    if (!stripeSubscriptionId) return NextResponse.json({ error: "No active subscription found" }, { status: 400 });

    const secretKey = await getEnvAsync('STRIPE_SECRET_KEY');
    if (!secretKey) throw new Error('STRIPE_SECRET_KEY not set');
    const stripe = new Stripe(secretKey);

    const subscription = await stripe.subscriptions.update(stripeSubscriptionId, { cancel_at_period_end: true });

    return NextResponse.json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
      cancelAt: subscription.cancel_at
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
