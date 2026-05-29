"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

type LeadCaptureFormProps = {
  product: Product;
};

type DraftState = {
  subject: string;
  email: string;
  linkedIn: string;
};

export function LeadCaptureForm({ product }: LeadCaptureFormProps) {
  const [draft, setDraft] = useState<DraftState | null>(null);

  if (draft) {
    return (
      <article className="detail-panel emphasis-panel">
        <p className="eyebrow">Outreach drafted</p>
        <h2>Your message for {product.bankName}</h2>
        <div className="draft-block">
          <strong>Subject</strong>
          <p>{draft.subject}</p>
        </div>
        <div className="draft-block">
          <strong>Email draft</strong>
          <p className="draft-copy">{draft.email}</p>
        </div>
        <div className="draft-block">
          <strong>LinkedIn note</strong>
          <p className="draft-copy">{draft.linkedIn}</p>
        </div>
        <p className="note">
          Tighten this further with one company-specific signal from the last 7
          days before you send it.
        </p>
        <button type="button" className="submit-button" onClick={() => setDraft(null)}>
          Edit inputs
        </button>
      </article>
    );
  }

  return (
    <article className="detail-panel">
      <p className="eyebrow">Message builder</p>
      <h2>Turn your fit into executive-ready outreach</h2>
      <form
        className="lead-form"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const targetExecutive = String(formData.get("targetExecutive") || "the product leader");
          const role = String(formData.get("role") || "Head of Product");
          const positioning = String(formData.get("positioning") || "").trim();
          const proof = String(formData.get("proof") || "").trim();
          const reasonNow = String(formData.get("reasonNow") || "").trim();
          const introPath = String(formData.get("introPath") || "").trim();
          const mainAngle = product.outreachAngles?.[0] ?? product.reasons[0];

          setDraft({
            subject: `${role} | helping ${product.bankName} scale product leadership with more focus`,
            email: [
              `Hi ${targetExecutive},`,
              "",
              `I’m reaching out because ${reasonNow || product.summary.toLowerCase()}.`,
              "",
              `I’m exploring ${role} opportunities where I can help a fintech leadership team solve problems like ${mainAngle.toLowerCase()}. ${positioning}`,
              "",
              `A few relevant proof points: ${proof}.`,
              "",
              `What stood out about ${product.bankName} is the opportunity to ${mainAngle.charAt(0).toLowerCase()}${mainAngle.slice(1)}.`,
              "",
              introPath
                ? `If helpful, I can also share a short note on how I would approach this area, and I may be able to come in through ${introPath}.`
                : "If helpful, I can share a short 90-day point of view on how I would approach this remit.",
              "",
              "Best,",
              "[Your name]"
            ].join("\n"),
            linkedIn: `Hi ${targetExecutive} - I’m exploring Head of Product roles in fintech and your work at ${product.bankName} caught my attention. I’ve led product organisations through challenges like ${mainAngle.toLowerCase()} and thought a short conversation could be useful. Open to connecting?`
          });
        }}
      >
        <div className="field-group">
          <label htmlFor="targetExecutive">Target executive</label>
          <input
            id="targetExecutive"
            name="targetExecutive"
            defaultValue={product.executiveTargets?.[0]?.name ?? ""}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="role">Target role title</label>
          <input id="role" name="role" defaultValue="Head of Product" required />
        </div>

        <div className="field-group">
          <label htmlFor="positioning">Your positioning statement</label>
          <textarea
            id="positioning"
            name="positioning"
            defaultValue="I lead product organisations through scale, sharper prioritisation, and stronger operating cadence."
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="proof">Evidence you can cite</label>
          <textarea
            id="proof"
            name="proof"
            defaultValue={(product.proofPoints ?? []).slice(0, 2).join("; ")}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="reasonNow">Why this company now</label>
          <textarea
            id="reasonNow"
            name="reasonNow"
            defaultValue={product.nextStep ?? product.summary}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="introPath">Warm path or call-to-action</label>
          <input
            id="introPath"
            name="introPath"
            placeholder="a mutual investor, founder intro, or direct 20-minute conversation"
          />
        </div>

        <p className="note">
          The strongest outreach combines one live company signal, one sharp
          operating angle, and one concrete proof point from your background.
        </p>

        <button type="submit" className="submit-button">
          Generate outreach draft
        </button>
      </form>
    </article>
  );
}
