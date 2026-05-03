"use client";

import React, { useState } from "react";
import { AskAyush } from "./shared";
import { ThemeStyles } from "./ThemeStyles";
import { SiteChrome } from "./SiteChrome";

/**
 * Wraps routed pages with shared theme tokens (via ThemeStyles),
 * persistent nav/audio/search, and the Ask Ayush overlay.
 */
export function PageScaffold({ theme, P, children }) {
  const [askOpen, setAskOpen] = useState(false);
  const openAsk = () => setAskOpen(true);
  const mainContent = typeof children === "function" ? children(openAsk) : children;

  return (
    <div style={{ background: theme.bg, color: theme.ink, fontFamily: theme.body, minHeight: "100vh", position: "relative" }}>
      <ThemeStyles theme={theme} />
      <div className="grain" />
      <SiteChrome theme={theme} P={P} onAskClick={() => setAskOpen(true)} floatingAskHidden={askOpen}>
        <main style={{ paddingTop: "clamp(88px, 14vw, 104px)" }}>{mainContent}</main>
      </SiteChrome>
      <AskAyush theme={theme} open={askOpen} setOpen={setAskOpen} />
    </div>
  );
}
