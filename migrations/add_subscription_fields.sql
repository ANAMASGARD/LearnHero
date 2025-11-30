-- Migration: Add subscription fields to users table
-- Run this SQL in your database to add the subscription fields

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "subscriptionStatus" VARCHAR(50) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS "subscriptionPlan" VARCHAR(50) DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS "subscriptionEndDate" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "stripeCustomerId" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" VARCHAR(255);

-- Set existing users to free plan if they don't have a status
UPDATE users 
SET "subscriptionStatus" = 'free', "subscriptionPlan" = 'basic' 
WHERE "subscriptionStatus" IS NULL;

