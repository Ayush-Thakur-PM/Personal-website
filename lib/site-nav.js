/**
 * Primary routes — single source for header + home wayfinding so labels stay aligned.
 */
export const SITE_NAV = [
  { href: "/", label: "Home", match: (p) => p === "/", hint: null },
  {
    href: "/work",
    label: "Work",
    match: (p) => p.startsWith("/work"),
    hint: "Things I've shipped — Pokus, Truva, Ivy, BYJU'S.",
  },
  {
    href: "/timeline",
    label: "Trajectory",
    match: (p) => p.startsWith("/timeline"),
    hint: "Where the arc bent — ops, scale, founding PM bets.",
  },
  {
    href: "/about",
    label: "Philosophy",
    match: (p) => p.startsWith("/about") || p.startsWith("/manifesto"),
    hint: "How I got here, what I obsess over.",
  },
  {
    href: "/now",
    label: "Current",
    match: (p) => p.startsWith("/now"),
    hint: "Songs on loop, books on the nightstand, life this season.",
  },
  {
    href: "/contact",
    label: "Contact",
    match: (p) => p.startsWith("/contact"),
    hint: "Have a problem worth solving? Let's speak.",
  },
];

/** Home hero + four-tile band only — keeps Contact available in the chrome without duplicating tiles. */
const HOME_SECTION_HREFS = ["/work", "/timeline", "/about", "/now"];
export const HOME_DESTINATIONS = SITE_NAV.filter(
  (n) => n.href !== "/" && n.hint && HOME_SECTION_HREFS.includes(n.href),
);
