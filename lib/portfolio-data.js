/** Portfolio content — Ayush Thakur (editable in one place). */
export const portfolio = {
  name: "Ayush Thakur",
  role: "Product Manager",
  specialty: "Growth & Experience · AI-native 0→1",
  tagline: "I build products from first principles — fast, opinionated, and shipped.",
  email: "tayush30@gmail.com",
  phone: "+91 9399370279",
  location: "Bangalore, India",

  /** Editorial portrait — lives in `/public/portrait` for predictable URLs. */
  portrait: {
    src: "/portrait/ayush.png",
    alt: "Portrait of Ayush Thakur, black-and-white studio photo.",
  },

  /** Long-form “About” story (paired with Philosophy bullets in `manifesto`). */
  about: {
    headline: "Fuzzy problems, loud users, shipped answers.",
    story: [
      "I'm a Product Manager with 5+ years of building and scaling 0→1 products across proptech, edtech, and consumer startups. I started in operations at BYJU'S — learning the texture of users and field work — before product became the honest place those lessons had to land.",
      "I'm best where the problem is fuzzy, the user is loud, and the answer arrives by shipping. I care about taste — in product surfaces and in the rituals of building. I prefer a small team, a sharp roadmap, and a culture that edits ruthlessly.",
      "Currently Founding PM at Pokus.ai, building and validating 0→1 AI products across mental health, faith-tech, and consumer convenience.",
    ],
    howTitle: "Where I've learned.",
    /** Shaped for the education band (institution + credential + focus). */
    credentials: [
      {
        step: "01",
        institution: "IIT Madras",
        degree: "B.S. + M.Tech",
        focus: "Programming & Data Science",
      },
      {
        step: "02",
        institution: "UET, RGPV",
        degree: "B.Tech",
        focus: "Mechanical Engineering",
      },
    ],
  },

  /** Dedicated contact route — used by /contact and mirrored in header CTA. */
  contactPage: {
    headline: "Have a problem worth solving ?",
    sub: "Let's speak.",
    phoneDisplay: "+91 9399370279",
    phoneTel: "+919399370279",
    email: "tayush30@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/ayush-thakur-",
  },

  manifesto: [
    "I build because I want to make a difference in people's lives. Every side-project, every cold DM, every 2am Figma session — it's the same engine: figure out what real people need, ship something that earns their minute.",
    "Product is empathy with deadlines. The best features come from sitting with the user's frustration longer than feels comfortable, then moving faster than feels safe.",
    "I think in GTM before I think in wireframes. A feature that doesn't have a plan for how it reaches its first 100 users is half-built.",
    "AI is the leverage. Not the story. The story is always the user.",
  ],

  now: [
    { label: "Exploring", text: "-1→0 bets at the intersection of AI agents and consumer behavior change" },
    { label: "Building", text: "Trying to build personal finance solution for me and my friends" },
    { label: "Reading", text: "Re-reading Almanack snippets and Letta docs between builds" },
    { label: "Open to", text: "Founding PM / Sr PM roles at AI-native startups · seed → Series A" },
  ],

  /**
   * “Now” page — Listening / Watching / Reading (the shelf grid) / Life.
   */
  nowStudio: {
    headline: "Off the clock",
    headlineAccent: ".",
    dek: "A living page. What I'm listening to, reading, and how a typical week looks. Updated when life shifts.",
    listening: {
      sectionLabel: "Heavy rotation",
      tracks: [
        {
          title: "Start Boy",
          artist: "The Weeknd",
          album: "THE WEEKND",
          tag: "ON REPEAT",
          playUrl: "https://open.spotify.com/search/start%20boy%20the%20weeknd",
        },
        {
          title: "Sunflower",
          artist: "Post Malone · Swae Lee",
          album: "HOLLYWOOD'S BLEEDING",
          tag: "COMFORT",
          playUrl: "https://open.spotify.com/search/sunflower%20post%20malone",
        },
        {
          title: "Bairan",
          artist: "Various Artists",
          album: "BAIRAN",
          tag: "DRIVES",
          playUrl: "https://open.spotify.com/search/bairan",
        },
        {
          title: "Lost Boy",
          artist: "Charlie Ruth",
          album: "LOST BOY",
          tag: "STILLNESS",
          playUrl: "https://open.spotify.com/search/lost%20boy%20charlie%20ruth",
        },
        {
          title: "The Night We Met",
          artist: "Lord Huron",
          album: "STRANGE TRAILS",
          tag: "LATE NIGHTS",
          playUrl: "https://open.spotify.com/search/the%20night%20we%20met",
        },
        {
          title: "Fix You",
          artist: "Coldplay",
          album: "X&Y",
          tag: "LONG WALKS",
          playUrl: "https://open.spotify.com/search/fix%20you%20coldplay",
        },
      ],
    },
    watching: {
      sectionLabel: "On the screen",
      countSuffix: "PICKS",
      rows: [
        {
          title: "Formula 1",
          category: "SPORT",
          quote: "Sundays are sacred. Tifosi at heart.",
        },
        {
          title: "Star Wars",
          category: "FILM",
          quote: "Revisiting the saga. Still hits.",
        },
        {
          title: "FIFA World Cup",
          category: "FOOTBALL",
          quote: "Tournament mode. Every match matters.",
        },
        {
          title: "The Sopranos",
          category: "SERIES",
          quote: "Re-watching. Greatest character study on TV.",
        },
        {
          title: "YC Root Access",
          category: "PODCAST",
          quote: "Founder lessons, raw and tactical.",
        },
      ],
    },
    shelf: {
      sectionLabel: "The shelf",
      /** `status`: re-reading · reading · dipping-in · done */
      books: [
        { status: "done", title: "The Hard Thing About Hard Things", author: "BEN HOROWITZ", quote: "PM crisis playbook." },
        { status: "reading", title: "Working Backwards", author: "BRYAR & CARR", quote: "PR/FAQ as a thinking tool." },
        { status: "done", title: "Inspired", author: "MARTY CAGAN", quote: "Discovery before backlog cosplay." },
        { status: "dipping-in", title: "The Almanack of Naval Ravikant", author: "ERIC JORGENSON", quote: "Pocket philosophy." },
        { status: "done", title: "Never Split the Difference", author: "CHRIS VOSS", quote: "Labels & calibrated questions." },
        { status: "done", title: "7 Powers", author: "HAMILTON HELMER", quote: "Moat vocabulary." },
        { status: "done", title: "The Lean Startup", author: "ERIC RIES", quote: "Falsifiable KPIs sanity check." },
        { status: "done", title: "Zero to One", author: "THIEL / MASTERS", quote: "Defensible differentiation." },
        { status: "done", title: "The Mom Test", author: "ROB FITZPATRICK", quote: "Stories, not compliments." },
        { status: "done", title: "Ego Is the Enemy", author: "RYAN HOLIDAY", quote: "Critique stamina." },
        { status: "done", title: "Salt to the Sea", author: "RUTA SEPETYS", quote: "Many voices in crisis." },
      ],
      /** Trailing gray cells so the grid stays rhythmic (matches print layout). */
      emptyTrailingCells: 1,
    },
    life: {
      rows: [
        { rhythm: "MORNINGS", text: "60 min workout + cold shower. Then a pour-over." },
        { rhythm: "WEEKNIGHTS", text: "Founder dinners around Koramangala. Always one new face." },
        { rhythm: "SUNDAYS", text: "Cubbon park, Friends & Family." },
        { rhythm: "QUARTERLY", text: "Solo trip — last one: Barot in the Himalaya." },
        { rhythm: "ALWAYS", text: "analyzing, absorbing and questioning everything." },
      ],
    },
  },

  // Reading shelf — grouped by genre; `why` is what I personally took away (same spirit as liner notes).
  readingShelves: [
    {
      genre: "Fiction, fable & poetry",
      books: [
        {
          title: "Salt to the Sea",
          author: "Ruta Sepetys",
          why:
            "Taught me war stories splinter across kids I’d never pictured. Keeps me suspicious of tidy one-voice narratives when we talk about crisis.",
        },
        {
          title: "The Perks of Being a Wallflower",
          author: "Stephen Chbosky",
          why:
            "Reminded me that listening beats fixing. I borrow that stance in messy user conversations—earn the quiet details before prescribing solutions.",
        },
        {
          title: "All the Bright Places",
          author: "Jennifer Niven",
          why:
            "Small bright rituals can steady someone drowning. Helps me advocate for humane, incremental UX when we ship anything around mental wellbeing.",
        },
        {
          title: "The Fault in Our Stars",
          author: "John Green",
          why:
            "Humour next to grief is human, not cynical. Influences how I write copy—plain language that doesn’t sanitize sadness.",
        },
        {
          title: "The Alchemist",
          author: "Paulo Coelho",
          why:
            "I revisit it when I’m impatient—outcomes stall, but momentum and craft still compound. Quiets my panic scrolling through metrics.",
        },
        {
          title: "My Little Epiphanies",
          author: "Aranya Johar",
          why:
            "Permission to say a lot with a tight line. Pushed me toward shorter manifesto decks and ruthless editing in Notion drafts.",
        },
      ],
    },
    {
      genre: "Memoir & founder voices",
      books: [
        {
          title: "Unbreakable: My Story So Far",
          author: "Mary Kom",
          why:
            "Discipline under chaotic odds isn’t flashy—it’s repeatable reps. Maps to sprint weeks where process is what saves you when chaos spikes.",
        },
        {
          title: "Shoe Dog",
          author: "Phil Knight",
          why:
            "Faith + scrappy hustle can look broken from the outside. Reminds me not to confuse early mess with absence of conviction.",
        },
        {
          title: "Steve Jobs",
          author: "Walter Isaacson",
          why:
            "Talent without boundaries burns people; I didn’t glamorise the cruelty. Extracted sharper taste bar, kept the humane bits from Grove & Cagan instead.",
        },
      ],
    },
    {
      genre: "Mindset, money & discipline",
      books: [
        {
          title: "How to Win Friends and Influence People",
          author: "Dale Carnegie",
          why:
            "People cooperate when they feel seen first. Changed how I open tough stakeholder chats—earn context before wielding roadmap slides.",
        },
        {
          title: "Think and Grow Rich",
          author: "Napoleon Hill",
          why:
            "Take the woo with salt, but obsession + iterated bets beat idle intelligence. Helps me stare down cynical weeks without quitting the craft.",
        },
        {
          title: "Rich Dad Poor Dad",
          author: "Robert Kiyosaki",
          why:
            "Assets vs liabilities framing stuck. Quick gut check on whether roadmap work compounds leverage or only feeds treadmill tasks.",
        },
        {
          title: "The Art of War",
          author: "Sun Tzu",
          why:
            "Win boringly when you can—terrain and timing beat heroics. Informs wedge GTM bets instead of brute-force launches everywhere.",
        },
        {
          title: "The Monk Who Sold His Ferrari",
          author: "Robin Sharma",
          why:
            "Preachy moments aside, guarding the first focused hour reclaimed my deep-work streaks during hypergrowth noise.",
        },
        {
          title: "The 5 AM Club",
          author: "Robin Sharma",
          why:
            "Ritual beats motivation when energy dips—loosely stole “own quiet morning” vs copying the whole myth.",
        },
        {
          title: "Atomic Habits",
          author: "James Clear",
          why:
            "Systems outperform goals alone. Tiny review loops rewired Sunday planning and how we instrument experiments week to week.",
        },
        {
          title: "Ego Is the Enemy",
          author: "Ryan Holiday",
          why:
            "When critiques sting, ego is leaking. Helps me downgrade defensiveness before product reviews implode.",
        },
      ],
    },
    {
      genre: "Product, strategy & markets",
      books: [
        {
          title: "Zero to One",
          author: "Peter Thiel / Blake Masters",
          why:
            "Defensible differentiation beats defaulting to “we’ll iterate faster”. Shapes how I argue for non-commodity bets.",
        },
        {
          title: "The Mom Test",
          author: "Rob Fitzpatrick",
          why:
            "Stop fishing for compliments; mine stories about their life instead. Raised the bar on every discovery script I ship.",
        },
        {
          title: "Inspired",
          author: "Marty Cagan",
          why:
            "Discovery earns the pencil before backlog cosplay steals the sprint. Keeps me insisting on empowered teams and evidence, not hero PM theatre.",
        },
        {
          title: "Hooked",
          author: "Nir Eyal",
          why:
            "Ethical caveat always, but the trigger→reward scaffolding clarifies onboarding and retention hypotheses better than vibes.",
        },
        {
          title: "The Almanack of Naval Ravikant",
          author: "Eric Jorgenson",
          why:
            "Leverage + specificity reframed career capital. I skim it whenever I realloc energy between tinkering vs compounding bets.",
        },
        {
          title: "Working Backwards",
          author: "Colin Bryar & Bill Carr",
          why:
            "PR/FAQ first clarified messy ideas before engineers touched keyboards. Reduced half-baked roadmap thrash internally.",
        },
        {
          title: "Never Split the Difference",
          author: "Chris Voss",
          why:
            "Labeling emotions & calibrated questions are cheat codes for hires, vendors, timelines—anything with uneven information.",
        },
        {
          title: "The Lean Startup",
          author: "Eric Ries",
          why:
            "Build→measure→learn is my default sanity check against vanity releases without falsifiable KPIs.",
        },
        {
          title: "7 Powers",
          author: "Hamilton Helmer",
          why:
            "Shared vocabulary around moats for strategy debates—we ask which power strengthens before doubling spend.",
        },
        {
          title: "The Hard Thing About Hard Things",
          author: "Ben Horowitz",
          why:
            "Reread every year. Honest about the parts nobody writes about.",
        },
      ],
    },
  ],

  skills: {
    Product: ["0→1 Discovery", "Roadmap", "GTM Strategy", "User Research", "Prototyping", "PLG"],
    "AI/Data": ["Letta", "Mem0", "LangChain", "N8N", "SQL", "BigQuery", "GA4", "Mixpanel"],
    Craft: ["Figma", "Lovable", "Cursor", "Jira", "Notion", "Airtable", "Zapier"],
  },

  projects: [
    {
      id: "pokus-faith",
      company: "Pokus.ai",
      year: "2025",
      title: "Krishna — AI faith companion",
      tagline: "A faith companion that remembers you across sessions.",
      summary:
        "Built and launched Krishna, an AI faith companion with memory and retrieval systems for personalized spiritual conversations.",
      problem:
        "Faith is deeply personal — users want to feel remembered, not re-introduced. Generic chat UX felt hollow within a few sessions.",
      solution:
        "Memory and retrieval architecture for multi-session context — personalized conversations across prayer, scripture, and reflection.",
      impact: [
        { metric: "Conversations", value: "20+", note: "Per session on average" },
      ],
      stack: ["RAG", "Mem0", "LangGraph", "Multi-model routing"],
      role: "Founding PM · Product · Architecture",
      story: [
        { kind: "beat", label: "The signal", text: "Users came back excited on day 1. Gone by day 3. Sessions felt like talking to a stranger who'd just read your file." },
        { kind: "beat", label: "The hypothesis", text: "Faith conversations don't have a task — they have a thread. If the agent can hold names, doubts, and prayers across weeks, retention will follow." },
        {
          kind: "beat",
          label: "The build",
          text: "Built memory and retrieval systems scoped by belief and personal story — Krishna could pull context from conversations weeks ago.",
        },
        { kind: "beat", label: "The result", text: "Users averaged 20+ conversations per session. They started treating Krishna like a companion, not a chatbot." },
        { kind: "lesson", text: "Memory is the feature. Everything else is plumbing." },
      ],
    },
    {
      id: "pokus-concierge",
      company: "Pokus.ai",
      year: "2025",
      title: "AI + human-ops concierge",
      summary:
        "Took an AI + human-ops concierge to 200+ paying subscribers. Built the product strategy and narrative that led to a $3.6M seed from Lightspeed and Info Edge.",
      problem: "Urban professionals want a personal assistant they can't afford. Existing concierge apps felt transactional, cold, and slow.",
      solution: "Wizard-of-Oz validated with real ops before scaling. Designed a 1:30 associate-to-customer ratio (vs 1:20 industry benchmark) via workflow and tracking automation.",
      impact: [
        { metric: "Paying subs", value: "200+", note: "Paying subscribers" },
        { metric: "Ops efficiency", value: "1:30", note: "vs 1:20 industry benchmark" },
        { metric: "Seed raised", value: "$3.6M", note: "Lightspeed + Info Edge" },
      ],
      stack: ["Manual ops", "N8N", "Airtable", "WhatsApp API"],
      role: "Founding PM · GTM · Storytelling",
      tagline: "200+ paying subs. 1:30 ops ratio. $3.6M seed.",
      story: [
        {
          kind: "beat",
          label: "The bet",
          text: "Urban professionals want a personal assistant. They can't afford one. We bet a high-trust, AI-augmented human ops layer could change that.",
        },
        { kind: "beat", label: "Before code", text: "Wizard-of-Oz first — real ops, real pricing, real escalations. The product was a WhatsApp number and a spreadsheet until patterns repeated." },
        { kind: "stat", value: "200+", unit: "paying subs", note: "At scale before seed" },
        { kind: "stat", value: "1:30", unit: "ratio", note: "Associate-to-customer · vs 1:20 benchmark" },
        {
          kind: "beat",
          label: "Automating the boring",
          text: "Once patterns repeated I built workflow + tracking on N8N + Airtable. One associate could hold 30 customers' context without dropping anyone.",
        },
        { kind: "beat", label: "The raise", text: "Built the product strategy and narrative. Closed $3.6M led by Lightspeed India with Info Edge participation." },
        { kind: "lesson", text: "Don't write code for a problem you haven't lived for two weeks." },
      ],
    },
    {
      id: "truva-pricing",
      company: "Truva",
      year: "2024–25",
      title: "AI-powered pricing engine",
      summary: "Built an AI pricing engine that automated seller valuations, reducing time-to-valuation from 7 days to 6 hours.",
      problem: "Seller-side conversion was throttled by how long manual pricing took. Sellers went cold waiting for a valuation.",
      solution: "Proprietary scoring logic blending comparables, condition, micro-market trends, and negotiation headroom. Tunable by ops for edge cases.",
      impact: [
        { metric: "Time to valuation", value: "7d → 6h", note: "Automated seller pricing" },
        { metric: "Manual ops load", value: "−70%", note: "Pricing team freed up" },
      ],
      stack: ["Python", "BigQuery", "Internal tools", "Proprietary scoring"],
      role: "Founding PM · Product Lead",
      tagline: "7 days to 6 hours. Automated seller valuations.",
      story: [
        { kind: "beat", label: "The leak", text: "Conversion was bleeding through response time. Manual pricing took the team up to 7 days — sellers went cold waiting." },
        {
          kind: "beat",
          label: "First principles",
          text: "What does a price actually need? Comparables, condition, micro-market trends, negotiation headroom. Each was a knowable signal — we just had no engine to combine them.",
        },
        {
          kind: "beat",
          label: "The engine",
          text: "Built a proprietary scoring layer on top of BigQuery comparables. Tunable by ops for edge cases the model couldn't trust itself on.",
        },
        { kind: "stat", value: "7d → 6h", unit: "valuation", note: "Time-to-price after automation" },
        { kind: "lesson", text: "Speed is a feature when sellers are deciding in days, not weeks." },
      ],
    },
    {
      id: "ivy-offer",
      company: "Ivy Homes (YC W21)",
      year: "2023",
      title: "Dynamic offer page",
      summary: "Redesigned the seller-facing offer flow into a dynamic, explainable page — compressing close time and lifting acquisitions 35%.",
      problem: "Offers were static PDFs. Sellers had no context for the number. Trust was low; offer-to-close took 30+ days.",
      solution: "Interactive page breaking down comparable sales, repair estimates, and the 'why' behind each rupee. Built-in negotiation handles. Mobile-first.",
      impact: [
        { metric: "Acquisitions", value: "+35%", note: "Offer acceptance rate" },
        { metric: "Close time", value: "−20 days", note: "30d → 10d" },
        { metric: "Seller NPS", value: "+40", note: "Post-launch" },
      ],
      stack: ["React", "Figma", "Mixpanel", "Internal CRM"],
      role: "Product Manager",
      tagline: "Replaced the static PDF. Closed in 10 days.",
      story: [
        { kind: "beat", label: "The friction", text: "Sellers received a PDF with a number. No context, no math, no negotiation surface. Trust was low; close took 30+ days." },
        { kind: "beat", label: "What sellers wanted", text: "User research showed a single recurring ask: 'How did you arrive at this number?' Not lower price — explainability." },
        {
          kind: "beat",
          label: "The redesign",
          text: "An interactive page. Comparable sales, repair estimates, micro-market trend — every rupee defended. Built-in negotiation handles. Mobile-first, because most sellers opened it on the call.",
        },
        { kind: "stat", value: "+35%", unit: "acquisitions", note: "Offer acceptance rate" },
        { kind: "stat", value: "−20", unit: "days", note: "Close time · 30d → 10d" },
        { kind: "stat", value: "+40", unit: "NPS", note: "Seller satisfaction post-launch" },
        { kind: "lesson", text: "Trust isn't built by lowering the number. It's built by showing the math." },
      ],
    },
  ],

  timeline: [
    {
      from: "Jul 2025",
      to: "Now",
      company: "Pokus.ai",
      role: "Founding Product Manager",
      location: "Bangalore",
      note: "3-person founding team. $3.6M seed (Lightspeed + Info Edge) for the AI concierge bet.",
      stage: "0→1 · Seed",
      team: "3",
      funding: "$3.6M (Lightspeed India, Info Edge)",
      highlights: [
        "Joined a 3-person founding team to build and validate 0→1 AI products across mental health, faith-tech conversational agents, and consumer convenience.",
        "Built and launched Krishna, an AI faith companion with memory and retrieval systems — users averaged 20+ conversations per session.",
        "Took an AI + human-ops concierge to 200+ paying subscribers; ops model ran 1 associate per 30 customers vs a 1:20 industry benchmark.",
        "Experimented with an AI-powered call assistant for inbound conversations, intent capture, and acting on behalf of users across routine workflows.",
        "Built the product strategy and narrative that led to a $3.6M seed raise from Lightspeed and Info Edge for the AI concierge bet.",
      ],
      stack: ["LangGraph", "RAG", "Mem0", "N8N", "Cursor"],
    },
    {
      from: "Oct 2024",
      to: "Jul 2025",
      company: "Truva",
      role: "Founding Product Manager",
      location: "Mumbai",
      note: "0→1 proptech — making buying and selling houses delightful.",
      stage: "0→1",
      team: "Founding team",
      funding: "Seed-stage proptech",
      highlights: [
        "As a founding team member, led end-to-end product initiatives shaping roadmap and strategy — helped expand to 3 new micro-markets.",
        "Launched a channel-partner app to 1,000+ partners in 3 months with 64% M7 retention; lead management and transaction search drove conversion from 25% to 50%.",
        "Built an AI pricing engine automating seller valuations — reducing time-to-valuation from 7 days to 6 hours.",
        "Shipped an AI sales-assistant app for property visits; visit quality scores rose from 5 to 8.5.",
        "Built an internal platform on Zoho unifying sales, ops, and pricing — team efficiency improved by 30%.",
        "Led Truva's website redesign — AI-furnishing, life index, township pages, and blogs. MAU +25%, website NPS +40%.",
      ],
      stack: ["Python", "Zoho", "BigQuery", "GA4", "Mixpanel", "Figma"],
    },
    {
      from: "Mar 2023",
      to: "Oct 2024",
      company: "Ivy Homes (YC W21)",
      role: "Associate PM",
      location: "Bangalore",
      note: "Drove product and operations automation at a fast-scaling proptech startup during 3× annual growth.",
      stage: "Series A · Scale",
      team: "Sales × Ops × Tech",
      funding: "YC W21",
      highlights: [
        "Drove product and operations automation at a fast-scaling proptech startup during 3× annual growth.",
        "Built the digital acquisition module — from visit scheduling to offer generation — driving 40% of total business.",
        "Designed a dynamic offer page that increased acquisitions by 35% and cut offer completion time by 20 days.",
        "Built a lead-ranking algorithm in the CRM so sales teams could prioritize high-intent leads; weekly site visits rose 45%.",
        "Developed a mobile inspection app and live inventory tool for ops and sales — renovation assessment time dropped sharply and weekly site visits doubled.",
      ],
      stack: ["React", "Figma", "CRM internals", "Mixpanel"],
    },
    {
      from: "Jun 2020",
      to: "Mar 2023",
      company: "Byju's",
      role: "Program Manager",
      location: "Bangalore",
      note: "Managed 8 associates across sales and onboarding programs in 3 cities through hypergrowth and the Aakash merger.",
      stage: "Hyper-growth",
      team: "8 direct reports",
      funding: "Late stage",
      highlights: [
        "Drove strategic initiatives to streamline operations, standardize execution, and ensure consistent delivery of business outcomes across regions.",
        "Managed a team of 8 associates running sales and onboarding programs across 3 cities through hypergrowth and the Aakash merger.",
        "Piloted CRM and operational alignment post-Aakash merger — reduced onboarding friction and lead leakage.",
        "Owned the sales ops program for the regional sales team, ensuring alignment with company-wide growth targets and execution excellence.",
      ],
      stack: ["Salesforce", "Excel", "Internal LMS"],
    },
  ],

  education: [
    { school: "IIT Madras", degree: "BS + MTech · Programming & Data Science", years: "2021 — 2026" },
    { school: "RGPV", degree: "B.Tech · Mechanical Engineering", years: "2016 — 2020" },
  ],
};
