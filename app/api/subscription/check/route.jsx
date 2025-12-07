import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getSubscriptionStatus, getRemainingLimits } from "@/lib/subscription";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    const subscription = await getSubscriptionStatus(email);
    const limits = await getRemainingLimits(email);

    return NextResponse.json({ subscription, limits });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json({ error: "Failed to check subscription status" }, { status: 500 });
  }
}
