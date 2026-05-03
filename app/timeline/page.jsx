"use client";

import { useState, useContext } from "react";
import { Timeline, RoleOverlay } from "@/components/Portfolio";
import { PageScaffold } from "@/components/PageScaffold";
import { SoundCtx } from "@/components/shared";
import { portfolio } from "@/lib/portfolio-data";
import { PORTFOLIO_THEME } from "@/lib/theme";

export default function TimelinePage() {
  const { play } = useContext(SoundCtx);
  const [tlOpen, setTlOpen] = useState(null);

  return (
    <PageScaffold theme={PORTFOLIO_THEME} P={portfolio}>
      <>
        <Timeline theme={PORTFOLIO_THEME} P={portfolio} onOpenRole={(i) => { setTlOpen(i); play("open"); }} />
        {tlOpen != null && (
          <RoleOverlay theme={PORTFOLIO_THEME} role={portfolio.timeline[tlOpen]} onClose={() => { setTlOpen(null); play("close"); }} />
        )}
      </>
    </PageScaffold>
  );
}
