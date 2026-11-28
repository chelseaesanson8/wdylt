"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { joinWaitlistAction, type JoinState } from "@/app/actions";

const initialState: JoinState = { status: "idle" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const messages: Record<JoinState["status"], string> = {
  idle: "",
  joined: "Your place is saved. We'll write when the first pages open.",
  already_joined: "You're already on the list. We'll write when the first pages open.",
  invalid: "That email doesn't look quite right. Try it once more?",
  error: "Something went wrong on our side. Please try again in a moment.",
};

export function WaitlistForm({ id }: { id?: string }) {
  const [state, formAction, pending] = useActionState(joinWaitlistAction, initialState);
  const fieldId = useId();
  const statusId = useId();
  const sourceRef = useRef<HTMLInputElement>(null);

  // Remember where the visit came from (?ref=x or ?utm_source=x).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get("ref") ?? params.get("utm_source");
    if (source && sourceRef.current) sourceRef.current.value = source.slice(0, 64);
  }, []);

  // Once a rejected email has been fixed, clear the error as they type,
  // rather than waiting for the next submit.
  const [fixed, setFixed] = useState(false);
  useEffect(() => setFixed(false), [state]);

  const done = state.status === "joined" || state.status === "already_joined";
  const isError = (state.status === "invalid" || state.status === "error") && !fixed;

  const statusText = done || isError
    ? messages[state.status]
    : "One email when it opens. Nothing else.";

  return (
    <form id={id} action={formAction} className="waitlist">
      {!done && (
        <>
          <label htmlFor={fieldId} className="waitlist__label label">
            Your email
          </label>
          <div className="waitlist__row">
            <input
              id={fieldId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@example.com"
              defaultValue={state.email}
              aria-invalid={isError || undefined}
              aria-describedby={statusId}
              className="waitlist__input"
              onChange={(e) => {
                if (state.status === "invalid" && EMAIL_PATTERN.test(e.target.value.trim())) setFixed(true);
              }}
            />
            <button type="submit" className="waitlist__button pressable" disabled={pending}>
              <i aria-hidden="true" />
              {pending ? "Saving…" : "Save my place"}
            </button>
          </div>
          <input ref={sourceRef} type="hidden" name="source" defaultValue="landing" />
          <div className="waitlist__trap" aria-hidden="true">
            <label>
              Leave this empty
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
        </>
      )}
      <p
        id={statusId}
        aria-live="polite"
        className={done ? "waitlist__done" : isError ? "waitlist__status waitlist__status--error" : "waitlist__status"}
      >
        {statusText}
      </p>
    </form>
  );
}
