import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // People who signed up on the landing page to hear when the app opens.
  waitlist: defineTable({
    // Stored trimmed and lowercased so duplicates are easy to catch.
    email: v.string(),
    // Where the sign-up came from, e.g. "landing" or "x". Optional.
    source: v.optional(v.string()),
  }).index("by_email", ["email"]),
});
