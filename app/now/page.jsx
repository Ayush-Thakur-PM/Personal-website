"use client";

import { PageScaffold } from "@/components/PageScaffold";
import { NowOffTheClock } from "@/components/NowOffTheClock";
import { portfolio } from "@/lib/portfolio-data";
import { PORTFOLIO_THEME } from "@/lib/theme";

export default function NowPage() {
  return (
    <PageScaffold theme={PORTFOLIO_THEME} P={portfolio}>
      <NowOffTheClock portfolio={portfolio} theme={PORTFOLIO_THEME} />
    </PageScaffold>
  );
}
