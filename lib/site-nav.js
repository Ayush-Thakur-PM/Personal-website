/**
 * Primary routes — single source for header + home wayfinding so labels stay aligned.
 */
export const SITE_NAV = [
  { href: "/", label: "Home", match: (p) => p === "/", hint: null },
  {
    href: "/work",
    label: "Work",
    match: (p) => p.startsWith("/work"),
    hint: "Case studies · impact",
  },
  {
    href: "/timeline",
    label: "Timeline",
    match: (p) => p.startsWith("/timeline"),
    hint: "Roles · trajectory",
  },
  {
    href: "/manifesto",
    label: "Manifesto",
    match: (p) => p.startsWith("/manifesto"),
    hint: "How I think",
  },
  {
    href: "/now",
    label: "Now",
    match: (p) => p.startsWith("/now"),
    hint: "Shelf · screens · rhythms",
  },
];

/** Sections linked from home (excluding Home itself — that’s redundant in-page). */
export const HOME_DESTINATIONS = SITE_NAV.filter((n) => n.href !== "/" && n.hint);
