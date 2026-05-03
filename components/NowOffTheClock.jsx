"use client";

import React, { useEffect, useMemo, useState } from "react";

const EASE_TAB = "cubic-bezier(0.23, 1, 0.32, 1)";

const TABS = [
  { id: "listening", label: "Listening" },
  { id: "watching", label: "Watching" },
  { id: "reading", label: "Reading" },
  { id: "life", label: "Life" },
];

/** Pulls typography + semantic colors from site theme so Now matches Work / Manifesto. */
function nowTokens(theme) {
  return {
    ink: theme.ink,
    dim: theme.dim,
    accent: theme.accent,
    border: theme.border,
    bg: theme.bg,
    surface: theme.surface,
    body: theme.body,
    display: theme.display,
    mono: theme.mono,
    /** Rhythm labels: still distinct from body but on-brand (emerald-tinted ink). */
    lifeLabel: `color-mix(in srgb, ${theme.accent} 38%, ${theme.ink})`,
    /** Empty shelf tiles — neutral, derived from page tokens. */
    shelfEmptyBg: `color-mix(in srgb, ${theme.ink} 14%, ${theme.bg})`,
  };
}

function TabIcons({ tab, active, color }) {
  const stroke = active ? "#fff" : color;
  const lc = "round";

  /** Vinyl-ish icon for Listening — reads at small sizes vs abstract waveform. */
  if (tab === "listening") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden style={{ flexShrink: 0 }}>
        <circle cx="7" cy="7" r="5.8" stroke={stroke} strokeWidth="1.15" fill="none" strokeLinecap={lc} />
        <circle cx="7" cy="7" r="2.35" stroke={stroke} strokeWidth="1" fill="none" opacity={active ? 0.95 : 0.72} />
        <circle cx="7" cy="7" r="1" fill={stroke} opacity={active ? 0.92 : 0.55} />
      </svg>
    );
  }

  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden style={{ flexShrink: 0 }}>
      {tab === "watching" && (
        <>
          <rect stroke={stroke} strokeWidth="1.3" fill="none" x="2.5" y="4" width="9" height="6.8" rx="1" strokeLinecap={lc} />
          <path stroke={stroke} strokeWidth="1.2" strokeLinecap={lc} d="M4.5 6.5 L6 7.75 8.75 6" opacity={active ? 0.9 : 0.55} />
        </>
      )}
      {tab === "reading" && (
        <>
          <path stroke={stroke} strokeWidth="1.25" fill="none" strokeLinecap={lc} strokeLinejoin="round" d="M3 3h4v9.5H3z" />
          <path stroke={stroke} strokeWidth="1.25" fill="none" strokeLinecap={lc} strokeLinejoin="round" d="M7.5 4.75h5.5v9H7.5z" opacity={active ? 1 : 0.85} />
        </>
      )}
      {tab === "life" && (
        <path stroke={stroke} strokeWidth="1.25" fill="none" strokeLinecap={lc} strokeLinejoin="round" d="M3.75 11.75h10.75V9.85c0-4.4-10.85-8.95-11.95-10.08l1.08 13.73z M8.62 10.92h2.94" opacity={active ? 0.95 : 0.78} />
      )}
    </svg>
  );
}

function TvTrailingIcon({ muted }) {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" aria-hidden style={{ opacity: muted ? 0.38 : 0.82, flexShrink: 0 }}>
      <rect x="2.5" y="4" width="9" height="6.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" d="M4 6l2 1 3-2" opacity={muted ? 0.5 : 1} />
    </svg>
  );
}

/** Motion: quick ease-out transitions; hover only when fine pointer (Emil / a11y). */
export function NowOffTheClock({ portfolio, theme }) {
  const S = portfolio.nowStudio;
  const [tab, setTab] = useState("listening");
  const [hoverIx, setHoverIx] = useState(null);

  const t = useMemo(() => nowTokens(theme), [theme]);

  useEffect(() => setHoverIx(null), [tab]);

  if (!S) return null;

  const listeningTracks = S.listening?.tracks || [];
  const listenCountLabel = `${listeningTracks.length} TRACK${listeningTracks.length === 1 ? "" : "S"}`;
  const watchRows = S.watching?.rows || [];
  const watchCountLabel = `${watchRows.length} ${S.watching?.countSuffix ?? "PICKS"}`;
  const shelf = S.shelf;
  const shelfBooks = shelf?.books ?? [];
  const shelfExtra = shelf?.emptyTrailingCells ?? 0;

  return (
    <div
      className="now-root"
      style={{
        /* Let PageScaffold grain + theme.bg read through one continuous surface. */
        background: "transparent",
        color: t.ink,
        minHeight: "calc(100vh - clamp(88px, 14vw, 104px))",
        padding: "clamp(48px, 8vw, 96px) clamp(20px, 5vw, 56px) 96px",
        backgroundImage: `radial-gradient(circle at 18% 0%, rgba(15,15,15,0.03) 0%, transparent 45%), radial-gradient(circle at 82% 100%, color-mix(in srgb, ${t.accent} 6%, transparent) 0%, transparent 42%)`,
      }}
    >
      <style>{`
        .now-root .now-tab-btn {
          transition: background-color 180ms ${EASE_TAB}, color 180ms ${EASE_TAB};
        }
        .now-root .now-tab-btn:active {
          transform: scale(0.98);
        }
        @media (hover: hover) and (pointer: fine) {
          .now-root .now-listen-row:hover { background-color: color-mix(in srgb, ${t.accent} 9%, transparent); }
          .now-root .now-watch-row:hover { background-color: color-mix(in srgb, ${t.accent} 9%, transparent); }
          .now-root .now-life-row:hover { background-color: color-mix(in srgb, ${t.accent} 5%, transparent); }
          .now-root .now-shelf-cell:not(.now-shelf-empty):hover {
            background-color: color-mix(in srgb, ${t.accent} 7%, transparent);
          }
        }
        .now-root .now-listen-row,
        .now-root .now-watch-row,
        .now-root .now-life-row,
        .now-root .now-shelf-cell {
          transition: background-color 200ms ${EASE_TAB};
        }
        @media (max-width: 720px) {
          .now-root .now-shelf-grid { grid-template-columns: 1fr !important; }
          .now-root .now-watch-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .now-root .now-watch-inner { min-width: 560px; }
          .now-root .now-listen-scroll { overflow-x: auto; }
          .now-root .now-listen-inner { min-width: 620px; }
        }
      `}</style>

      <div style={{ maxWidth: 1024, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: t.display,
            fontSize: "clamp(2.35rem, 6vw, 3.85rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.06,
            margin: 0,
          }}
        >
          {S.headline}
          <span style={{ color: t.accent }}>{S.headlineAccent || "."}</span>
        </h1>
        <p
          style={{
            margin: "22px 0 0",
            maxWidth: 580,
            fontFamily: t.body,
            fontSize: 17,
            lineHeight: 1.55,
            color: t.dim,
          }}
        >
          {S.dek}
        </p>

        <div style={{ marginTop: 48 }}>
          <div
            role="tablist"
            aria-label="Now categories"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0,
              border: `1px solid ${t.border}`,
              borderRadius: 2,
              overflow: "hidden",
              background: t.surface,
            }}
          >
            {TABS.map((tb, ti) => {
              const active = tab === tb.id;
              const isLast = ti === TABS.length - 1;
              return (
                <button
                  key={tb.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className="now-tab-btn"
                  onClick={() => setTab(tb.id)}
                  style={{
                    flex: "1 1 120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "14px 16px",
                    border: "none",
                    borderRight: isLast ? "none" : `1px solid ${t.border}`,
                    cursor: "pointer",
                    background: active ? t.accent : "transparent",
                    color: active ? "#fff" : t.dim,
                    fontFamily: t.body,
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  <TabIcons tab={tb.id} active={active} color={t.dim} />
                  <span>{tb.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div role="tabpanel" style={{ marginTop: 32 }}>
          {tab === "listening" && (
            <ListeningPanel
              t={t}
              sectionLabel={S.listening.sectionLabel}
              countLabel={listenCountLabel}
              tracks={listeningTracks}
              hoverIx={hoverIx}
              setHoverIx={setHoverIx}
            />
          )}
          {tab === "watching" && (
            <WatchingPanel
              t={t}
              sectionLabel={S.watching.sectionLabel}
              countLabel={watchCountLabel}
              rows={watchRows}
              hoverIx={hoverIx}
              setHoverIx={setHoverIx}
            />
          )}
          {tab === "reading" && shelf && (
            <ShelfPanel
              theme={theme}
              t={t}
              sectionLabel={shelf.sectionLabel}
              countLabel={`${shelfBooks.length} BOOK${shelfBooks.length === 1 ? "" : "S"}`}
              books={shelfBooks}
              emptyTrailing={shelfExtra}
            />
          )}
          {tab === "life" && S.life?.rows && (
            <LifePanel t={t} rows={S.life.rows} hoverIx={hoverIx} setHoverIx={setHoverIx} />
          )}
        </div>
      </div>
    </div>
  );
}

function SectionRule({ left, right, t }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        paddingBottom: 14,
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <span
        style={{
          fontFamily: t.body,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: t.ink,
        }}
      >
        {left}
      </span>
      <span
        style={{
          fontFamily: t.body,
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: t.dim,
        }}
      >
        {right}
      </span>
    </div>
  );
}

function ListeningPanel({ t, sectionLabel, countLabel, tracks, hoverIx, setHoverIx }) {
  return (
    <>
      <SectionRule left={sectionLabel} right={countLabel} t={t} />
      <div className="now-listen-scroll">
        <div className="now-listen-inner">
          {tracks.map((track, i) => {
            const num = String(i + 1).padStart(2, "0");
            const hovered = hoverIx === i;
            return (
              <div
                key={`${track.title}-${i}`}
                className="now-listen-row"
                onMouseEnter={() => setHoverIx(i)}
                onMouseLeave={() => setHoverIx(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px minmax(0, 1fr) minmax(0, 140px) minmax(0, 100px) 28px",
                  gap: "clamp(12px, 2vw, 20px)",
                  alignItems: "center",
                  padding: "18px 0",
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
                <span style={{ fontFamily: t.mono, fontSize: 12, color: t.dim }}>{num}</span>
                <div>
                  <div
                    style={{
                      fontFamily: t.display,
                      fontWeight: 400,
                      fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                      lineHeight: 1.25,
                    }}
                  >
                    {track.title}
                  </div>
                  <div style={{ fontFamily: t.body, fontSize: 13.5, color: t.dim, marginTop: 4 }}>
                    {track.artist}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: t.body,
                    fontSize: 10.5,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: t.dim,
                  }}
                >
                  {track.album}
                </div>
                <span
                  style={{
                    fontFamily: t.body,
                    fontSize: 10.5,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: t.dim,
                    textAlign: "right",
                  }}
                >
                  {track.tag}
                </span>
                <a
                  href={track.playUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Play ${track.title}`}
                  onClick={(e) => {
                    if (!track.playUrl) e.preventDefault();
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    color: hovered ? t.accent : t.dim,
                    transition: "color 160ms ease-out",
                  }}
                >
                  <PlayTriangle />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function WatchingPanel({ t, sectionLabel, countLabel, rows, hoverIx, setHoverIx }) {
  return (
    <>
      <SectionRule left={sectionLabel} right={countLabel} t={t} />
      <div className="now-watch-scroll">
        <div className="now-watch-inner">
          {rows.map((row, i) => {
            const num = String(i + 1).padStart(2, "0");
            const hovered = hoverIx === i;
            return (
              <div
                key={`${row.title}-${i}`}
                className="now-watch-row"
                onMouseEnter={() => setHoverIx(i)}
                onMouseLeave={() => setHoverIx(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px minmax(140px, 1fr) minmax(160px, 1.35fr) 28px",
                  gap: "clamp(12px, 2vw, 24px)",
                  alignItems: "center",
                  padding: "22px 0",
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
                <span style={{ fontFamily: t.mono, fontSize: 12, color: t.dim }}>{num}</span>
                <div>
                  <div
                    style={{
                      fontFamily: t.display,
                      fontWeight: 400,
                      fontSize: "clamp(1.06rem, 2.1vw, 1.25rem)",
                      lineHeight: 1.2,
                    }}
                  >
                    {row.title}
                  </div>
                  <div
                    style={{
                      fontFamily: t.body,
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: t.dim,
                      marginTop: 6,
                    }}
                  >
                    {row.category}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: t.display,
                    fontSize: "clamp(14px, 1.85vw, 16px)",
                    fontStyle: "italic",
                    lineHeight: 1.55,
                    color: t.ink,
                    opacity: 0.9,
                  }}
                >
                  &ldquo;{row.quote}&rdquo;
                </div>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    color: hovered ? t.accent : t.ink,
                    transition: "color 160ms ease-out",
                  }}
                >
                  <TvTrailingIcon muted={!hovered} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function statusBadgeStyle(status, theme) {
  const { ink, accent } = theme;
  switch (status) {
    case "re-reading":
      return { background: ink, color: "#fff", border: `1px solid ${ink}` };
    case "reading":
      return { background: accent, color: "#fff", border: `1px solid ${accent}` };
    case "dipping-in":
    case "done":
    default:
      return { background: "transparent", color: ink, border: `1px solid ${ink}` };
  }
}

function shelfStatusLabel(status) {
  switch (status) {
    case "re-reading":
      return "RE-READING";
    case "reading":
      return "READING";
    case "dipping-in":
      return "DIPPING IN";
    case "done":
      return "DONE";
    default:
      return "";
  }
}

function ShelfPanel({ theme, t, sectionLabel, countLabel, books, emptyTrailing }) {
  const slots = [...books.map((b, i) => ({ kind: "book", book: b, i }))];
  for (let k = 0; k < emptyTrailing; k += 1) {
    slots.push({ kind: "empty", key: `e-${k}` });
  }

  return (
    <>
      <SectionRule left={sectionLabel} right={countLabel} t={t} />
      <div
        className="now-shelf-grid"
        role="region"
        aria-label={`${sectionLabel}: ${books.length} books`}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          borderTop: `1px solid ${t.border}`,
          borderLeft: `1px solid ${t.border}`,
          marginTop: 4,
        }}
      >
        {slots.map((slot) => {
          if (slot.kind === "empty") {
            return (
              <div
                key={slot.key}
                className="now-shelf-cell now-shelf-empty"
                aria-hidden
                style={{
                  minHeight: 200,
                  background: t.shelfEmptyBg,
                  borderRight: `1px solid ${t.border}`,
                  borderBottom: `1px solid ${t.border}`,
                }}
              />
            );
          }
          const book = slot.book;
          const i = slot.i;
          const badge = statusBadgeStyle(book.status, theme);

          return (
            <article
              key={`${book.title}-${i}`}
              className="now-shelf-cell"
              style={{
                position: "relative",
                minHeight: 200,
                padding: "22px 20px 20px",
                borderRight: `1px solid ${t.border}`,
                borderBottom: `1px solid ${t.border}`,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 0,
                background: t.surface,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: t.body,
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "4px 7px",
                    ...badge,
                  }}
                >
                  {shelfStatusLabel(book.status)}
                </span>
                <span style={{ fontFamily: t.body, fontSize: 11, color: t.dim }}>
                  № {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: t.display,
                  fontWeight: 400,
                  fontSize: "clamp(1.05rem, 2vw, 1.22rem)",
                  lineHeight: 1.28,
                  margin: "14px 0 0",
                  letterSpacing: "-0.015em",
                }}
              >
                {book.title}
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  fontFamily: t.body,
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: t.dim,
                }}
              >
                {book.author}
              </p>
              <div
                style={{
                  marginTop: 14,
                  width: "82%",
                  height: 1,
                  background: t.border,
                }}
              />
              <p
                style={{
                  margin: "auto 0 0",
                  paddingTop: 14,
                  fontFamily: t.display,
                  fontSize: "clamp(12.5px, 1.65vw, 14.5px)",
                  fontStyle: "italic",
                  lineHeight: 1.52,
                  color: t.ink,
                }}
              >
                &ldquo;{book.quote}&rdquo;
              </p>
            </article>
          );
        })}
      </div>
    </>
  );
}

function LifePanel({ t, rows, hoverIx, setHoverIx }) {
  return (
    <div style={{ paddingTop: 8 }}>
      {rows.map((row, i) => {
        const hovered = hoverIx === i;
        return (
          <div
            key={`${row.rhythm}-${i}`}
            className="now-life-row"
            onMouseEnter={() => setHoverIx(i)}
            onMouseLeave={() => setHoverIx(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(110px, 26%) minmax(0, 1fr)",
              gap: "clamp(16px, 4vw, 40px)",
              alignItems: "start",
              padding: "26px 0",
              borderBottom: i === rows.length - 1 ? "none" : `1px solid ${t.border}`,
            }}
          >
            <span
              style={{
                fontFamily: t.body,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: t.lifeLabel,
                fontWeight: 600,
                paddingTop: 3,
                opacity: hovered ? 1 : 0.9,
                transition: "opacity 160ms ease-out",
              }}
            >
              {row.rhythm}
            </span>
            <p
              style={{
                fontFamily: t.display,
                fontWeight: 400,
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                lineHeight: 1.52,
                margin: 0,
                color: t.ink,
              }}
            >
              {row.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function PlayTriangle() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden style={{ opacity: 1 }}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
        d="M1.5 1.5 L10 7 L1.5 12.5 Z"
      />
    </svg>
  );
}
