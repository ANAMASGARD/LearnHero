import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { getEnvAsync } from "@/lib/secrets";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    const webhookSecret = await getEnvAsync('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
    }

    const secretKey = await getEnvAsync('STRIPE_SECRET_KEY');
    if (!secretKey) throw new Error('STRIPE_SECRET_KEY not set');
    const stripe = new Stripe(secretKey);

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    const db = await getDb();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.subscription && session.customer) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          const customer = await stripe.customers.retrieve(session.customer);
          const email = customer.email || session.metadata?.userEmail;
          if (email) {
            await db.update(usersTable).set({
              subscriptionStatus: "pro", subscriptionPlan: "pro",
              stripeCustomerId: session.customer, stripeSubscriptionId: session.subscription,
              subscriptionEndDate: new Date(subscription.current_period_end * 1000)
            }).where(eq(usersTable.email, email));
          }
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        if (customer.email) {
          const isPro = subscription.status === "active" || subscription.status === "trialing";
          await db.update(usersTable).set({
            subscriptionStatus: isPro ? "pro" : "free",
            subscriptionPlan: isPro ? "pro" : "basic",
            stripeSubscriptionId: event.type === "customer.subscription.deleted" ? null : subscription.id,
            subscriptionEndDate: event.type === "customer.subscription.deleted" ? null : new Date(subscription.current_period_end * 1000)
          }).where(eq(usersTable.email, customer.email));
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
