import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

// Deliberately simple: one "@", something before it, a dot in the domain,
// no spaces. Real verification happens when we email people.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_SOURCE_LENGTH = 64;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return email.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(email);
}

/**
 * Add an email to the waitlist.
 *
 * Returns "joined" for a new sign-up and "already_joined" when the email is
 * already on the list, so the page can say something friendly either way
 * without revealing anything else. Throws a ConvexError for an invalid email.
 */
export const join = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  returns: v.object({
    status: v.union(v.literal("joined"), v.literal("already_joined")),
  }),
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    if (!isValidEmail(email)) {
      throw new ConvexError({ code: "INVALID_EMAIL" });
    }

    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existing !== null) {
      return { status: "already_joined" as const };
    }

    const source = args.source?.trim().slice(0, MAX_SOURCE_LENGTH) || undefined;
    await ctx.db.insert("waitlist", { email, source });
    return { status: "joined" as const };
  },
});
