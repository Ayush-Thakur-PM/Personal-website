"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { HomeWayfinding } from "@/components/HomeWayfinding";
import { Hero, Contact, Footer } from "@/components/Portfolio";
import { SoundCtx } from "@/components/shared";
import { HOME_DESTINATIONS } from "@/lib/site-nav";
import { portfolio } from "@/lib/portfolio-data";
import { PORTFOLIO_THEME } from "@/lib/theme";

/** Home hero + wayfinding cards + contact; mirrors header routes in editorial form. */
export function HomeBody({ openAsk }) {
  const router = useRouter();
  const { play } = useContext(SoundCtx);

  return (
    <>
      <Hero
        theme={PORTFOLIO_THEME}
        P={portfolio}
        play={play}
        siteLinks={HOME_DESTINATIONS}
        onExplore={() => router.push("/work")}
        onAsk={openAsk}
      />
      <HomeWayfinding theme={PORTFOLIO_THEME} />
      <Contact theme={PORTFOLIO_THEME} P={portfolio} onAsk={openAsk} />
      <Footer theme={PORTFOLIO_THEME} P={portfolio} />
    </>
  );
}
