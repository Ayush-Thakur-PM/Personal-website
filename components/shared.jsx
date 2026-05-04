"use client";

import React from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";

// Shared interactive primitives. Theme-agnostic.

// ─────────────────────────────────────────────────────────────
// MagneticCursor — renders to document.body via portal so it works
// regardless of nested transforms / overflow. Tracks pointer globally.
// Modes: idle | link | text | drag (set via [data-cursor] attr)
// Hides on touch devices.
//
// Uses pure white geometry + mix-blend-mode: difference so the cursor
// mathematically inverts against the pixel behind it → dark on paper,
// light on ink (always readable vs fixed gray strokes that wash out).
// ─────────────────────────────────────────────────────────────
function MagneticCursor() {
  const contrastColor = "#ffffff";
  const dotRef = React.useRef(null);
  const ringRef = React.useRef(null);
  const labelRef = React.useRef(null);
  const [mode, setMode] = React.useState("idle");
  const [label, setLabel] = React.useState("");
  const [touch, setTouch] = React.useState(false);
  // Wait for client mount so SSR + hydration both render `null`; then portal to body.
  // If we portal on the first client paint while the server returned null, React's tree
  // mismatches and hydration fails (#__next vs document.body subtree).
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  React.useEffect(() => {
    if (!mounted || touch) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let dx = mx, dy = my, rx = mx, ry = my;
    let raf;
    const tick = () => {
      dx += (mx - dx) * 0.6;
      dy += (my - dy) * 0.6;
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dx}px,${dy}px,0) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      if (labelRef.current) labelRef.current.style.transform = `translate3d(${rx + 24}px,${ry + 24}px,0)`;
      raf = requestAnimationFrame(tick);
    };
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const over = (e) => {
      const t = e.target?.closest?.("[data-cursor]");
      if (t) {
        setMode(t.dataset.cursor);
        setLabel(t.dataset.cursorLabel || "");
      } else {
        setMode("idle"); setLabel("");
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [mounted, touch]);

  if (!mounted || touch) return null;

  const ringSize = mode === "link" ? 48 : mode === "text" ? 4 : mode === "drag" ? 64 : 28;
  const ringBorder = mode === "text" ? 0 : 1.2;
  const dotOpacity = mode === "link" || mode === "drag" ? 0 : 1;

  const ui = (
    <React.Fragment>
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, width: ringSize, height: ringSize,
        border: `${ringBorder}px solid ${contrastColor}`,
        borderRadius: "50%", pointerEvents: "none", zIndex: 100000,
        transition: "width .35s cubic-bezier(.2,.8,.2,1), height .35s cubic-bezier(.2,.8,.2,1), border-width .25s, background .25s",
        background: mode === "text" ? contrastColor : "transparent",
        mixBlendMode: "difference",
      }} />
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, width: 4, height: 4,
        background: contrastColor, borderRadius: "50%", pointerEvents: "none", zIndex: 100000,
        transition: "opacity .2s",
        opacity: dotOpacity,
        mixBlendMode: "difference",
      }} />
      {label && (
        <div ref={labelRef} style={{
          position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 100000,
          padding: "4px 8px", borderRadius: 999,
          background: contrastColor, color: "#0a0a0a",
          fontSize: 10, fontFamily: "JetBrains Mono, monospace", letterSpacing: 0.05,
          textTransform: "uppercase", whiteSpace: "nowrap",
          mixBlendMode: "difference",
          animation: "labelIn .25s cubic-bezier(.2,.8,.2,1)",
        }}>{label}</div>
      )}
    </React.Fragment>
  );

  return createPortal(ui, document.body);
}

// ─────────────────────────────────────────────────────────────
// Sound system — singleton AudioContext, lazy-init on first user gesture.
// Calls produce short tones via WebAudio. Mute persists in localStorage.
// ─────────────────────────────────────────────────────────────
const SoundCtx = React.createContext({ on: true, setOn: () => {}, play: () => {} });

function SoundProvider({ children }) {
  const [on, setOn] = React.useState(() => {
    try { return localStorage.getItem("snd") !== "0"; } catch { return true; }
  });
  const acRef = React.useRef(null);
  const onRef = React.useRef(on);
  onRef.current = on;

  // Ensure AudioContext is created+resumed on the first user gesture (browsers
  // require this — silent autoplay policy).
  React.useEffect(() => {
    const init = () => {
      try {
        if (!acRef.current) {
          const C = window.AudioContext || window.webkitAudioContext;
          acRef.current = new C();
        }
        if (acRef.current.state === "suspended") acRef.current.resume();
      } catch {}
    };
    const onAny = () => init();
    window.addEventListener("pointerdown", onAny, { once: false });
    window.addEventListener("keydown", onAny, { once: false });
    return () => {
      window.removeEventListener("pointerdown", onAny);
      window.removeEventListener("keydown", onAny);
    };
  }, []);

  React.useEffect(() => {
    try { localStorage.setItem("snd", on ? "1" : "0"); } catch {}
  }, [on]);

  // play( "click" | "hover" | "open" | "close" | "tick" | "success" | { freq, dur, vol, type } )
  const play = React.useCallback((kind = "click") => {
    if (!onRef.current) return;
    const ac = acRef.current;
    if (!ac || ac.state !== "running") return;
    const presets = {
      click:   { freq: 880, dur: 0.05,  vol: 0.05, type: "sine"     },
      hover:   { freq: 1320, dur: 0.025, vol: 0.018, type: "sine"    },
      open:    { freq: 660, dur: 0.10,  vol: 0.06, type: "triangle" },
      close:   { freq: 420, dur: 0.10,  vol: 0.05, type: "triangle" },
      tick:    { freq: 1500, dur: 0.02,  vol: 0.018, type: "square"   },
      success: { freq: 988, dur: 0.18,  vol: 0.05, type: "sine"     },
      drag:    { freq: 540, dur: 0.04,  vol: 0.03, type: "sine"     },
      drop:    { freq: 740, dur: 0.06,  vol: 0.04, type: "sine"     },
    };
    // WHY: If `play` is ever wired as `onClick={play}`, React passes a synthetic event here.
    // Spreading that into presets overwrites `type` with DOM event names like "click" — invalid for
    // OscillatorNode and can crash devtools / error overlays with useless messages like "[object Event]".
    let kindArg = kind;
    if (kindArg != null && typeof kindArg === "object") {
      const isDomOrReactUiEvent =
        "nativeEvent" in kindArg ||
        (typeof Event !== "undefined" && kindArg instanceof Event);
      if (isDomOrReactUiEvent) kindArg = "click";
    }
    const presetName = typeof kindArg === "string" ? kindArg : null;
    const p =
      typeof kindArg === "string"
        ? presets[kindArg] || presets.click
        : kindArg != null && typeof kindArg === "object"
          ? { ...presets.click, ...kindArg }
          : presets.click;
    const validOscTypes = new Set(["sine", "square", "sawtooth", "triangle", "custom"]);
    const oscType = validOscTypes.has(p.type) ? p.type : presets.click.type;
    try {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = oscType;
      o.frequency.setValueAtTime(p.freq, ac.currentTime);
      // gentle pitch glide on open/close so it feels organic
      if (presetName === "open") o.frequency.exponentialRampToValueAtTime(p.freq * 1.4, ac.currentTime + p.dur);
      if (presetName === "close") o.frequency.exponentialRampToValueAtTime(p.freq * 0.7, ac.currentTime + p.dur);
      if (presetName === "success") o.frequency.exponentialRampToValueAtTime(p.freq * 1.5, ac.currentTime + p.dur);
      g.gain.setValueAtTime(0, ac.currentTime);
      g.gain.linearRampToValueAtTime(p.vol, ac.currentTime + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + p.dur);
      o.connect(g); g.connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + p.dur + 0.02);
    } catch {}
  }, []);

  return (
    <SoundCtx.Provider value={{ on, setOn, play }}>
      <SoundHoverHook />
      {children}
    </SoundCtx.Provider>
  );
}

// Auto-attach hover and click sound to elements with data-cursor="link" (debounced).
function SoundHoverHook() {
  const { play } = React.useContext(SoundCtx);
  React.useEffect(() => {
    let last = 0;
    const onOver = (e) => {
      const t = e.target?.closest?.("[data-cursor='link']");
      if (!t) return;
      const now = performance.now();
      if (now - last < 60) return;
      last = now;
      play("hover");
    };
    const onClick = (e) => {
      const t = e.target?.closest?.("button, a, [data-cursor='link']");
      if (!t) return;
      play("click");
    };
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    return () => {
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("click", onClick);
    };
  }, [play]);
  return null;
}

// ─────────────────────────────────────────────────────────────
// AnimatedNumber — count up on intersect with cubic ease.
// ─────────────────────────────────────────────────────────────
function AnimatedNumber({ value, duration = 1200, start = true }) {
  const m = String(value).match(/^([−+$]?)(-?\d+\.?\d*)(.*)$/);
  const prefix = m ? m[1] : "";
  const target = m ? parseFloat(m[2]) : 0;
  const suffix = m ? m[3] : "";
  const [n, setN] = React.useState(0);
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSeen(true); }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!seen || !start) return;
    let raf; const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setN(target * ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, start, target, duration]);

  const display = Number.isInteger(target) ? Math.round(n) : n.toFixed(1);
  const isNeg = String(value).startsWith("−") || target < 0;
  return <span ref={ref}>{prefix}{isNeg && !prefix ? "−" : ""}{Math.abs(display)}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────
// BlurIn — splits text into words, reveals with blur+slide once on intersect
// ─────────────────────────────────────────────────────────────
function BlurIn({ children, delay = 0, stagger = 0.04, tag = "span", className, style }) {
  const T = tag;
  const ref = React.useRef(null);
  const [go, setGo] = React.useState(false);
  // WHY useLayoutEffect + threshold 0: masked headline boxes can briefly measure zero height before
  // fonts/layout settle. Old logic used threshold 0.15 + coarse rect checks — observers never fired, so the
  // hero stayed at opacity 0 (looked “empty”).
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const tryReveal = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      if (r.height < 2) return false;
      const visible = r.bottom > -96 && r.top < vh + 96;
      if (visible) {
        setGo(true);
        return true;
      }
      return false;
    };

    if (tryReveal()) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting || e.intersectionRatio > 0) setGo(true);
        });
      },
      { threshold: 0, rootMargin: "120px 0px" },
    );
    io.observe(el);

    let rafA = 0;
    let rafB = 0;
    rafA = requestAnimationFrame(() => {
      rafB = requestAnimationFrame(() => {
        tryReveal();
      });
    });

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafA);
      cancelAnimationFrame(rafB);
    };
  }, []);
  const words = String(children).split(" ");
  return (
    <T ref={ref} className={className} style={style}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingRight: "0.22em", verticalAlign: "top", lineHeight: 1.05 }}>
          <span style={{
            display: "inline-block",
            transform: go ? "translateY(0)" : "translateY(110%)",
            filter: go ? "blur(0)" : "blur(8px)",
            opacity: go ? 1 : 0,
            transition: `transform .9s cubic-bezier(.2,.7,.2,1) ${delay + i * stagger}s, filter .7s ease ${delay + i * stagger}s, opacity .6s ease ${delay + i * stagger}s`,
          }}>{w}</span>
        </span>
      ))}
    </T>
  );
}

// ─────────────────────────────────────────────────────────────
// Reveal — opacity + slide on intersect
// ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 24, className, style }) {
  const ref = React.useRef(null);
  const [go, setGo] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const tryReveal = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      if (r.bottom > -96 && r.top < vh + 96) {
        setGo(true);
        return true;
      }
      return false;
    };

    if (tryReveal()) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting || e.intersectionRatio > 0) setGo(true);
        });
      },
      { threshold: 0, rootMargin: "120px 0px" },
    );
    io.observe(el);

    let rafA = 0;
    let rafB = 0;
    rafA = requestAnimationFrame(() => {
      rafB = requestAnimationFrame(() => {
        tryReveal();
      });
    });

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafA);
      cancelAnimationFrame(rafB);
    };
  }, []);
  return (
    <div ref={ref} className={className} style={{
      ...style,
      transform: go ? "translateY(0)" : `translateY(${y}px)`,
      opacity: go ? 1 : 0,
      transition: `transform .8s cubic-bezier(.2,.7,.2,1) ${delay}s, opacity .7s ease ${delay}s`,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// CommandMenu (⌘K)
// ─────────────────────────────────────────────────────────────
function CommandMenu({ theme, open, setOpen, items, onRun }) {
  const [q, setQ] = React.useState("");
  const [idx, setIdx] = React.useState(0);
  const inputRef = React.useRef(null);
  const { play } = React.useContext(SoundCtx);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setOpen((o) => { play(o ? "close" : "open"); return !o; });
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen, play]);

  React.useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);
  React.useEffect(() => { setQ(""); setIdx(0); }, [open]);

  const results = React.useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return items;
    return items.filter((it) =>
      it.label.toLowerCase().includes(s) ||
      (it.hint || "").toLowerCase().includes(s) ||
      (it.keywords || []).some((k) => k.toLowerCase().includes(s))
    );
  }, [q, items]);

  React.useEffect(() => { setIdx(0); }, [q]);

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); play("tick"); setIdx((i) => Math.min(results.length - 1, i + 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); play("tick"); setIdx((i) => Math.max(0, i - 1)); }
    if (e.key === "Enter" && results[idx]) { e.preventDefault(); onRun(results[idx]); setOpen(false); }
  };

  if (!open) return null;
  return createPortal(
    <div onClick={() => setOpen(false)} style={{
      position: "fixed", inset: 0, zIndex: 5000,
      background: "rgba(0,0,0,.4)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "14vh",
      animation: "fadeIn .18s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 600, maxWidth: "90vw",
        background: theme.surface, color: theme.ink,
        border: `1px solid ${theme.border}`, borderRadius: 14,
        boxShadow: "0 30px 80px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.18)",
        overflow: "hidden", fontFamily: theme.body,
        animation: "cmdIn .26s cubic-bezier(.2,.8,.2,1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 18px", borderBottom: `1px solid ${theme.border}` }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: .6 }}>
            <circle cx="7" cy="7" r="5" /><path d="M11 11l3 3" strokeLinecap="round" />
          </svg>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onInputKey}
            placeholder="Search sections, projects, actions…"
            style={{ flex: 1, border: 0, outline: 0, background: "transparent", color: theme.ink, fontSize: 15, fontFamily: "inherit" }} />
          <kbd style={{ fontSize: 11, color: theme.dim, border: `1px solid ${theme.border}`, padding: "2px 6px", borderRadius: 4 }}>esc</kbd>
        </div>
        <div style={{ maxHeight: 360, overflow: "auto", padding: 6 }}>
          {results.length === 0 ? (
            <div style={{ padding: "28px 16px", color: theme.dim, fontSize: 14, textAlign: "center" }}>No matches</div>
          ) : results.map((it, i) => (
            <div key={it.id} onMouseEnter={() => setIdx(i)} onClick={() => { onRun(it); setOpen(false); }}
              data-cursor="link"
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8,
                background: idx === i ? theme.hover : "transparent",
                transition: "background .08s",
              }}>
              <span style={{ fontSize: 13, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", color: theme.dim }}>{it.icon || "→"}</span>
              <span style={{ flex: 1, fontSize: 14 }}>{it.label}</span>
              {it.hint && <span style={{ fontSize: 12, color: theme.dim }}>{it.hint}</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 18px", borderTop: `1px solid ${theme.border}`, fontSize: 11, color: theme.dim, display: "flex", gap: 14, fontFamily: theme.mono }}>
          <span>↑↓ navigate</span><span>↵ select</span><span>⌘K toggle</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────
// AskAyush — chat via /api/chat (Anthropic on the server; see env on Vercel).
// ─────────────────────────────────────────────────────────────
function AskAyush({ theme, open, setOpen }) {
  const [msgs, setMsgs] = React.useState([
    { role: "assistant", content: "Hey — I'm Ayush's AI twin, trained on his resume and case studies. Ask me anything: how he thinks about 0→1, what he is building now, why he left Byju's. I'll answer honestly." },
  ]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scroller = React.useRef(null);
  const { play } = React.useContext(SoundCtx);

  const suggestions = [
    "What's your strongest 0→1 story?",
    "Why did the faith-tech chatbot work?",
    "What kind of role are you looking for?",
    "Tell me something that isn't in your resume.",
  ];

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    play("click");
    const next = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setBusy(true);
    try {
      const apiMessages = next
        .slice(1)
        .map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const fallback =
          data.error === "NO_KEY"
            ? "Hmm, I couldn't reach my brain just now. You can still email Ayush — he reads everything."
            : "Hmm, I couldn't reach my brain just now. Try again in a sec. You can still email Ayush — he reads everything.";
        setMsgs((m) => [...m, { role: "assistant", content: fallback }]);
        return;
      }
      setMsgs((m) => [...m, { role: "assistant", content: String(data.reply || "").trim() }]);
      play("success");
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Hmm, I couldn't reach my brain just now. Try again in a sec?" }]);
    } finally {
      setBusy(false);
    }
  };

  React.useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [msgs, busy]);

  if (!open) return null;
  return createPortal(
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 4000,
      width: 380, maxWidth: "calc(100vw - 48px)",
      height: 540, maxHeight: "calc(100vh - 48px)",
      background: theme.surface, color: theme.ink,
      border: `1px solid ${theme.border}`, borderRadius: 16,
      boxShadow: "0 24px 70px rgba(0,0,0,.28)",
      display: "flex", flexDirection: "column",
      fontFamily: theme.body,
      animation: "chatIn .3s cubic-bezier(.2,.8,.2,1)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: theme.accent, boxShadow: `0 0 8px ${theme.accent}` }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Ask Ayush</div>
          <div style={{ fontSize: 11, color: theme.dim }}>AI twin · trained on his work</div>
        </div>
        <button data-cursor="link" onClick={() => { setOpen(false); play("close"); }} style={{
          border: 0, background: "transparent", color: theme.dim, fontSize: 18,
          width: 28, height: 28, borderRadius: 6,
        }}>×</button>
      </div>

      <div ref={scroller} style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
            padding: "10px 13px", borderRadius: 12,
            fontSize: 13.5, lineHeight: 1.55,
            background: m.role === "user" ? theme.ink : theme.hover,
            color: m.role === "user" ? theme.surface : theme.ink,
            animation: "msgIn .3s cubic-bezier(.2,.8,.2,1)",
          }}>
            {m.role === "assistant" ? (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p style={{ margin: 0, marginBottom: 8 }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
                  em: ({ children }) => <em>{children}</em>,
                  ul: ({ children }) => <ul style={{ margin: "8px 0", paddingLeft: 20 }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ margin: "8px 0", paddingLeft: 20 }}>{children}</ol>,
                  li: ({ children }) => <li style={{ marginBottom: 4 }}>{children}</li>,
                  code: ({ children }) => <code style={{ background: "rgba(0,0,0,0.1)", padding: "2px 6px", borderRadius: 3, fontSize: "0.9em" }}>{children}</code>,
                }}
              >
                {m.content}
              </ReactMarkdown>
            ) : (
              m.content
            )}
          </div>
        ))}
        {busy && (
          <div style={{ alignSelf: "flex-start", padding: "10px 13px", borderRadius: 12, background: theme.hover, display: "flex", gap: 4 }}>
            <Dot theme={theme} d={0} /><Dot theme={theme} d={0.15} /><Dot theme={theme} d={0.3} />
          </div>
        )}
        {msgs.length <= 1 && !busy && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {suggestions.map((s) => (
              <button key={s} data-cursor="link" onClick={() => send(s)} style={{
                fontSize: 12, padding: "6px 10px", borderRadius: 999,
                border: `1px solid ${theme.border}`, background: "transparent", color: theme.ink,
                fontFamily: "inherit", transition: "background .15s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = theme.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >{s}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${theme.border}` }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          border: `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 12px",
          background: theme.hover,
        }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder="Ask anything…"
            style={{ flex: 1, border: 0, outline: 0, background: "transparent", color: theme.ink, fontSize: 13.5, fontFamily: "inherit" }} />
          <button data-cursor="link" onClick={() => send()} disabled={!input.trim() || busy} style={{
            border: 0, background: theme.ink, color: theme.surface,
            width: 28, height: 28, borderRadius: 6,
            opacity: input.trim() && !busy ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Dot({ theme, d }) {
  return <span style={{
    width: 6, height: 6, borderRadius: 3, background: theme.dim,
    animation: `blink 1.2s ease ${d}s infinite`,
    display: "inline-block", alignSelf: "center",
  }} />;
}

// ─────────────────────────────────────────────────────────────
// useDragReorder — vertical list reorder by id
// ─────────────────────────────────────────────────────────────
function useDragReorder(order, setOrder) {
  const ref = React.useRef(null);
  const onStart = (id) => (e) => {
    e.preventDefault();
    const items = Array.from(ref.current.querySelectorAll("[data-item]"));
    const home = items.map((el) => ({ el, id: el.dataset.item, y: el.getBoundingClientRect().top }));
    const meIdx = order.indexOf(id);
    if (meIdx < 0) return;
    const meEl = home[meIdx].el;
    const startY = e.clientY;
    let live = order.slice();
    meEl.style.zIndex = "10";
    meEl.style.transition = "none";
    meEl.style.pointerEvents = "none";
    const move = (ev) => {
      const dy = ev.clientY - startY;
      meEl.style.transform = `translateY(${dy}px)`;
      const cur = home[meIdx].y + dy;
      let nearest = meIdx, best = Infinity;
      home.forEach((h, i) => { const d = Math.abs(h.y - cur); if (d < best) { best = d; nearest = i; } });
      if (live.indexOf(id) !== nearest) {
        live = order.filter((k) => k !== id);
        live.splice(nearest, 0, id);
        home.forEach((h, i) => {
          if (h.id === id) return;
          const slot = live.indexOf(h.id);
          h.el.style.transform = `translateY(${home[slot].y - h.y}px)`;
        });
      }
    };
    const up = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      meEl.style.zIndex = "";
      meEl.style.pointerEvents = "";
      home.forEach((h) => { h.el.style.transition = "none"; h.el.style.transform = ""; });
      if (live.join("|") !== order.join("|")) setOrder(live);
      requestAnimationFrame(() => { home.forEach((h) => h.el.style.transition = ""); });
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  };
  return { ref, onStart };
}

// ─────────────────────────────────────────────────────────────
// One-time keyframe injection
// ─────────────────────────────────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("shared-kf")) {
  const s = document.createElement("style");
  s.id = "shared-kf";
  s.textContent = `
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes cmdIn { from { opacity: 0; transform: translateY(-8px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
    @keyframes chatIn { from { opacity: 0; transform: translateY(16px) scale(.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
    @keyframes msgIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes blink { 0%, 100% { opacity: .3 } 50% { opacity: 1 } }
    @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
    @keyframes labelIn { from { opacity: 0; transform: translate(-8px, -4px) scale(.92) } to { opacity: 1; transform: translate(0,0) scale(1) } }
    @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 currentColor } 50% { box-shadow: 0 0 0 6px rgba(0,0,0,0) } }
    html, body { margin: 0; padding: 0; }
    * { box-sizing: border-box; }
    ::selection { background: currentColor; color: var(--sel-fg, white); }
  `;
  document.head.appendChild(s);
}

export {
  MagneticCursor,
  AnimatedNumber,
  BlurIn,
  Reveal,
  CommandMenu,
  AskAyush,
  SoundProvider,
  SoundCtx,
  useDragReorder,
};
