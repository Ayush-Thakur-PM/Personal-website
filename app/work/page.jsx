"use client";

import { useEffect, useRef, useState, useContext } from "react";
import {
  ProjectOverlay,
  Work,
} from "@/components/Portfolio";
import { PageScaffold } from "@/components/PageScaffold";
import { SoundCtx } from "@/components/shared";
import { portfolio } from "@/lib/portfolio-data";
import { PORTFOLIO_THEME } from "@/lib/theme";

export default function WorkPage() {
  const { play } = useContext(SoundCtx);
  const [projectOrder, setProjectOrder] = useState(() => portfolio.projects.map((p) => p.id));
  const [expanded, setExpanded] = useState(null);
  const cardRects = useRef({});

  useEffect(() => {
    const id = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (!id) return;
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const expandedProject = expanded ? portfolio.projects.find((p) => p.id === expanded) : null;

  return (
    <PageScaffold theme={PORTFOLIO_THEME} P={portfolio}>
      <Work theme={PORTFOLIO_THEME} projects={portfolio.projects} order={projectOrder}
        setOrder={setProjectOrder} setExpanded={setExpanded} cardRects={cardRects} />

      {expandedProject && (
        <ProjectOverlay
          theme={PORTFOLIO_THEME}
          project={expandedProject}
          origin={cardRects.current[expandedProject.id]}
          onClose={() => { setExpanded(null); play("close"); }}
        />
      )}
    </PageScaffold>
  );
}
