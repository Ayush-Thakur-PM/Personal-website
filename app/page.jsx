"use client";

import Portfolio from "@/components/Portfolio";
import { MagneticCursor, SoundProvider } from "@/components/shared";
import { portfolio } from "@/lib/portfolio-data";
import { PORTFOLIO_THEME } from "@/lib/theme";

export default function Page() {
  return (
    <SoundProvider>
      <MagneticCursor />
      <Portfolio theme={PORTFOLIO_THEME} P={portfolio} />
    </SoundProvider>
  );
}
