"use server";

import { ConvexHttpClient } from "convex/browser";
import { ConvexError } from "convex/values";
import { joinWaitlist } from "@/lib/convex";
import { isValidEmail, normalizeEmail } from "@/lib/email";

export type JoinState = {
  status: "idle" | "joined" | "already_joined" | "invalid" | "error";
  email?: string;
};

export async function joinWaitlistAction(
  _prev: JoinState,
  formData: FormData,
): Promise<JoinState> {
  // Honeypot: real people never see or fill this field.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "joined" };
  }

  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!isValidEmail(email)) {
    return { status: "invalid", email };
  }

  const source = String(formData.get("source") ?? "").slice(0, 64) || undefined;

  const url = process.env.CONVEX_URL;
  if (!url) {
    console.error("CONVEX_URL is not set; see web/.env.example");
    return { status: "error", email };
  }

  try {
    const client = new ConvexHttpClient(url);
    const result = await client.mutation(joinWaitlist, { email, source });
    return { status: result.status, email };
  } catch (error) {
    if (error instanceof ConvexError) {
      return { status: "invalid", email };
    }
    console.error("Waitlist sign-up failed", error);
    return { status: "error", email };
  }
}
