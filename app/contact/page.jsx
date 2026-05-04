"use client";

import { ContactPage } from "@/components/Portfolio";
import { PageScaffold } from "@/components/PageScaffold";
import { portfolio } from "@/lib/portfolio-data";
import { PORTFOLIO_THEME } from "@/lib/theme";

export default function ContactRoutePage() {
  return (
    <PageScaffold theme={PORTFOLIO_THEME} P={portfolio}>
      <ContactPage theme={PORTFOLIO_THEME} P={portfolio} />
    </PageScaffold>
  );
}
