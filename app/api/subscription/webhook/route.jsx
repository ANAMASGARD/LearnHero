import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: "Missing signature or webhook secret" },
        { status: 400 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (subscriptionId && customerId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customer = await stripe.customers.retrieve(customerId);
          
          const email = customer.email || session.metadata?.userEmail;

          if (email) {
            await db
              .update(usersTable)
              .set({
                subscriptionStatus: "pro",
                subscriptionPlan: "pro",
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                subscriptionEndDate: new Date(subscription.current_period_end * 1000)
              })
              .where(eq(usersTable.email, email));
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        if (email) {
          const status = subscription.status;
          let subscriptionStatus = "free";
          let subscriptionPlan = "basic";

          if (status === "active" || status === "trialing") {
            subscriptionStatus = "pro";
            subscriptionPlan = "pro";
          } else if (status === "canceled" || status === "unpaid") {
            subscriptionStatus = "free";
            subscriptionPlan = "basic";
          }

          await db
            .update(usersTable)
            .set({
              subscriptionStatus,
              subscriptionPlan,
              stripeSubscriptionId: subscription.id,
              subscriptionEndDate: new Date(subscription.current_period_end * 1000)
            })
            .where(eq(usersTable.email, email));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        if (email) {
          await db
            .update(usersTable)
            .set({
              subscriptionStatus: "free",
              subscriptionPlan: "basic",
              stripeSubscriptionId: null,
              subscriptionEndDate: null
            })
            .where(eq(usersTable.email, email));
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const subscriptionId = invoice.subscription;

        if (subscriptionId && customerId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customer = await stripe.customers.retrieve(customerId);
          const email = customer.email;

          if (email) {
            await db
              .update(usersTable)
              .set({
                subscriptionStatus: "pro",
                subscriptionPlan: "pro",
                subscriptionEndDate: new Date(subscription.current_period_end * 1000)
              })
              .where(eq(usersTable.email, email));
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        if (email) {
          // Optionally handle payment failure
          // You might want to send an email notification here
          console.log(`Payment failed for user: ${email}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

