"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function NewsletterForm() {
  const [requested, setRequested] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setRequested(true); }
  return <form className="newsletter-form" onSubmit={submit}><label className="sr-only" htmlFor="newsletter-email">Email address</label><div><input id="newsletter-email" type="email" required placeholder="Your email address" /><button type="submit" aria-label="Join the mailing list"><ArrowRight size={17} /></button></div><small role="status">{requested ? "Thanks — the signup service is not connected yet." : "A low-volume note when something new lands. Signup is a preview only."}</small></form>;
}
