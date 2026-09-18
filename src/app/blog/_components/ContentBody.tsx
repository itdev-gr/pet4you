import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

/**
 * Περιεχόμενο CMS (άρθρα και στατικές σελίδες).
 *
 * Το κείμενο που γράφει ο merchant στο dashboard είναι markdown: επικεφαλίδες,
 * λίστες και πίνακες (ο οδηγός μεγεθών είναι πίνακας). Το react-markdown δεν
 * αποδίδει raw HTML, οπότε το περιεχόμενο δεν μπορεί να εισαγάγει markup.
 */
export function ContentBody({ content }: { content: string | null }) {
  if (!content) return null;
  return (
    <div className="text-base leading-8 text-ink-soft [overflow-wrap:anywhere]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-8 font-display text-2xl font-bold text-ink first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 font-display text-xl font-bold text-ink first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 font-display text-lg font-bold text-ink">{children}</h3>
          ),
          p: ({ children }) => <p className="mt-5 first:mt-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-ink">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="mt-5 list-disc space-y-2 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-5 list-decimal space-y-2 pl-5">{children}</ol>
          ),
          a: ({ href, children }) =>
            href?.startsWith("/") ? (
              <Link href={href} className="font-semibold text-forest underline">
                {children}
              </Link>
            ) : (
              <a
                href={href}
                rel="noopener noreferrer"
                className="font-semibold text-forest underline"
              >
                {children}
              </a>
            ),
          table: ({ children }) => (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm leading-normal">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-line bg-sand px-3 py-2 text-left font-semibold text-ink">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-line px-3 py-2">{children}</td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-4 border-sage pl-4 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="mt-8 border-line" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
