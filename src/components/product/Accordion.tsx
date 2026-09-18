"use client";

import { useState } from "react";

export interface AccordionItem {
  title: string;
  body: string;
}

export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  if (items.length === 0) return null;

  return (
    /* Ξεχωριστά χαμηλά κουτιά με μικρά κενά, όπως το mockup. */
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div
            key={item.title}
            className="overflow-hidden rounded-[0.6rem] border border-line bg-white"
          >
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-ink transition-colors hover:bg-cream"
              >
                {item.title}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                  className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </h3>
            {expanded && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">
                {item.body.split("\n").filter(Boolean).map((p, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-3" : ""}>
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
