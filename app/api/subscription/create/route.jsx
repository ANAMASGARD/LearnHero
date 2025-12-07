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
    const { priceId } = await request.json();
    if (!priceId) return NextResponse.json({ error: "Price ID is required" }, { status: 400 });

    const secretKey = await getEnvAsync('STRIPE_SECRET_KEY');
    if (!secretKey) throw new Error('STRIPE_SECRET_KEY not set');
    const stripe = new Stripe(secretKey);

    const db = await getDb();
    let userRecord = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!userRecord?.length) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let customerId = userRecord[0].stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email, name: user.fullName || user.firstName || "User",
        metadata: { clerkUserId: user.id, userEmail: email }
      });
      customerId = customer.id;
      await db.update(usersTable).set({ stripeCustomerId: customerId }).where(eq(usersTable.email, email));
    }

    const defaultPriceId = (await getEnvAsync('STRIPE_PRO_PRICE_ID')) || priceId;
    if (!defaultPriceId) return NextResponse.json({ error: "Stripe Price ID not configured" }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: defaultPriceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/workspace/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/workspace/billing?canceled=true`,
      metadata: { userEmail: email, clerkUserId: user.id }
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
