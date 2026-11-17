import { makeFunctionReference } from "convex/server";

// A typed reference to convex/waitlist.ts `join`. Referenced by name rather
// than imported from ../convex/_generated so this folder builds and deploys
// on its own. Keep the types in sync with the mutation's validators.
export const joinWaitlist = makeFunctionReference<
  "mutation",
  { email: string; source?: string },
  { status: "joined" | "already_joined" }
>("waitlist:join");
