import type { ReactNode } from "react";

/**
 * Κοινό συμβόλαιο πλάτους για όλα τα sections: ίδιο max-width και ίδια
 * αριστερή/δεξιά γραμμή. Το `w-full` είναι απαραίτητο — σε flex column το
 * `mx-auto` ακυρώνει το stretch και το section μαζεύεται στο περιεχόμενό του.
 */
export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "footer" | "header";
}) {
  return (
    <Tag className={`mx-auto w-full max-w-[75rem] px-4 sm:px-6 ${className}`}>{children}</Tag>
  );
}

/** Επικεφαλίδα ενότητας με προαιρετικό υπότιτλο και σύνδεσμο «δες όλα». */
export function SectionHeading({
  title,
  subtitle,
  action,
  size = "default",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  size?: "default" | "large";
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2
          className={`font-display font-extrabold text-ink ${
            size === "large" ? "text-[2rem] leading-tight" : "text-[1.75rem] leading-tight"
          }`}
        >
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
