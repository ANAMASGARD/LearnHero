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
    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let userRecord = await db
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

    let customerId = userRecord[0].stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const stripe = getStripe();
      const customer = await stripe.customers.create({
        email: email,
        name: user.fullName || user.firstName || "User",
        metadata: {
          clerkUserId: user.id,
          userEmail: email
        }
      });

      customerId = customer.id;

      // Update user with Stripe customer ID
      await db
        .update(usersTable)
        .set({ stripeCustomerId: customerId })
        .where(eq(usersTable.email, email));
    }

    // Default Pro plan price ID - should be set in environment or passed from frontend
    // For now, we'll use a placeholder that needs to be configured
    const defaultPriceId = process.env.STRIPE_PRO_PRICE_ID || priceId;
    
    if (!defaultPriceId || defaultPriceId === 'price_1234567890') {
      return NextResponse.json(
        { error: "Stripe Price ID not configured. Please set STRIPE_PRO_PRICE_ID in environment variables." },
        { status: 400 }
      );
    }

    // Create checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: defaultPriceId,
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/workspace/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/workspace/billing?canceled=true`,
      metadata: {
        userEmail: email,
        clerkUserId: user.id
      }
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

