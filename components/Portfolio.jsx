"use client";

import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  SoundCtx,
  BlurIn,
  Reveal,
  AnimatedNumber,
  useDragReorder,
} from "./shared";

// Section primitives used by routed pages (see `/app/*/page.jsx`).

// ─────────────────────────────────────────────────────────────
// Hero — interactive word arrange
// ─────────────────────────────────────────────────────────────
/** `siteLinks` optional home-only row linking to routed sections without relying on header. */
export function Hero({ theme, P, play, onExplore, onAsk, siteLinks }) {
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

  const heroPortrait = P.portrait?.src;

  return (
    <section id="hero" style={{ position: "relative", minHeight: "100vh", padding: "120px 32px 80px",
      display: "flex", flexDirection: "column", justifyContent: "center",
    }}>
      <style>{`
        /* Single hero column — portrait is a badge at the top of the stack, not a second column */
        .hero-main-grid {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .hero-portrait-stack {
          width: clamp(84px, 14vw, 112px);
          height: clamp(84px, 14vw, 112px);
          margin-bottom: 20px;
          transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .hero-photo-shell {
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          padding: 3px;
          background: linear-gradient(145deg, ${theme.surface} 0%, color-mix(in srgb, ${theme.ink} 6%, ${theme.surface}) 100%);
          border: 1px solid ${theme.border};
          box-shadow: 0 12px 32px rgba(15, 15, 15, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
          box-sizing: border-box;
          transition: box-shadow 200ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .hero-photo-core {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          overflow: hidden;
          transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @media (hover: hover) and (pointer: fine) {
          .hero-portrait-stack:hover {
            transform: translateY(-2px);
          }
          .hero-portrait-stack:hover .hero-photo-shell {
            box-shadow: 0 18px 44px rgba(15, 15, 15, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.65);
          }
          .hero-portrait-stack:hover .hero-photo-core {
            transform: scale(1.03);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-portrait-stack,
          .hero-photo-shell,
          .hero-photo-core {
            transition: none !important;
          }
          .hero-portrait-stack,
          .hero-portrait-stack:hover {
            transform: none !important;
          }
          .hero-portrait-stack:hover .hero-photo-core {
            transform: none !important;
          }
        }
      `}</style>

      <div className="hero-main-grid">
        <div ref={wrapRef} style={{ position: "relative", width: "100%", minHeight: 540 }}>
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
            {heroPortrait ? (
              <Reveal delay={0.04} y={8}>
                {/*
                  First-fold identity marker: mirrors common portfolio pattern (photo before name),
                  stays small so it cues “human” without fighting the draggable word chaos.
                */}
                <div className="hero-portrait-stack" style={{ pointerEvents: "auto" }}>
                  <div className="hero-photo-shell">
                    <div className="hero-photo-core">
                      <Image
                        src={P.portrait.src}
                        alt={P.portrait.alt}
                        fill
                        sizes="112px"
                        style={{ objectFit: "cover", objectPosition: "center 18%" }}
                        priority
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            ) : null}
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
              <div style={{ marginTop: 32, display: "flex", gap: 10, pointerEvents: "auto", flexWrap: "wrap" }}>
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
              </div>
            </Reveal>
            {siteLinks?.length ? (
              <Reveal delay={1.06}>
                <nav aria-label="Site sections from home" style={{ marginTop: 22, pointerEvents: "auto" }}>
                  <div className="mono" style={{ fontSize: 11, color: theme.dim, display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 0" }}>
                    <span style={{ marginRight: 10, opacity: 0.75 }}>Go to:</span>
                    {siteLinks.map((l, ix) => (
                      <span key={l.href} style={{ display: "inline-flex", alignItems: "baseline" }}>
                        {ix > 0 ? <span aria-hidden style={{ opacity: 0.35, margin: "0 12px", userSelect: "none" }}>·</span> : null}
                        <Link
                          href={l.href}
                          className="link-u"
                          data-cursor="link"
                          style={{ color: theme.ink, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}
                        >
                          {l.label}
                        </Link>
                      </span>
                    ))}
                  </div>
                </nav>
              </Reveal>
            ) : null}
          </div>
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
export function SectionHeader({ theme, label, title, sub }) {
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
export function Work({ theme, projects, order, setOrder, setExpanded, cardRects }) {
  const { ref, onStart } = useDragReorder(order, setOrder);
  const ordered = order.map((id) => projects.find((p) => p.id === id)).filter(Boolean);

  return (
    <section id="work" style={{ padding: "120px 32px", borderTop: `1px solid ${theme.border}` }}>
      <SectionHeader theme={theme} label="Work" title="Four projects that moved numbers that mattered."
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
    <div id={p.id} ref={(el) => { ref.current = el; setRect(el); }} data-item={p.id}
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
export function ProjectOverlay({ theme, project, origin, onClose }) {
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
export function Timeline({ theme, P, onOpenRole }) {
  return (
    <section id="timeline" style={{ padding: "120px 32px", borderTop: `1px solid ${theme.border}` }}>
      <SectionHeader theme={theme} label="Trajectory" title="Six years. Four companies. One obsession." sub="Click any role for the full story." />
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
export function RoleOverlay({ theme, role, onClose }) {
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
// About — story + philosophy (manifesto) + education grid + AI TL;DR — portrait lives on home hero only
// ─────────────────────────────────────────────────────────────
export function AboutPage({ theme, P }) {
  const [tldr, setTldr] = useState(null);
  const [busy, setBusy] = useState(false);
  const { play } = useContext(SoundCtx);
  const about = P.about;

  const summarize = async () => {
    setBusy(true);
    play("click");
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
      setTldr(line || "Obsessing over user problems");
      if (line) play("success");
    } catch {
      setTldr("Product is empathy with deadlines.");
    }
    setBusy(false);
  };

  const creds = about?.credentials ?? [];

  return (
    <section id="about" style={{ padding: "120px 32px", borderTop: `1px solid ${theme.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <p
            className="mono"
            style={{
              fontSize: 11,
              color: theme.dim,
              letterSpacing: 0.1,
              textTransform: "uppercase",
              margin: "0 0 20px",
            }}
          >
            About
          </p>
        </Reveal>
        <BlurIn
          tag="h1"
          className="display"
          style={{
            fontSize: "clamp(36px, 5.5vw, 72px)",
            lineHeight: 1,
            margin: 0,
            maxWidth: 980,
            textWrap: "balance",
          }}
        >
          {about?.headline ?? "How I work and what I care about."}
        </BlurIn>
        <div style={{ maxWidth: 720, marginTop: 32 }}>
          {(about?.story ?? []).map((para, i) => (
            <Reveal key={i} delay={0.06 + i * 0.08}>
              <p
                style={{
                  margin: i === 0 ? 0 : "18px 0 0",
                  fontFamily: theme.body,
                  fontSize: "clamp(16px, 1.7vw, 18px)",
                  lineHeight: 1.62,
                  color: theme.ink,
                  textWrap: "pretty",
                }}
              >
                {para}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Philosophy before education so visitors get beliefs before credentials — matches how people actually skim. */}
      <div style={{ maxWidth: 1200, margin: "96px auto 0" }}>
        <SectionHeader theme={theme} label="Philosophy" title="How I think about product." />
        <div style={{ maxWidth: 720, marginTop: 44 }}>
          {P.manifesto.map((para, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <p
                style={{
                  fontFamily: theme.body,
                  fontSize: "clamp(16px, 1.7vw, 18px)",
                  lineHeight: 1.62,
                  color: theme.ink,
                  margin: i === 0 ? 0 : "18px 0 0",
                  textWrap: "pretty",
                }}
              >
                {para}
              </p>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <div
              style={{
                marginTop: 32,
                padding: 22,
                borderRadius: 16,
                background: theme.hover,
                border: `1px dashed ${theme.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: tldr ? 14 : 0 }}>
                <span style={{ fontSize: 14, color: theme.dim, flex: 1 }}>Too long? Let my AI compress it.</span>
                <button
                  type="button"
                  data-cursor="link"
                  data-cursor-label="summarize"
                  onClick={summarize}
                  disabled={busy}
                  className="btn-ghost"
                  style={{ padding: "6px 12px", fontSize: 12 }}
                >
                  {busy ? "Thinking…" : tldr ? "Again" : "Summarize ✦"}
                </button>
              </div>
              {tldr ? (
                <div
                  className="display"
                  style={{
                    fontSize: 24,
                    lineHeight: 1.3,
                    color: theme.ink,
                    letterSpacing: -0.2,
                    animation: "msgIn .4s cubic-bezier(.2,.8,.2,1)",
                  }}
                >
                  &ldquo;{tldr}&rdquo;
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>

      {about?.howTitle && creds.length > 0 ? (
        <div style={{ maxWidth: 1200, margin: "96px auto 0" }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <h2 className="display" style={{ fontSize: "clamp(36px, 5.5vw, 72px)", margin: 0, maxWidth: 980, lineHeight: 1, textWrap: "balance" }}>
                {about.howTitle}
              </h2>
              <span className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.dim }}>
                Formal training
              </span>
            </div>
          </Reveal>
          <style>{`
            .about-edu-card {
              transition: transform 240ms cubic-bezier(0.23, 1, 0.32, 1), border-color 240ms cubic-bezier(0.23, 1, 0.32, 1);
            }
            @media (hover: hover) and (pointer: fine) {
              .about-edu-card:hover {
                transform: translateY(-4px);
                border-color: ${theme.ink}25;
              }
            }
          `}</style>
          <div
            style={{
              marginTop: 28,
              display: "grid",
              gap: "18px 20px",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {creds.map((cred, i) => {
              if (cred.line) {
                return (
                  <Reveal key={`line-${i}`} delay={i * 0.06}>
                    <p
                      style={{
                        gridColumn: "1 / -1",
                        padding: "20px 24px",
                        borderRadius: 18,
                        border: `1px solid ${theme.border}`,
                        background: theme.surface,
                        fontFamily: theme.body,
                        fontSize: 16,
                        lineHeight: 1.55,
                        color: theme.dim,
                        margin: 0,
                      }}
                    >
                      {cred.line}
                    </p>
                  </Reveal>
                );
              }
              return (
                <Reveal key={cred.step ?? i} delay={i * 0.07}>
                  <article
                    className="about-edu-card"
                    style={{
                      position: "relative",
                      borderRadius: 22,
                      padding: "28px 24px 26px",
                      border: `1px solid ${theme.border}`,
                      background: `linear-gradient(155deg, ${theme.surface} 0%, color-mix(in srgb, ${theme.bg} 65%, ${theme.surface}) 100%)`,
                      boxShadow: `0 18px 40px rgba(15, 15, 15, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.55)`,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: 24,
                        right: 24,
                        top: 0,
                        height: 3,
                        background: theme.accent,
                        opacity: 0.92,
                      }}
                    />
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: theme.dim,
                      }}
                    >
                      {cred.step ?? String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="display" style={{
                      margin: "14px 0 0",
                      fontSize: "clamp(1.35rem, 2.8vw, 1.65rem)",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                      color: theme.ink,
                    }}
                    >
                      {cred.institution}
                    </h3>
                    <p style={{ margin: "10px 0 0", fontFamily: theme.body, fontSize: 15, fontWeight: 600, color: theme.ink }}>
                      {cred.degree}
                    </p>
                    <p style={{
                      margin: "8px 0 0",
                      paddingTop: 14,
                      borderTop: `1px dashed ${theme.border}`,
                      fontFamily: theme.body,
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: theme.dim,
                    }}
                    >
                      {cred.focus}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

/** Legacy export name — routes now live on `/about`. */
export const Manifesto = AboutPage;

// ─────────────────────────────────────────────────────────────
// Contact — dedicated outreach page (paired with chrome “Get in touch” link)
// ─────────────────────────────────────────────────────────────
export function ContactPage({ theme, P }) {
  const c = P.contactPage;
  if (!c) return null;

  const LinkBlock = ({
    label,
    children,
    isLast,
  }) => (
    <div
      className="contact-link-block"
      style={{
        padding: "22px 0",
        borderBottom: isLast ? "none" : `1px solid ${theme.border}`,
      }}
    >
      <p className="mono" style={{
        margin: "0 0 10px", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: theme.dim,
      }}
      >
        {label}
      </p>
      <div style={{ fontFamily: theme.body, fontSize: "clamp(16px, 2vw, 18px)", lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );

  return (
    <section
      id="contact"
      aria-labelledby="contact-page-heading"
      style={{
        padding: "clamp(72px, 11vw, 124px) clamp(20px, 5vw, 40px) 96px",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <Reveal>
        <p className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.dim, margin: "0 0 16px" }}>
          Get in touch
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h1
          id="contact-page-heading"
          className="display"
          style={{
            fontSize: "clamp(2rem, 5vw, 2.85rem)",
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: "-0.03em",
            textWrap: "balance",
          }}
        >
          {c.headline}
        </h1>
      </Reveal>
      <Reveal delay={0.14}>
        <p style={{
          margin: "22px 0 0",
          fontFamily: theme.display,
          fontSize: "clamp(1.45rem, 3.2vw, 2rem)",
          letterSpacing: "-0.02em",
          color: theme.ink,
        }}
        >
          {c.sub}
        </p>
      </Reveal>

      <div style={{ marginTop: 40 }}>
        <LinkBlock label="Phone">
          <a href={`tel:${c.phoneTel}`} className="link-u" data-cursor="link" style={{ color: theme.ink }}>
            {c.phoneDisplay}
          </a>
        </LinkBlock>
        <LinkBlock label="Email">
          <a href={`mailto:${encodeURIComponent(c.email)}`} className="link-u" data-cursor="link" style={{ color: theme.ink }}>
            {c.email}
          </a>
        </LinkBlock>
        <LinkBlock label="LinkedIn" isLast>
          <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="link-u" data-cursor="link" style={{ color: theme.ink }}>
            {c.linkedinUrl.replace(/^https:\/\//, "")}
          </a>
        </LinkBlock>
      </div>

      {/* Soft callout ties this page back to conversational entry without cloning the overlay. */}
      <Reveal delay={0.35}>
        <p style={{
          margin: "44px 0 0",
          padding: "20px 22px",
          borderRadius: 16,
          background: theme.hover,
          border: `1px solid ${theme.border}`,
          fontFamily: theme.body,
          fontSize: 14,
          lineHeight: 1.58,
          color: theme.dim,
        }}
        >
          Prefer typing to calling? Ask Ayush is still on each page via the bubble — useful if you&apos;re screening for fit before scheduling.
        </p>
      </Reveal>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Reading — bookshelf spines + hover / tap bubbles
// ─────────────────────────────────────────────────────────────
export function Reading({ theme, P }) {
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
export function Contact({ theme, P, onAsk }) {
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
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer({ theme, P }) {
  return (
    <footer style={{ padding: "40px 32px", borderTop: `1px solid ${theme.border}`, fontFamily: theme.mono }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: theme.dim, gap: 16, flexWrap: "wrap" }}>
        <span>© 2026 {P.name} · Built with care, shipped with Claude.</span>
        <span>{P.location} · {P.phone}</span>
      </div>
    </footer>
  );
}

