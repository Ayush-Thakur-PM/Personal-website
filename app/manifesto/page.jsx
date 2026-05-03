"use client";

import { Manifesto } from "@/components/Portfolio";
import { PageScaffold } from "@/components/PageScaffold";
import { portfolio } from "@/lib/portfolio-data";
import { PORTFOLIO_THEME } from "@/lib/theme";

export default function ManifestoPage() {
  return (
    <PageScaffold theme={PORTFOLIO_THEME} P={portfolio}>
      <Manifesto theme={PORTFOLIO_THEME} P={portfolio} />
    </PageScaffold>
  );
}
