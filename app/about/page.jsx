"use client";

import { AboutPage } from "@/components/Portfolio";
import { PageScaffold } from "@/components/PageScaffold";
import { portfolio } from "@/lib/portfolio-data";
import { PORTFOLIO_THEME } from "@/lib/theme";

export default function AboutRoutePage() {
  return (
    <PageScaffold theme={PORTFOLIO_THEME} P={portfolio}>
      <AboutPage theme={PORTFOLIO_THEME} P={portfolio} />
    </PageScaffold>
  );
}
