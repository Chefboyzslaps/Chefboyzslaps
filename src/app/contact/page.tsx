"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowRight, CircleAlert } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }
  return <div className="page-wrap inner-page contact-page"><div className="page-intro"><span className="eyebrow">START A CONVERSATION</span><h1>Say what’s<br /><em>on your mind.</em></h1><p>Licensing questions, collaborations, or just a note from the studio. We’re listening.</p></div><div className="contact-layout"><form className="contact-form" onSubmit={handleSubmit}><div className="form-row"><label>Name<input name="name" autoComplete="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label></div><label>Subject<input name="subject" required placeholder="What’s this about?" /></label><label>Message<textarea name="message" rows={6} required placeholder="Give us a little context…" /></label><div className="form-submit"><button className="button button-primary" type="submit">Send a note <ArrowRight size={15} /></button><span>This demo form does not send messages.</span></div>{submitted && <p className="form-feedback" role="status"><CircleAlert size={15} /> Thanks for reaching out. This form is a design preview and has not sent your message. Please connect an email service before launch.</p>}</form><aside className="contact-aside"><span className="eyebrow">FOR NOW</span><p>We’re getting our digital doors ready. Add the official booking and business email here before launch.</p><span className="placeholder-email">EMAIL ADDRESS TBC</span><div className="contact-rule" /><span className="eyebrow">PRESS · COLLABS · LICENSING</span></aside></div></div>;
}
