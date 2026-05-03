"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAV } from "@/lib/site-nav";
import { CommandMenu, SoundCtx } from "./shared";

const PILL_NAV = SITE_NAV.filter((n) => n.href !== "/");

export function SiteChrome({ theme, P, onAskClick, floatingAskHidden, children }) {
  const pathname = usePathname() || "/";
  const [cmdOpen, setCmdOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const { on: soundOn, setOn: setSoundOn, play } = useContext(SoundCtx);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cmdItems = useMemo(
    () => [
      { id: "go-home", label: "Home", hint: "/", icon: "○", href: "/" },
      { id: "go-work", label: "Work", hint: "section", icon: "◢", href: "/work" },
      { id: "go-timeline", label: "Timeline", hint: "section", icon: "◷", href: "/timeline" },
      { id: "go-manifesto", label: "Manifesto", hint: "section", icon: "§", href: "/manifesto" },
      { id: "go-now", label: "Now", hint: "section", icon: "●", href: "/now" },
      { id: "go-contact", label: "Jump to Contact (home)", hint: "section", icon: "✉", href: "/#contact" },
      ...P.projects.map((p) => ({
        id: `proj-${p.id}`,
        label: p.title,
        hint: p.company,
        icon: "◆",
        keywords: [p.company, ...(p.stack || [])],
        href: `/work#${p.id}`,
      })),
    ],
    [P],
  );

  const runCmd = (it) => {
    play("click");
    if (it.href) window.location.href = it.href;
  };

  const glassStroke = "rgba(15, 15, 15, 0.09)";
  const glassFill = theme.surface === "#ffffff" ? "rgba(255,255,255,0.76)" : theme.surface;

  return (
    <>
      <style>{`
        @keyframes siteNavIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .site-nav-pill-shell {
          animation: siteNavIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.06s backwards;
        }
        .site-nav-pill-link {
          transition: background-color 180ms cubic-bezier(0.23, 1, 0.32, 1),
            color 180ms cubic-bezier(0.23, 1, 0.32, 1),
            transform 140ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .site-nav-pill-link:active {
          transform: scale(0.96);
        }
        @media (hover: hover) and (pointer: fine) {
          .site-nav-pill-link[data-active="false"]:hover {
            background: ${theme.hover};
            color: ${theme.ink};
          }
        }
        .site-tool-btn {
          transition: transform 140ms cubic-bezier(0.23, 1, 0.32, 1),
            border-color 180ms cubic-bezier(0.23, 1, 0.32, 1),
            background-color 180ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .site-tool-btn:active {
          transform: scale(0.94);
        }
        @media (prefers-reduced-motion: reduce) {
          .site-nav-pill-shell { animation: none; }
          .site-nav-pill-link, .site-tool-btn { transition: none; }
          .site-nav-pill-link:active, .site-tool-btn:active { transform: none; }
        }
        @media (max-width: 760px) {
          .site-chrome-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            justify-items: stretch !important;
          }
          .site-chrome-pill-shell { width: 100%; max-width: 420px; margin: 0 auto; }
          .site-chrome-pill-shell > div { justify-content: center !important; width: 100%; box-sizing: border-box; }
          .site-chrome-actions { justify-content: flex-end !important; width: 100%; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          width: `${scrollPct}%`,
          background: theme.ink,
          zIndex: 110,
          transition: "width 0.08s linear",
        }}
      />

      <nav
        aria-label="Primary"
        className="site-chrome-grid"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          padding: "clamp(12px, 2.2vw, 18px) clamp(14px, 3vw, 28px)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
          alignItems: "center",
          gap: 12,
          fontFamily: theme.body,
          pointerEvents: "none",
        }}
      >
        <div className="site-chrome-brand" style={{ justifySelf: "start", pointerEvents: "auto" }}>
          <Link
            href="/"
            data-cursor="link"
            data-cursor-label="home"
            className="site-tool-btn"
            style={{
              fontFamily: theme.display,
              fontSize: "clamp(19px, 2.2vw, 23px)",
              letterSpacing: "-0.03em",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: theme.ink,
              textDecoration: "none",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                background: theme.accent,
                display: "inline-block",
                boxShadow: `0 0 10px ${theme.accent}`,
              }}
            />
            Ayush<span style={{ color: theme.dim }}>.</span>
          </Link>
        </div>

        <div className="site-chrome-pill-shell site-nav-pill-shell" style={{ justifySelf: "center", pointerEvents: "auto", maxWidth: "100%" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
              padding: "5px 6px",
              borderRadius: 9999,
              border: `1px solid ${glassStroke}`,
              background: glassFill,
              backdropFilter: "blur(16px) saturate(1.4)",
              WebkitBackdropFilter: "blur(16px) saturate(1.4)",
              boxShadow:
                "0 14px 44px rgba(15, 15, 15, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.55)",
            }}
          >
            {PILL_NAV.map((l) => {
              const on = l.match(pathname);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  data-cursor="link"
                  data-cursor-label={l.label}
                  data-active={on ? "true" : "false"}
                  className="site-nav-pill-link mono"
                  style={{
                    padding: "9px 16px",
                    borderRadius: 9999,
                    fontSize: 11,
                    letterSpacing: "0.11em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    fontFamily: theme.mono,
                    fontWeight: on ? 600 : 500,
                    background: on ? theme.ink : "transparent",
                    color: on ? theme.bg : theme.dim,
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div
          className="site-chrome-actions"
          style={{
            justifySelf: "end",
            pointerEvents: "auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            className="site-tool-btn"
            data-cursor="link"
            data-cursor-label={soundOn ? "mute" : "unmute"}
            onClick={() => setSoundOn((o) => !o)}
            style={{
              border: `1px solid ${theme.border}`,
              background: glassFill,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: theme.ink,
              width: 36,
              height: 36,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {soundOn ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M2 4.5h1.5L6 2v8L3.5 7.5H2v-3z"/><path d="M8 4.5c.6.5.6 2.5 0 3"/><path d="M9.5 3c1.3 1 1.3 5 0 6" opacity=".6"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M2 4.5h1.5L6 2v8L3.5 7.5H2v-3z"/><path d="M8 4l3 3M11 4l-3 3"/>
              </svg>
            )}
          </button>
          <button
            type="button"
            className="site-tool-btn mono"
            data-cursor="link"
            data-cursor-label="search"
            onClick={() => setCmdOpen(true)}
            style={{
              border: `1px solid ${theme.border}`,
              background: glassFill,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: theme.dim,
              padding: "7px 13px",
              borderRadius: 9999,
              fontSize: 11,
              letterSpacing: "0.06em",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: theme.mono,
              cursor: "pointer",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="5" cy="5" r="3.5"/><path d="M8 8l2.5 2.5" strokeLinecap="round"/>
            </svg>
            <span className="site-nav-search-txt" style={{ textTransform: "uppercase" }}>Search</span>
            <kbd style={{ background: theme.hover, padding: "2px 6px", borderRadius: 4, fontSize: 10 }}>⌘K</kbd>
          </button>
          <button
            type="button"
            className="site-tool-btn btn-primary"
            data-cursor="link"
            data-cursor-label="ask"
            onClick={() => onAskClick?.()}
            style={{
              padding: "9px 16px",
              fontSize: 12,
              borderRadius: 9999,
              boxShadow: "0 8px 24px rgba(15, 15, 15, 0.12)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: "#10b981",
                boxShadow: "0 0 6px #10b981",
                animation: "blink 2s ease infinite",
              }}
            />
            Ask Ayush
          </button>
        </div>
      </nav>
      <style>{`
        @media (max-width: 540px) {
          .site-nav-search-txt { display: none; }
        }
      `}</style>

      {children}

      <FloatingAskBubble theme={theme} hidden={floatingAskHidden} onClick={() => onAskClick?.()} />

      <CommandMenu theme={theme} open={cmdOpen} setOpen={setCmdOpen} items={cmdItems} onRun={runCmd} />
    </>
  );
}

function FloatingAskBubble({ theme, onClick, hidden }) {
  if (hidden) return null;
  return (
    <button
      type="button"
      data-cursor="link"
      data-cursor-label="ask Ayush"
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 200,
        background: theme.ink,
        color: theme.bg,
        border: 0,
        padding: "12px 18px",
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 13,
        fontFamily: theme.body,
        fontWeight: 500,
        boxShadow: "0 14px 36px rgba(0,0,0,.22)",
        animation: "chatIn .5s cubic-bezier(.2,.8,.2,1) .8s backwards",
        cursor: "pointer",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10b981", boxShadow: "0 0 10px #10b981", animation: "blink 2s ease infinite" }} />
      Ask Ayush
    </button>
  );
}
