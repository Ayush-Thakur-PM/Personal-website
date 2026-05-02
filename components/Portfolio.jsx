"use client";

import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { createPortal } from "react-dom";
import {
  SoundCtx,
  CommandMenu,
  AskAyush,
  BlurIn,
  Reveal,
  AnimatedNumber,
  useDragReorder,
} from "./shared";

// Portfolio composition. Single B&W view.
export default function Portfolio({ theme, P }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const [projectOrder, setProjectOrder] = useState(P.projects.map((p) => p.id));
  const [expanded, setExpanded] = useState(null);
  const [tlOpen, setTlOpen] = useState(null); // timeline role index
  const [scrollPct, setScrollPct] = useState(0);
  const { on: soundOn, setOn: setSoundOn, play } = useContext(SoundCtx);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 40, behavior: "smooth" });
  };

  // active section + scroll progress
  useEffect(() => {
    const ids = ["hero", "work", "timeline", "manifesto", "now", "reading", "contact"];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.3 });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { obs.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  // ⌘K menu items
  const cmdItems = useMemo(() => [
    { id: "go-work", label: "Jump to Work", hint: "section", icon: "◢", action: () => scrollTo("work") },
    { id: "go-timeline", label: "Jump to Timeline", hint: "section", icon: "◷", action: () => scrollTo("timeline") },
    { id: "go-manifesto", label: "Jump to Manifesto", hint: "section", icon: "§", action: () => scrollTo("manifesto") },
    { id: "go-now", label: "Jump to Now", hint: "section", icon: "●", action: () => scrollTo("now") },
    { id: "go-reading", label: "Jump to Reading", hint: "section", icon: "≡", action: () => scrollTo("reading") },
    { id: "go-contact", label: "Jump to Contact", hint: "section", icon: "✉", action: () => scrollTo("contact") },
    { id: "ask", label: "Ask Ayush anything", hint: "AI", icon: "✦", action: () => setAskOpen(true) },
    { id: "email", label: "Email Ayush", hint: P.email, icon: "@", action: () => { window.location.href = `mailto:${P.email}`; } },
    { id: "copy-email", label: "Copy email", hint: P.email, icon: "⎘", action: () => { navigator.clipboard.writeText(P.email); play("success"); } },
    { id: "sound", label: "Toggle sound", hint: soundOn ? "on" : "off", icon: "♪", action: () => setSoundOn((o) => !o) },
    ...P.projects.map((p) => ({
      id: `proj-${p.id}`, label: p.title, hint: p.company, icon: "◆",
      keywords: [p.company, ...(p.stack || [])],
      action: () => { scrollTo("work"); setTimeout(() => setExpanded(p.id), 500); },
    })),
  ], [soundOn, setSoundOn, P, play]);

  const runCmd = (it) => { it.action?.(); };

  const cardRects = useRef({});
  const expandedProject = expanded ? P.projects.find((p) => p.id === expanded) : null;

  return (
    <div style={{ background: theme.bg, color: theme.ink, fontFamily: theme.body, minHeight: "100vh", position: "relative" }}>
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
        /* One continuous shelf: scroll horizontally when the row exceeds the viewport. */
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
        /* Timeline under the shelf — segment widths match book-count ratios. */
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
        /* Mini-book: spine + page block + top edge so reads as a volume, not a bar. */
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

      <div className="grain" />

      {/* scroll progress bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, height: 2, width: `${scrollPct}%`,
        background: theme.ink, zIndex: 110, transition: "width .1s linear",
      }} />

      {/* section index — left rail */}
      <SectionRail theme={theme} active={active} scrollTo={scrollTo} />

      <TopNav theme={theme} P={P} active={active} scrollTo={scrollTo}
        onCmd={() => setCmdOpen(true)} onAsk={() => setAskOpen(true)}
        soundOn={soundOn} toggleSound={() => setSoundOn((o) => !o)} />

      <main>
        <Hero theme={theme} P={P} play={play} onExplore={() => scrollTo("work")} onAsk={() => setAskOpen(true)} />
        <Work theme={theme} projects={P.projects} order={projectOrder} setOrder={setProjectOrder}
          setExpanded={setExpanded} cardRects={cardRects} />
        <Timeline theme={theme} P={P} onOpenRole={(i) => { setTlOpen(i); play("open"); }} />
        <Manifesto theme={theme} P={P} />
        <Now theme={theme} P={P} />
        <Reading theme={theme} P={P} />
        <Contact theme={theme} P={P} onAsk={() => setAskOpen(true)} />
        <Footer theme={theme} P={P} />
      </main>

      {expandedProject && (
        <ProjectOverlay theme={theme} project={expandedProject}
          origin={cardRects.current[expandedProject.id]}
          onClose={() => { setExpanded(null); play("close"); }} />
      )}

      {tlOpen != null && (
        <RoleOverlay theme={theme} role={P.timeline[tlOpen]} onClose={() => { setTlOpen(null); play("close"); }} />
      )}

      <FloatingAsk theme={theme} onClick={() => setAskOpen(true)} hidden={askOpen} />

      <CommandMenu theme={theme} open={cmdOpen} setOpen={setCmdOpen} items={cmdItems} onRun={runCmd} />
      <AskAyush theme={theme} open={askOpen} setOpen={setAskOpen} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section rail — left-side dot index that pulses on the active section
// ─────────────────────────────────────────────────────────────
function SectionRail({ theme, active, scrollTo }) {
  const sections = [
    { id: "hero", n: "00" },
    { id: "work", n: "01" },
    { id: "timeline", n: "02" },
    { id: "manifesto", n: "03" },
    { id: "now", n: "04" },
    { id: "reading", n: "05" },
    { id: "contact", n: "06" },
  ];
  return (
    <div style={{
      position: "fixed", left: 24, top: "50%", transform: "translateY(-50%)",
      zIndex: 50, display: "flex", flexDirection: "column", gap: 14,
    }}>
      {sections.map((s) => {
        const on = active === s.id;
        return (
          <button key={s.id} data-cursor="link" data-cursor-label={s.n} onClick={() => scrollTo(s.id)}
            style={{
              border: 0, background: "transparent", padding: 4,
              display: "flex", alignItems: "center", gap: 10,
            }}>
            <span style={{
              width: on ? 18 : 8, height: 1, background: theme.ink, opacity: on ? 1 : 0.3,
              transition: "width .35s cubic-bezier(.2,.8,.2,1), opacity .25s",
            }}/>
            <span className="mono" style={{
              fontSize: 10, color: on ? theme.ink : theme.dim,
              opacity: on ? 1 : 0.5, transition: "opacity .25s, color .25s",
            }}>{s.n}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Nav
// ─────────────────────────────────────────────────────────────
function TopNav({ theme, P, active, scrollTo, onCmd, onAsk, soundOn, toggleSound }) {
  const links = [
    { id: "work", label: "Work" },
    { id: "timeline", label: "Timeline" },
    { id: "manifesto", label: "Manifesto" },
    { id: "now", label: "Now" },
    { id: "reading", label: "Reading" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 90,
      padding: "16px 32px", display: "flex", alignItems: "center", gap: 24,
      fontFamily: theme.body,
      background: `linear-gradient(180deg, ${theme.bg}f0, ${theme.bg}80 70%, transparent)`,
      backdropFilter: "blur(8px)",
    }}>
      <div data-cursor="link" data-cursor-label="home" onClick={() => scrollTo("hero")} style={{
        fontFamily: theme.display, fontSize: 22, letterSpacing: -0.3,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: theme.accent, display: "inline-block",
          boxShadow: `0 0 8px ${theme.accent}` }} />
        Ayush<span style={{ color: theme.dim }}>.</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {links.map((l) => (
          <button key={l.id} data-cursor="link" onClick={() => scrollTo(l.id)} style={{
            border: 0, background: "transparent", color: active === l.id ? theme.ink : theme.dim,
            padding: "8px 12px", borderRadius: 6, fontSize: 13,
            fontFamily: "inherit", transition: "color .2s",
            fontWeight: active === l.id ? 500 : 400,
          }}>{l.label}</button>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <button data-cursor="link" data-cursor-label={soundOn ? "mute" : "unmute"}
        onClick={toggleSound} style={{
        border: `1px solid ${theme.border}`, background: "transparent", color: theme.ink,
        width: 34, height: 34, borderRadius: 17,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
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
      <button data-cursor="link" data-cursor-label="search" onClick={onCmd} className="mono" style={{
        border: `1px solid ${theme.border}`, background: "transparent", color: theme.dim,
        padding: "6px 12px", borderRadius: 17, fontSize: 12,
        display: "flex", alignItems: "center", gap: 8, fontFamily: theme.mono,
      }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="5" cy="5" r="3.5"/><path d="M8 8l2.5 2.5" strokeLinecap="round"/>
        </svg>
        Search <kbd style={{ background: theme.hover, padding: "1px 5px", borderRadius: 3, fontSize: 10 }}>⌘K</kbd>
      </button>
      <button data-cursor="link" data-cursor-label="ask" onClick={onAsk} className="btn-primary" style={{ padding: "8px 14px", fontSize: 12 }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: "#10b981", boxShadow: "0 0 6px #10b981", animation: "blink 2s ease infinite" }}/>
        Ask Ayush
      </button>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero — interactive word arrange
// ─────────────────────────────────────────────────────────────
function Hero({ theme, P, play, onExplore, onAsk }) {
  const [settled, setSettled] = useState(false);
  const seeds = useMemo(() => [
    { word: "0→1", x: 14, y: 22, rot: -6 },
    { word: "AI-native", x: 78, y: 14, rot: 4 },
    { word: "empathy", x: 8, y: 70, rot: 3 },
    { word: "fast", x: 86, y: 74, rot: -5 },
    { word: "shipped", x: 50, y: 86, rot: 2 },
    { word: "first principles", x: 60, y: 22, rot: -3 },
    { word: "founding PM", x: 28, y: 42, rot: 5 },
    { word: "GTM-led", x: 72, y: 50, rot: -4 },
    { word: "discovery", x: 18, y: 30, rot: 6 },
    { word: "retention", x: 88, y: 38, rot: 2 },
  ], []);
  const [positions, setPositions] = useState(seeds);
  const wrapRef = useRef(null);

  const grab = (i) => (e) => {
    e.preventDefault();
    play("drag");
    const r = wrapRef.current.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const base = positions[i];
    const move = (ev) => {
      const dx = ((ev.clientX - sx) / r.width) * 100;
      const dy = ((ev.clientY - sy) / r.height) * 100;
      setPositions((p) => p.map((w, j) => j === i ? { ...w, x: base.x + dx, y: base.y + dy } : w));
    };
    const up = () => {
      play("drop");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  };

  const arrange = () => {
    play("success");
    const band = seeds.map((s, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      return { ...s, x: 10 + col * 18, y: 84 + row * 5, rot: 0 };
    });
    setPositions(band);
    setSettled(true);
  };

  const scramble = () => {
    play("close");
    setPositions(seeds);
    setSettled(false);
  };

  return (
    <section id="hero" style={{ position: "relative", minHeight: "100vh", padding: "120px 32px 80px",
      display: "flex", flexDirection: "column", justifyContent: "center",
    }}>
      <div ref={wrapRef} style={{ position: "relative", maxWidth: 1200, margin: "0 auto", width: "100%", minHeight: 540 }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {positions.map((w, i) => (
            <div key={i} data-cursor="drag" data-cursor-label="grab" onPointerDown={grab(i)} style={{
              position: "absolute", left: `${w.x}%`, top: `${w.y}%`,
              transform: `translate(-50%,-50%) rotate(${w.rot}deg)`,
              transition: "left .8s cubic-bezier(.2,.8,.2,1), top .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1), background .2s",
              pointerEvents: "auto", userSelect: "none",
              padding: "6px 12px", borderRadius: 999,
              background: settled ? theme.hover : "transparent",
              border: `1px solid ${settled ? "transparent" : theme.border}`,
              color: theme.dim, fontSize: 12, fontFamily: theme.mono,
              whiteSpace: "nowrap",
            }}>{w.word}</div>
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>
          <Reveal delay={0.1}>
            <div className="mono" style={{ fontSize: 12, color: theme.dim, letterSpacing: 0.08, textTransform: "uppercase", marginBottom: 16 }}>
              {P.specialty} — {P.location}
            </div>
          </Reveal>
          <BlurIn tag="h1" className="display" style={{
            fontSize: "clamp(56px, 11vw, 168px)", margin: 0, lineHeight: 0.95,
          }}>{P.name}</BlurIn>
          <div style={{ marginTop: 14, maxWidth: 680 }}>
            <BlurIn delay={0.4} tag="p" style={{
              fontSize: "clamp(18px, 2vw, 26px)", lineHeight: 1.4, color: theme.ink, margin: 0,
              fontFamily: theme.body, fontWeight: 400, textWrap: "balance",
            }}>{P.tagline}</BlurIn>
          </div>
          <Reveal delay={0.8}>
            <div style={{ marginTop: 32, display: "flex", gap: 10, pointerEvents: "auto" }}>
              <button data-cursor="link" data-cursor-label="see work" onClick={onExplore} className="btn-primary">
                See the work
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 6h6M6 3l3 3-3 3"/></svg>
              </button>
              <button data-cursor="link" data-cursor-label={settled ? "scramble" : "arrange"}
                onClick={settled ? scramble : arrange} className="btn-ghost">
                {settled ? "Scramble" : "Arrange the chaos"}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  {settled ? <path d="M3 3l6 6M9 3l-6 6"/> : <path d="M2 6h8M2 3h8M2 9h5"/>}
                </svg>
              </button>
            </div>
          </Reveal>
          <Reveal delay={1.0}>
            <div className="mono" style={{ marginTop: 40, fontSize: 11, color: theme.dim, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span>try: drag the words →</span>
              <span style={{ opacity: .5 }}>•</span>
              <span>press ⌘K to search</span>
              <span style={{ opacity: .5 }}>•</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: "#10b981", boxShadow: "0 0 6px #10b981" }}/>
                open to founding PM roles
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
        fontSize: 10, color: theme.dim, fontFamily: theme.mono, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ width: 1, height: 28, background: theme.border }} />
        SCROLL
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Section header
// ─────────────────────────────────────────────────────────────
function SectionHeader({ theme, label, title, sub }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Reveal>
        <div className="mono" style={{ fontSize: 11, color: theme.dim, letterSpacing: 0.1, textTransform: "uppercase", marginBottom: 20 }}>
          {label}
        </div>
      </Reveal>
      <BlurIn tag="h2" className="display" style={{ fontSize: "clamp(36px, 5.5vw, 72px)", margin: 0, maxWidth: 980, textWrap: "balance" }}>
        {title}
      </BlurIn>
      {sub && (
        <Reveal delay={0.3}>
          <p style={{ marginTop: 16, color: theme.dim, fontSize: 16, maxWidth: 600 }}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Work
// ─────────────────────────────────────────────────────────────
function Work({ theme, projects, order, setOrder, setExpanded, cardRects }) {
  const { ref, onStart } = useDragReorder(order, setOrder);
  const ordered = order.map((id) => projects.find((p) => p.id === id)).filter(Boolean);

  return (
    <section id="work" style={{ padding: "120px 32px", borderTop: `1px solid ${theme.border}` }}>
      <SectionHeader theme={theme} label="01 / Work" title="Four projects that moved numbers that mattered."
        sub="Drag to reorder. Click any card to dive in." />
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 16, marginTop: 56 }}>
        {ordered.map((p, i) => (
          <ProjectCard key={p.id} theme={theme} p={p} i={i} onGrab={onStart(p.id)} onOpen={() => setExpanded(p.id)}
            setRect={(el) => { if (el) cardRects.current[p.id] = el.getBoundingClientRect(); }} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ theme, p, i, onGrab, onOpen, setRect }) {
  const ref = useRef(null);
  useEffect(() => { setRect(ref.current); }, []);
  return (
    <div ref={(el) => { ref.current = el; setRect(el); }} data-item={p.id}
      style={{ transition: "transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .25s, border-color .25s",
        borderRadius: 16, background: theme.surface,
        border: `1px solid ${theme.border}`, overflow: "hidden" }}>
      <Reveal delay={i * 0.06}>
        <div style={{ padding: 28, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
          <div onPointerDown={onGrab} data-cursor="drag" data-cursor-label="reorder" title="Drag to reorder"
            style={{ padding: "8px 4px", color: theme.dim, opacity: 0.5, transition: "opacity .2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}>
            <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
              {[0,1,2,3].map((r) => [0,1].map((c) => <circle key={`${r}${c}`} cx={1.5 + c*6} cy={1.5 + r*4} r="1"/>))}
            </svg>
          </div>
          <div data-cursor="link" data-cursor-label="open" onClick={onOpen}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 11, color: theme.dim }}>0{i+1}</span>
              <span className="mono" style={{ fontSize: 11, color: theme.dim }}>{p.company}</span>
              <span className="mono" style={{ fontSize: 11, color: theme.dim }}>·</span>
              <span className="mono" style={{ fontSize: 11, color: theme.dim }}>{p.year}</span>
            </div>
            <div className="display" style={{ fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 1.1, letterSpacing: -0.5 }}>
              <span className="link-u">{p.title}</span>
            </div>
            <p style={{ color: theme.dim, fontSize: 14, lineHeight: 1.55, marginTop: 10, marginBottom: 0, maxWidth: 680 }}>
              {p.summary}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end", minWidth: 120 }}>
            {p.impact.slice(0, 1).map((m, k) => (
              <div key={k} style={{ textAlign: "right" }}>
                <div className="display" style={{ fontSize: 44, lineHeight: 1, color: theme.ink }}>
                  <AnimatedNumber value={m.value} />
                </div>
                <div className="mono" style={{ fontSize: 10, color: theme.dim, letterSpacing: 0.04, textTransform: "uppercase", marginTop: 4 }}>
                  {m.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Project overlay (shared element)
// ─────────────────────────────────────────────────────────────
function ProjectOverlay({ theme, project, origin, onClose }) {
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    requestAnimationFrame(() => setPhase("open"));
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => { setPhase("exit"); setTimeout(onClose, 360); };

  const style = phase !== "open" && origin ? {
    top: origin.top, left: origin.left, width: origin.width, height: origin.height, borderRadius: 16,
  } : {
    top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0,
  };

  return createPortal(
    <div onClick={handleClose} style={{
      position: "fixed", inset: 0, zIndex: 3000,
      background: phase === "open" ? "rgba(0,0,0,.5)" : "rgba(0,0,0,0)",
      backdropFilter: phase === "open" ? "blur(10px)" : "blur(0)",
      transition: "background .35s ease, backdrop-filter .35s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "fixed", ...style,
        background: theme.surface, color: theme.ink,
        overflow: "hidden",
        transition: "all .42s cubic-bezier(.2,.8,.2,1)",
        boxShadow: phase === "open" ? "0 30px 80px rgba(0,0,0,.3)" : "none",
      }}>
        <div data-overlay-scroll style={{ height: "100%", overflow: "auto" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", padding: "56px 40px 80px",
            opacity: phase === "open" ? 1 : 0, transition: "opacity .4s ease .2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
              <div className="mono" style={{ fontSize: 11, color: theme.dim, display: "flex", gap: 14 }}>
                <span>{project.company}</span><span>·</span><span>{project.year}</span><span>·</span><span>{project.role}</span>
              </div>
              <button data-cursor="link" data-cursor-label="close" onClick={handleClose} style={{
                border: `1px solid ${theme.border}`, background: "transparent", color: theme.ink,
                width: 36, height: 36, borderRadius: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3l6 6M9 3l-6 6"/></svg>
              </button>
            </div>

            {project.tagline && (
              <div className="mono" style={{ fontSize: 12, color: theme.dim, letterSpacing: 0.06, textTransform: "uppercase", marginBottom: 14, animation: "msgIn .5s cubic-bezier(.2,.8,.2,1) .15s both" }}>
                {project.tagline}
              </div>
            )}
            <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1, margin: 0, letterSpacing: -0.5, animation: "msgIn .6s cubic-bezier(.2,.8,.2,1) .2s both" }}>
              {project.title}
            </h2>
            <p style={{ fontSize: 20, lineHeight: 1.5, color: theme.dim, marginTop: 24, fontFamily: theme.body, textWrap: "pretty", animation: "msgIn .6s cubic-bezier(.2,.8,.2,1) .3s both" }}>
              {project.summary}
            </p>

            {/* Headline metric strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, margin: "56px 0",
              borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
              {project.impact.map((m, k) => (
                <div key={k} style={{
                  padding: "32px 24px 32px 0",
                  borderRight: k < project.impact.length - 1 ? `1px solid ${theme.border}` : "none",
                  paddingLeft: k > 0 ? 24 : 0,
                  animation: `msgIn .5s cubic-bezier(.2,.8,.2,1) ${0.4 + k * 0.08}s both`,
                }}>
                  <div className="display" style={{ fontSize: 64, lineHeight: 1, color: theme.ink, letterSpacing: -1 }}>
                    <AnimatedNumber value={m.value} />
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: theme.dim, marginTop: 12, letterSpacing: 0.05, textTransform: "uppercase" }}>{m.metric}</div>
                  <div style={{ fontSize: 13, color: theme.dim, marginTop: 4 }}>{m.note}</div>
                </div>
              ))}
            </div>

            {/* Story arc */}
            {project.story ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 56, position: "relative", paddingLeft: 28 }}>
                <div style={{ position: "absolute", left: 5, top: 14, bottom: 14, width: 1, background: theme.border }} />
                {project.story.map((s, k) => (
                  <StoryNode key={k} theme={theme} node={s} i={k} />
                ))}
              </div>
            ) : (
              <React.Fragment>
                <DetailRow theme={theme} label="Problem" text={project.problem} />
                <DetailRow theme={theme} label="How I solved it" text={project.solution} />
              </React.Fragment>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 32, paddingTop: 32, borderTop: `1px solid ${theme.border}` }}>
              <div className="mono" style={{ fontSize: 11, color: theme.dim, letterSpacing: 0.05, textTransform: "uppercase", paddingTop: 6 }}>Stack</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {project.stack.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function DetailRow({ theme, label, text }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 32, marginBottom: 32 }}>
      <div className="mono" style={{ fontSize: 11, color: theme.dim, letterSpacing: 0.05, textTransform: "uppercase", paddingTop: 6 }}>{label}</div>
      <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0, textWrap: "pretty" }}>{text}</p>
    </div>
  );
}

// StoryNode — beat / stat / lesson in a case-study narrative arc
function StoryNode({ theme, node, i }) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setSeen(true), 100 + i * 80);
    return () => clearTimeout(t);
  }, [i]);

  const baseStyle = {
    position: "relative", paddingBottom: 28,
    opacity: seen ? 1 : 0,
    transform: seen ? "translateY(0)" : "translateY(12px)",
    transition: `opacity .6s ease, transform .6s cubic-bezier(.2,.8,.2,1)`,
  };

  if (node.kind === "stat") {
    return (
      <div ref={ref} style={baseStyle}>
        <div style={{ position: "absolute", left: -28, top: 14, width: 11, height: 11, borderRadius: 6,
          background: theme.accent, border: `1.5px solid ${theme.accent}` }} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, padding: "10px 0" }}>
          <span className="display" style={{ fontSize: 44, lineHeight: 1, color: theme.accent, letterSpacing: -0.5 }}>
            <AnimatedNumber value={node.value} />
          </span>
          {node.unit && <span className="mono" style={{ fontSize: 13, color: theme.dim }}>{node.unit}</span>}
          <span style={{ fontSize: 14, color: theme.dim, fontStyle: "italic" }}>{node.note}</span>
        </div>
      </div>
    );
  }

  if (node.kind === "lesson") {
    return (
      <div ref={ref} style={baseStyle}>
        <div style={{ position: "absolute", left: -28, top: 6, width: 11, height: 11, borderRadius: 6,
          background: theme.bg, border: `1.5px solid ${theme.accent}` }} />
        <div className="mono" style={{ fontSize: 10, color: theme.accent, letterSpacing: 0.08, textTransform: "uppercase", marginBottom: 6 }}>
          The lesson
        </div>
        <div style={{ fontFamily: theme.display, fontSize: 26, fontStyle: "italic", lineHeight: 1.25, letterSpacing: -0.2, color: theme.ink, maxWidth: 640 }}>
          "{node.text}"
        </div>
      </div>
    );
  }

  // beat
  return (
    <div ref={ref} style={baseStyle}>
      <div style={{ position: "absolute", left: -28, top: 6, width: 11, height: 11, borderRadius: 6,
        background: theme.bg, border: `1.5px solid ${theme.ink}` }} />
      <div className="mono" style={{ fontSize: 10, color: theme.dim, letterSpacing: 0.08, textTransform: "uppercase", marginBottom: 6 }}>
        {node.label}
      </div>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: theme.ink, margin: 0, textWrap: "pretty", maxWidth: 640 }}>
        {node.text}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Timeline — clickable role rows
// ─────────────────────────────────────────────────────────────
function Timeline({ theme, P, onOpenRole }) {
  return (
    <section id="timeline" style={{ padding: "120px 32px", borderTop: `1px solid ${theme.border}` }}>
      <SectionHeader theme={theme} label="02 / Trajectory" title="Six years. Four companies. One obsession." sub="Click any role for the full story." />
      <div style={{ maxWidth: 920, margin: "72px auto 0", position: "relative", paddingLeft: 28 }}>
        <div style={{ position: "absolute", left: 6, top: 12, bottom: 12, width: 1, background: theme.border }} />
        {P.timeline.map((t, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div data-cursor="link" data-cursor-label="details" onClick={() => onOpenRole(i)}
              style={{ position: "relative", paddingBottom: 36, transition: "padding-left .3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.paddingLeft = "8px")}
              onMouseLeave={(e) => (e.currentTarget.style.paddingLeft = "0")}>
              <div style={{ position: "absolute", left: -28, top: 6, width: 13, height: 13, borderRadius: 7,
                background: theme.bg, border: `1.5px solid ${i === 0 ? theme.accent : theme.ink}`,
                boxShadow: i === 0 ? `0 0 0 6px ${theme.accent}22` : "none" }}>
                {i === 0 && <div style={{ position: "absolute", inset: 2, borderRadius: 4, background: theme.accent, animation: "blink 2s ease infinite" }} />}
              </div>
              <div className="mono" style={{ fontSize: 11, color: theme.dim, display: "flex", gap: 10, marginBottom: 6, alignItems: "center", flexWrap: "wrap" }}>
                <span>{t.from}</span><span>—</span><span>{t.to}</span>
                <span style={{ opacity: .5 }}>·</span>
                <span>{t.location}</span>
                <span style={{ opacity: .5 }}>·</span>
                <span style={{ background: theme.hover, padding: "2px 8px", borderRadius: 999, color: theme.ink }}>{t.stage}</span>
              </div>
              <div className="display" style={{ fontSize: 30, letterSpacing: -0.3, lineHeight: 1.1, display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                <span className="link-u">{t.role}</span>
                <span style={{ color: theme.dim, fontSize: 24 }}>· {t.company}</span>
              </div>
              <p style={{ marginTop: 10, color: theme.dim, fontSize: 14, lineHeight: 1.5, maxWidth: 640, marginBottom: 12 }}>{t.note}</p>
              <div style={{ fontSize: 11, color: theme.dim, fontFamily: theme.mono, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ borderBottom: `1px solid ${theme.dim}`, paddingBottom: 1 }}>read the story</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 5h6M5 2l3 3-3 3"/></svg>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Role overlay — full timeline detail
// ─────────────────────────────────────────────────────────────
function RoleOverlay({ theme, role, onClose }) {
  const [phase, setPhase] = useState("enter");
  useEffect(() => {
    requestAnimationFrame(() => setPhase("open"));
    const onKey = (e) => { if (e.key === "Escape") handle(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);
  const handle = () => { setPhase("exit"); setTimeout(onClose, 320); };

  return createPortal(
    <div onClick={handle} style={{
      position: "fixed", inset: 0, zIndex: 3000,
      background: phase === "open" ? "rgba(0,0,0,.55)" : "rgba(0,0,0,0)",
      backdropFilter: phase === "open" ? "blur(10px)" : "blur(0)",
      transition: "background .32s ease, backdrop-filter .32s ease",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: theme.surface, color: theme.ink,
        width: "min(820px, 100%)", maxHeight: "calc(100vh - 48px)", overflow: "auto",
        borderRadius: 18, border: `1px solid ${theme.border}`,
        boxShadow: "0 30px 80px rgba(0,0,0,.32)",
        transform: phase === "open" ? "translateY(0) scale(1)" : "translateY(20px) scale(.97)",
        opacity: phase === "open" ? 1 : 0,
        transition: "all .35s cubic-bezier(.2,.8,.2,1)",
      }}>
        <div style={{ padding: "32px 40px 16px", borderBottom: `1px solid ${theme.border}`,
          display: "flex", alignItems: "flex-start", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 11, color: theme.dim, marginBottom: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span>{role.from} — {role.to}</span>
              <span style={{ opacity: .5 }}>·</span>
              <span>{role.location}</span>
              <span style={{ opacity: .5 }}>·</span>
              <span>{role.stage}</span>
              <span style={{ opacity: .5 }}>·</span>
              <span>Team {role.team}</span>
            </div>
            <h3 className="display" style={{ fontSize: 44, margin: 0, letterSpacing: -0.4, lineHeight: 1.05 }}>
              {role.role} <span style={{ color: theme.dim }}>· {role.company}</span>
            </h3>
            <p style={{ marginTop: 10, color: theme.dim, fontSize: 15, lineHeight: 1.5, marginBottom: 0 }}>{role.note}</p>
          </div>
          <button data-cursor="link" data-cursor-label="close" onClick={handle} style={{
            border: `1px solid ${theme.border}`, background: "transparent", color: theme.ink,
            width: 36, height: 36, borderRadius: 18, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3l6 6M9 3l-6 6"/></svg>
          </button>
        </div>

        <div style={{ padding: "28px 40px 8px" }}>
          <div className="mono" style={{ fontSize: 10, color: theme.dim, letterSpacing: 0.05, textTransform: "uppercase", marginBottom: 8 }}>Funding context</div>
          <div style={{ fontSize: 14, color: theme.ink }}>{role.funding}</div>
        </div>

        <div style={{ padding: "20px 40px 8px" }}>
          <div className="mono" style={{ fontSize: 10, color: theme.dim, letterSpacing: 0.05, textTransform: "uppercase", marginBottom: 14 }}>What I shipped</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
            {role.highlights.map((h, i) => (
              <li key={i} style={{ display: "flex", gap: 14, fontSize: 15, lineHeight: 1.55,
                animation: `msgIn .4s cubic-bezier(.2,.8,.2,1) ${0.05 + i * 0.06}s both` }}>
                <span style={{ color: theme.dim, fontFamily: theme.mono, fontSize: 11, minWidth: 18, paddingTop: 4 }}>0{i+1}</span>
                <span style={{ flex: 1, textWrap: "pretty" }}>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ padding: "24px 40px 32px", marginTop: 8 }}>
          <div className="mono" style={{ fontSize: 10, color: theme.dim, letterSpacing: 0.05, textTransform: "uppercase", marginBottom: 12 }}>Stack & tools</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {role.stack.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────
// Manifesto — with AI summarize
// ─────────────────────────────────────────────────────────────
function Manifesto({ theme, P }) {
  const [tldr, setTldr] = useState(null);
  const [busy, setBusy] = useState(false);
  const { play } = useContext(SoundCtx);
  const summarize = async () => {
    setBusy(true); play("click");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Reply with ONLY one punchy sentence (under 20 words), same builder tone, summarizing this philosophy:\n\n${P.manifesto.join("\n\n")}`,
            },
          ],
        }),
      });
      const data = await res.json().catch(() => ({}));
      const line = res.ok ? String(data.reply || "").trim().replace(/^["']|["']$/g, "") : "";
      setTldr(line || "Product is empathy with deadlines.");
      if (line) play("success");
    } catch {
      setTldr("Product is empathy with deadlines.");
    }
    setBusy(false);
  };

  return (
    <section id="manifesto" style={{ padding: "120px 32px", borderTop: `1px solid ${theme.border}` }}>
      <SectionHeader theme={theme} label="03 / Manifesto" title="How I think about product." />
      <div style={{ maxWidth: 760, margin: "72px auto 0" }}>
        {P.manifesto.map((para, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <p style={{ fontFamily: theme.display, fontSize: "clamp(22px, 2.5vw, 32px)", lineHeight: 1.4,
              letterSpacing: -0.2, marginBottom: 28, textWrap: "pretty" }}>
              {para}
            </p>
          </Reveal>
        ))}
        <Reveal delay={0.3}>
          <div style={{ marginTop: 40, padding: 22, borderRadius: 14, background: theme.hover,
            border: `1px dashed ${theme.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: tldr ? 14 : 0 }}>
              <span style={{ fontSize: 14, color: theme.dim, flex: 1 }}>Too long? Let my AI compress it.</span>
              <button data-cursor="link" data-cursor-label="summarize" onClick={summarize} disabled={busy} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}>
                {busy ? "Thinking…" : tldr ? "Again" : "Summarize ✦"}
              </button>
            </div>
            {tldr && (
              <div className="display" style={{ fontSize: 24, lineHeight: 1.3, color: theme.ink, letterSpacing: -0.2, animation: "msgIn .4s cubic-bezier(.2,.8,.2,1)" }}>
                "{tldr}"
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Now
// ─────────────────────────────────────────────────────────────
function Now({ theme, P }) {
  return (
    <section id="now" style={{ padding: "120px 32px", borderTop: `1px solid ${theme.border}` }}>
      <SectionHeader theme={theme} label="04 / Now" title="What I'm up to this week." sub="Updated often." />
      <div style={{ maxWidth: 920, margin: "72px auto 0", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {P.now.map((n, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div style={{ padding: 28, borderRadius: 14, border: `1px solid ${theme.border}`,
              background: theme.surface, minHeight: 160,
              transition: "transform .25s, border-color .25s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = theme.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = theme.border; }}>
              <div className="mono" style={{ fontSize: 11, color: theme.ink, letterSpacing: 0.08, textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: 3, background: theme.ink, display: "inline-block" }}/>
                {n.label}
              </div>
              <div style={{ fontFamily: theme.display, fontSize: 24, lineHeight: 1.3, letterSpacing: -0.2, textWrap: "pretty" }}>
                {n.text}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Reading — bookshelf spines + hover / tap bubbles
// ─────────────────────────────────────────────────────────────
function Reading({ theme, P }) {
  const shelves = P.readingShelves || [];
  const [pinnedKey, setPinnedKey] = useState(null);
  const zoneRef = useRef(null);

  // Pin state is mainly for coarse pointers: Esc or tap outside dismisses bubble.
  useEffect(() => {
    if (pinnedKey == null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPinnedKey(null);
    };
    const onDown = (e) => {
      if (!zoneRef.current?.contains(e.target)) setPinnedKey(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown, true);
    };
  }, [pinnedKey]);

  return (
    <section
      id="reading"
      style={{
        padding: "120px 32px",
        borderTop: `1px solid ${theme.border}`,
        overflow: "visible",
        position: "relative",
        isolation: "isolate",
      }}>
      <SectionHeader
        theme={theme}
        label="05 / Reading"
        title="Books that shaped how I ship."
        sub="One shelf, left to right by genre. Scroll sideways on small screens. Genres read as a timeline below—hover or tap a book for notes. Escape or tap outside closes." />
      <div ref={zoneRef} className="bookshelf-zone">
        <div className="reading-single-scroll">
          <div className="reading-single-inner">
            <div className="bookshelf-row bookshelf-row-single" aria-label="Books read, in order">
              {shelves.flatMap((shelf, shelfIndex) =>
                shelf.books.map((book, bookIndex) => {
                  const k = `${shelfIndex}:${bookIndex}`;
                  const flatOffset = shelves
                    .slice(0, shelfIndex)
                    .reduce((n, sh) => n + sh.books.length, 0);
                  const staggerDelay = (flatOffset + bookIndex) * 0.025;
                  return (
                    <Reveal key={`${book.title}-${k}`} delay={Math.min(staggerDelay, 1)} y={14}>
                      <BookshelfSlot
                        theme={theme}
                        book={book}
                        bubbleKey={k}
                        shelfIndex={shelfIndex}
                        bookIndex={bookIndex}
                        pinned={pinnedKey === k}
                        onToggle={() => setPinnedKey((p) => (p === k ? null : k))} />
                    </Reveal>
                  );
                }),
              )}
            </div>
            <nav className="reading-timeline-track" aria-label="Reading by genre">
              {shelves.map((shelf) => (
                <div
                  key={shelf.genre}
                  className="reading-timeline-segment"
                  style={{ flex: shelf.books.length }}>
                  <span className="reading-timeline-dot" aria-hidden />
                  <span className="reading-timeline-genre">{shelf.genre}</span>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookshelfSlot({ theme, book, bubbleKey, shelfIndex, bookIndex, pinned, onToggle }) {
  const tipId = `reading-bubble-${bubbleKey}`;
  const initial = useMemo(() => {
    const t = book.title.replace(/^the\s+/i, "").trim();
    return (t[0] || "?").toUpperCase();
  }, [book.title]);

  const mixIndex = shelfIndex * 31 + bookIndex * 17;
  const spineStyle = useMemo(() => {
    const a = 20 + ((mixIndex * 13) % 52);
    const b = Math.min(90, a + 20 + (mixIndex % 17));
    const top = `color-mix(in srgb, ${theme.ink} ${a}%, ${theme.surface})`;
    const bot = `color-mix(in srgb, ${theme.ink} ${b}%, ${theme.surface})`;
    return {
      background: `linear-gradient(165deg, ${top}, ${bot})`,
      color: theme.bg,
    };
  }, [mixIndex, theme.ink, theme.surface, theme.bg]);

  const pagesW = 6 + (mixIndex % 6);
  const label =
    book.title.length > 28 ? `${book.title.slice(0, 26)}…` : book.title;

  return (
    <div className={`bookshelf-slot ${pinned ? "bookshelf-slot--pinned" : ""}`}>
      <div className="bookshelf-bubble" id={tipId} role="tooltip">
        <div
          className="display bookshelf-bubble-title"
          style={{ fontSize: 18, letterSpacing: -0.2, lineHeight: 1.35, textWrap: "pretty" }}>
          {book.title}
        </div>
        <div className="mono bookshelf-bubble-author" style={{ fontSize: 11, color: theme.dim, letterSpacing: 0.04 }}>
          {book.author}
        </div>
        <p className="bookshelf-bubble-tag">{book.why}</p>
      </div>
      <button
        type="button"
        className="mini-book-btn mono"
        aria-expanded={pinned}
        aria-controls={tipId}
        aria-label={`${book.title} by ${book.author}. ${pinned ? "Hide" : "Show"} what I took away.`}
        data-cursor="link"
        data-cursor-label={label}
        onClick={() => onToggle()}>
        <span className="mini-book-block">
          {/* Top strip reads as the page edges when you look down on the row. */}
          <span className="mini-book-pages-top" aria-hidden />
          <span className="mini-book-body">
            <span className="mini-book-spine" style={spineStyle}>
              <span className="mini-book-letter">{initial}</span>
            </span>
            {/* Fore-edge / page block — separates spine from floating bar look. */}
            <span className="mini-book-pages-edge" style={{ width: pagesW }} aria-hidden />
          </span>
        </span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────────────────────
function Contact({ theme, P, onAsk }) {
  return (
    <section id="contact" style={{ padding: "160px 32px 80px", borderTop: `1px solid ${theme.border}` }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <div className="mono" style={{ fontSize: 11, color: theme.dim, letterSpacing: 0.1, textTransform: "uppercase", marginBottom: 20 }}>
            06 / Contact
          </div>
        </Reveal>
        <BlurIn tag="h2" className="display" style={{ fontSize: "clamp(48px, 9vw, 140px)", margin: 0, lineHeight: 0.95 }}>
          Let's build
        </BlurIn>
        <BlurIn delay={0.2} tag="h2" className="display" style={{ fontSize: "clamp(48px, 9vw, 140px)", margin: 0, lineHeight: 0.95, fontStyle: "italic" }}>
          something.
        </BlurIn>
        <Reveal delay={0.5}>
          <p style={{ fontSize: 18, color: theme.dim, maxWidth: 520, margin: "32px auto 40px", lineHeight: 1.5 }}>
            Founding PM, Sr PM, or a sharp problem that needs someone. I read every email.
          </p>
        </Reveal>
        <Reveal delay={0.7}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a data-cursor="link" data-cursor-label="email" href={`mailto:${P.email}`} className="btn-primary">
              {P.email}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l6 6M9 3v6H3"/></svg>
            </a>
            <button data-cursor="link" data-cursor-label="ask AI" onClick={onAsk} className="btn-ghost">
              Ask my AI first
              <span style={{ width: 6, height: 6, borderRadius: 3, background: "#10b981", boxShadow: "0 0 6px #10b981" }}/>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ theme, P }) {
  return (
    <footer style={{ padding: "40px 32px", borderTop: `1px solid ${theme.border}`, fontFamily: theme.mono }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: theme.dim, gap: 16, flexWrap: "wrap" }}>
        <span>© 2026 {P.name} · Built with care, shipped with Claude.</span>
        <span>{P.location} · {P.phone}</span>
      </div>
    </footer>
  );
}

function FloatingAsk({ theme, onClick, hidden }) {
  if (hidden) return null;
  return (
    <button data-cursor="link" data-cursor-label="ask Ayush" onClick={onClick} style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      background: theme.ink, color: theme.bg, border: 0,
      padding: "12px 18px", borderRadius: 999,
      display: "flex", alignItems: "center", gap: 10,
      fontSize: 13, fontFamily: theme.body, fontWeight: 500,
      boxShadow: "0 14px 36px rgba(0,0,0,.22)",
      animation: "chatIn .5s cubic-bezier(.2,.8,.2,1) .8s backwards",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10b981", boxShadow: "0 0 10px #10b981", animation: "blink 2s ease infinite" }}/>
      Ask Ayush
    </button>
  );
}

