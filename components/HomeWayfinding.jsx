"use client";

/**
 * Editorial bento lane-picker for home — asymmetric grid, restrained motion,
 * no duplicate “routes” wording (navigation is inferred from typography).
 */
import Link from "next/link";
import { HOME_DESTINATIONS } from "@/lib/site-nav";

const BENTO_ORDER = ["/work", "/timeline", "/manifesto", "/now"];

function spanForHref(href) {
  if (href === "/work" || href === "/now") return { gridColumn: "1 / -1" };
  return {};
}

function accentStripe(href) {
  if (href === "/work") return "linear-gradient(90deg, rgba(16,185,129,0.92) 0px, rgba(16,185,129,0.92) 3px, transparent 3px)";
  if (href === "/now") return "linear-gradient(90deg, rgba(234,88,12,0.95) 0px, rgba(234,88,12,0.95) 3px, transparent 3px)";
  return `linear-gradient(90deg, rgba(15,15,15,0.16) 0px, rgba(15,15,15,0.16) 1px, transparent 1px)`;
}

export function HomeWayfinding({ theme }) {
  const items = BENTO_ORDER.map((h) => HOME_DESTINATIONS.find((x) => x.href === h)).filter(Boolean);
  const strongBorder = `${theme.ink}1f`;

  return (
    <section
      aria-label="Featured sections"
      style={{
        borderTop: `1px solid ${theme.border}`,
        padding: "clamp(48px, 8vw, 88px) clamp(20px, 5vw, 40px)",
        background:
          `linear-gradient(180deg, transparent 0%, ${theme.surface} 58%, transparent 100%)`,
      }}
    >
      <style>{`
        .bento-board {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(12px, 2vw, 18px);
          max-width: 1080px;
          margin: 0 auto;
        }
        .bento-link {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 148px;
          padding: clamp(22px, 4vw, 30px);
          border-radius: 18px;
          border: 1px solid ${theme.border};
          background: ${theme.surface};
          text-decoration: none;
          color: ${theme.ink};
          overflow: hidden;
          background-image: var(--accent-stripe), linear-gradient(165deg, ${theme.surface} 0%, color-mix(in srgb, ${theme.bg} 55%, ${theme.surface}) 100%);
          transition: transform 240ms cubic-bezier(0.23, 1, 0.32, 1), border-color 240ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 240ms cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.65) inset;
        }
        .bento-link:active {
          transform: scale(0.985);
        }
        @media (hover: hover) and (pointer: fine) {
          .bento-link:hover {
            transform: translateY(-4px);
            border-color: ${strongBorder};
            box-shadow: 0 28px 60px rgba(15, 15, 15, 0.1);
          }
        }
        @keyframes bentoReveal {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bento-link {
          animation: bentoReveal 0.62s cubic-bezier(0.23, 1, 0.32, 1) backwards;
        }
        .bento-link:nth-child(1) { animation-delay: 0.04s; }
        .bento-link:nth-child(2) { animation-delay: 0.09s; }
        .bento-link:nth-child(3) { animation-delay: 0.14s; }
        .bento-link:nth-child(4) { animation-delay: 0.19s; }
        @media (max-width: 640px) {
          .bento-board { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bento-link { animation: none; transition: none; }
          .bento-link:active { transform: none; }
          .bento-link:hover { transform: none; box-shadow: none; }
        }
      `}</style>

      <div style={{ maxWidth: 1080, margin: "0 auto 32px", textAlign: "left" }}>
        <p
          style={{
            margin: "0 0 12px",
            fontFamily: theme.display,
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            letterSpacing: "-0.035em",
            lineHeight: 1.14,
            color: theme.ink,
          }}
        >
          Threads worth opening.
        </p>
        <p
          style={{
            margin: 0,
            maxWidth: "46ch",
            fontSize: 16,
            lineHeight: 1.55,
            color: theme.dim,
            fontFamily: theme.body,
          }}
        >
          Reading lives on{' '}
          <Link href="/now" style={{ color: theme.ink, textUnderlineOffset: 3 }}>
            Now
          </Link>
          — bookshelf, screens, and cadence live there together.
        </p>
      </div>

      <div className="bento-board">
        {items.map((item) => {
          const { gridColumn } = spanForHref(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              data-cursor="link"
              data-cursor-label={item.label}
              className="bento-link mono"
              style={{
                ...(gridColumn ? { gridColumn } : {}),
                "--accent-stripe": accentStripe(item.href),
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: theme.dim,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: 16,
                    fontFamily: theme.display,
                    fontSize: "clamp(1.35rem, 3.2vw, 1.9rem)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.12,
                    color: theme.ink,
                  }}
                >
                  {item.hint}
                </span>
              </div>
              <span
                aria-hidden
                style={{
                  marginTop: 28,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: theme.ink,
                  opacity: 0.55,
                  alignSelf: "flex-start",
                }}
              >
                Enter
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
