"use client";

/** Global class tokens used across portfolio sections (grain, chips, bookshelf, etc.). */
export function ThemeStyles({ theme }) {
  return (
    <style>{`
        :root { --sel-fg: ${theme.bg}; }
        .display { font-family: ${theme.display}; font-weight: 400; letter-spacing: -0.025em; line-height: 1; }
        .mono { font-family: ${theme.mono}; font-feature-settings: "ss01"; }
        .link-u { position: relative; }
        .link-u::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px;
          background: currentColor; transform-origin: right; transform: scaleX(0);
          transition: transform .45s cubic-bezier(.2,.8,.2,1);
        }
        .link-u:hover::after { transform-origin: left; transform: scaleX(1); }
        .chip { border: 1px solid ${theme.border}; border-radius: 999px; padding: 4px 10px; font-size: 11px; color: ${theme.dim}; font-family: ${theme.mono}; }
        .btn-primary {
          background: ${theme.ink}; color: ${theme.bg}; border: 0;
          padding: 12px 20px; border-radius: 999px; font-size: 13px; font-weight: 500;
          font-family: inherit; transition: transform .2s, background .2s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { transform: translateY(-1px); }
        .btn-ghost {
          background: transparent; color: ${theme.ink}; border: 1px solid ${theme.border};
          padding: 12px 20px; border-radius: 999px; font-size: 13px; font-weight: 500;
          font-family: inherit; transition: background .2s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-ghost:hover { background: ${theme.hover}; }
        .grain::before {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1;
          opacity: .035; mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .bookshelf-zone { overflow: visible; position: relative; }
        .reading-single-scroll {
          overflow-x: auto;
          overflow-y: visible;
          -webkit-overflow-scrolling: touch;
          margin: 40px 0 0;
          padding: clamp(28px, 5vw, 48px) clamp(20px, 4vw, 40px) 28px;
          scrollbar-width: thin;
        }
        .reading-single-scroll::-webkit-scrollbar { height: 5px; }
        .reading-single-scroll::-webkit-scrollbar-thumb {
          background: ${theme.border}; border-radius: 99px;
        }
        .reading-single-inner {
          width: max-content;
          margin: 0 auto;
          padding: 0 16px;
        }
        .bookshelf-row {
          display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center;
          gap: 14px;
          padding: 108px 10px 32px;
          border-bottom: 2px solid ${theme.border};
        }
        .bookshelf-row-single {
          flex-wrap: nowrap;
          justify-content: flex-start;
          border-bottom: none;
          padding: 132px 0 32px;
        }
        .reading-timeline-track {
          display: flex;
          align-items: flex-start;
          width: 100%;
          margin-top: 0;
          border-top: 2px solid ${theme.ink};
          opacity: 0.88;
        }
        .reading-timeline-segment {
          flex: 1;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 12px 8px 4px;
          min-width: 0;
          position: relative;
        }
        .reading-timeline-segment:not(:first-child) {
          border-left: 1px solid ${theme.border};
        }
        .reading-timeline-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: -17px;
          margin-bottom: 6px;
          background: ${theme.ink};
          border: 2px solid ${theme.bg};
          box-shadow: 0 0 0 1px ${theme.border};
          flex-shrink: 0;
        }
        .reading-timeline-genre {
          font-family: ${theme.mono};
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${theme.dim};
          line-height: 1.4;
          text-wrap: balance;
          hyphens: auto;
        }
        .bookshelf-slot {
          position: relative; display: flex; flex-direction: column; align-items: center;
          flex: 0 0 auto;
        }
        .bookshelf-bubble {
          pointer-events: none;
          box-sizing: border-box;
          position: absolute; left: 50%; bottom: calc(100% + 20px);
          transform: translateX(-50%) translateY(8px) scale(0.97);
          transform-origin: bottom center;
          width: min(360px, calc(100vw - 48px));
          padding: 24px 26px 26px;
          border-radius: 14px;
          background: ${theme.surface}; color: ${theme.ink}; border: 1px solid ${theme.border};
          box-shadow: 0 12px 42px rgba(0, 0, 0, 0.12);
          z-index: 30; opacity: 0; visibility: hidden;
          text-align: left;
          transition: opacity 160ms cubic-bezier(0.23, 1, 0.32, 1) 0ms,
            transform 160ms cubic-bezier(0.23, 1, 0.32, 1) 0ms,
            visibility 0ms linear 160ms;
        }
        .bookshelf-bubble-title {
          margin: 0 0 12px;
          padding: 0;
        }
        .bookshelf-bubble-author {
          margin: 0 0 14px;
          padding: 0;
        }
        .bookshelf-bubble-tag {
          margin: 0;
          padding: 14px 0 0;
          border-top: 1px solid ${theme.border};
          font-size: 14px;
          line-height: 1.62;
          color: ${theme.dim};
          font-style: normal;
        }
        .mini-book-btn {
          display: block;
          padding: 0;
          margin: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: transform 175ms cubic-bezier(0.23, 1, 0.32, 1);
          filter: drop-shadow(2px 4px 10px rgba(0, 0, 0, 0.12));
        }
        .mini-book-block {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .mini-book-pages-top {
          align-self: center;
          width: calc(100% - 4px);
          height: 7px;
          border-radius: 4px 4px 0 0;
          border: 1px solid rgba(0, 0, 0, 0.07);
          border-bottom: none;
          background:
            repeating-linear-gradient(
              -90deg,
              #f7f4ec 0 2px,
              #ebe5d8 2px 3px,
              #f2ede3 3px 4px
            );
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
        }
        .mini-book-body {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          min-height: 152px;
        }
        .mini-book-spine {
          flex: 0 0 auto;
          width: 29px;
          border-radius: 3px 0 0 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            inset 2px 0 6px rgba(255, 255, 255, 0.2),
            inset -2px 0 8px rgba(0, 0, 0, 0.15);
          font-family: ${theme.mono};
          font-weight: 600;
          font-size: 12px;
        }
        .mini-book-letter {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          letter-spacing: 0.04em;
        }
        .mini-book-pages-edge {
          flex: 0 0 auto;
          border-radius: 0 5px 5px 0;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-left: none;
          background:
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.5) 0 1px,
              rgba(0, 0, 0, 0.035) 1px 2px,
              rgba(255, 255, 255, 0.35) 2px 3px
            );
          box-shadow: inset 3px 0 6px rgba(0, 0, 0, 0.04);
        }
        @media (hover: hover) and (pointer: fine) {
          .bookshelf-slot:hover .bookshelf-bubble {
            opacity: 1; visibility: visible;
            transform: translateX(-50%) translateY(0) scale(1);
            transition: opacity 160ms cubic-bezier(0.23, 1, 0.32, 1) 105ms,
              transform 160ms cubic-bezier(0.23, 1, 0.32, 1) 105ms,
              visibility 0ms linear 0ms;
          }
          .bookshelf-slot:hover .mini-book-btn:not(:active) { transform: translateY(-7px); }
        }
        .bookshelf-slot.bookshelf-slot--pinned .bookshelf-bubble {
          opacity: 1; visibility: visible;
          transform: translateX(-50%) translateY(0) scale(1);
          transition-delay: 0ms, 0ms, 0ms;
          transition-duration: 150ms, 150ms, 0ms;
        }
        .mini-book-btn:active {
          transform: scale(0.97);
          filter: drop-shadow(1px 2px 6px rgba(0, 0, 0, 0.1));
        }
        @media (hover: hover) and (pointer: fine) {
          .bookshelf-slot:hover .mini-book-btn:active:not(:disabled) {
            transform: translateY(-7px) scale(0.97);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bookshelf-bubble {
            transform: translateX(-50%) scale(1) !important;
            transition: opacity 120ms ease, visibility 120ms ease;
          }
          .bookshelf-slot:hover .bookshelf-bubble,
          .bookshelf-slot.bookshelf-slot--pinned .bookshelf-bubble {
            transform: translateX(-50%) scale(1) !important;
          }
          .mini-book-btn,
          .bookshelf-slot:hover .mini-book-btn:not(:active) { transform: none !important; }
          .mini-book-btn:active {
            transform: scale(0.97) !important;
          }
        }
      `}</style>
  );
}
