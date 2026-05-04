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
      "Currently Founding PM at Pokus.ai (LSIP + Info Edge backed), shipping consumer and AI bets across faith-tech, mental health, and concierge.",
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
          title: "Khoya Khoya Chand",
          artist: "Mohit Chauhan",
          album: "KHOYA KHOYA CHAND",
          tag: "ON REPEAT",
          playUrl: "https://open.spotify.com/search/khoya%20khoya%20chand",
        },
        {
          title: "Tum Se Hi",
          artist: "Mohit Chauhan, Pritam",
          album: "JAB WE MET",
          tag: "COMFORT",
          playUrl: "https://open.spotify.com/search/tum%20se%20hi",
        },
        {
          title: "Passoori",
          artist: "Shae Gill · Ali Sethi · Coke Studio",
          album: "COKE STUDIO 14",
          tag: "DRIVES",
          playUrl: "https://open.spotify.com/search/passoori%20coke%20studio",
        },
        {
          title: "Holocene",
          artist: "Bon Iver",
          album: "BON IVER",
          tag: "STILLNESS",
          playUrl: "https://open.spotify.com/search/holocene%20bon%20iver",
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
          title: "UEFA Champions League",
          category: "FOOTBALL",
          quote: "Midweek nights, knockout stages.",
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
      title: "Faith-tech conversational agent",
      tagline: "Building a chatbot that remembers your faith.",
      summary:
        "Architected a memory-aware conversational agent for a faith-tech consumer product. Used Letta + Mem0 + LangChain to hold multi-session context across spiritual conversations.",
      problem:
        "Faith is deeply personal — users want to feel *remembered*, not re-introduced. Generic chat UX felt hollow within 2 sessions.",
      solution:
        "Custom architecture: Letta for agent state, Mem0 for long-term memory scoped to belief system + personal story, LangChain for orchestration across prayer, scripture, and reflection tools.",
      impact: [
        { metric: "CPS", value: "20+", note: "Conversations per session" },
        { metric: "Memory retention", value: "100%", note: "Across 30-day windows" },
        { metric: "D7 retention", value: "42%", note: "Above consumer benchmark" },
      ],
      stack: ["Letta", "Mem0", "LangChain", "OpenAI", "Postgres"],
      role: "Product · Architecture · Prompting",
      story: [
        { kind: "beat", label: "The signal", text: "Users came back excited on day 1. Gone by day 3. Sessions felt like talking to a stranger who'd just read your file." },
        { kind: "beat", label: "The hypothesis", text: "Faith conversations don't have a 'task'. They have a thread. If the agent can hold the thread across weeks — names, doubts, prayers — retention will follow." },
        { kind: "stat", value: "2", unit: "sessions", note: "Time-to-drop-off before redesign" },
        {
          kind: "beat",
          label: "The build",
          text: "Letta held agent state per user. Mem0 wrote durable memories scoped by belief + personal story. LangChain routed between scripture, prayer, and reflection tools — the agent could pull a verse a user mentioned 2 weeks ago.",
        },
        { kind: "beat", label: "The result", text: "Conversations went from 4 turns to 20+. Users started apologizing for being away — they treated the agent like a friend." },
        { kind: "lesson", text: "Memory is the feature. Everything else is plumbing." },
      ],
    },
    {
      id: "pokus-concierge",
      company: "Pokus.ai",
      year: "2025",
      title: "AI-powered fractional concierge",
      summary:
        "Drove discovery, manual-ops validation, pricing experiments, and scope for an AI concierge reaching 50 paying subscribers with early PMF signals. Contributed to the $3M seed.",
      problem: "Urban professionals outsource errands to assistants they can't afford. Existing concierge apps felt like Fiverr — transactional, cold, slow.",
      solution: "Wizard-of-Oz validated with real ops before writing code. Designed a 1:30 ninja-to-customer ratio (vs 1:20 benchmark) via workflow + tracking automation.",
      impact: [
        { metric: "Paying subs", value: "50+", note: "In first 8 weeks" },
        { metric: "Ops efficiency", value: "1:30", note: "vs 1:20 industry" },
        { metric: "Seed raised", value: "$3M", note: "Lightspeed + Info Edge" },
      ],
      stack: ["Manual ops", "N8N", "Airtable", "WhatsApp API"],
      role: "Founding PM · GTM · Storytelling",
      tagline: "Wizard-of-Oz to PMF in 8 weeks. $3.6M seed.",
      story: [
        {
          kind: "beat",
          label: "The bet",
          text: "Urban professionals want a personal assistant. They can't afford one. Existing concierge apps feel like Fiverr — cold and slow. We thought a high-trust, AI-augmented human ops layer could change that.",
        },
        { kind: "beat", label: "Before code", text: "Wizard-of-Oz first. I ran the ops myself for two weeks — booking, escalating, pricing on the fly. The product was a WhatsApp number and a spreadsheet." },
        { kind: "stat", value: "50+", unit: "paying subs", note: "First 8 weeks · early PMF signal" },
        { kind: "stat", value: "1:30", unit: "ratio", note: "Ninja-to-customer · vs 1:20 benchmark" },
        {
          kind: "beat",
          label: "Automating the boring",
          text: "Once patterns repeated I built workflow + tracking on N8N + Airtable. One ninja could now hold 30 customers' context without dropping anyone.",
        },
        { kind: "beat", label: "The raise", text: "Co-authored the deck and the storytelling. Closed $3.6M led by Lightspeed India with Info Edge participation." },
        { kind: "lesson", text: "Don't write code for a problem you haven't lived for two weeks." },
      ],
    },
    {
      id: "truva-pricing",
      company: "Truva (Ivy Homes)",
      year: "2024",
      title: "AI-powered pricing engine",
      summary: "Built a proprietary valuation engine for residential property sellers, replacing a 3-day manual pricing process with a sub-minute automated one.",
      problem: "Seller-side conversion was throttled by how long we took to respond with a price. Every hour after inquiry dropped conversion by ~8%.",
      solution: "Proprietary scoring logic blending comparables, condition, micro-market trends, and negotiation headroom. Tunable by ops for edge cases.",
      impact: [
        { metric: "Time to price", value: "−90%", note: "3 days → minutes" },
        { metric: "Seller conversion", value: "2×", note: "Response-time lift" },
        { metric: "Manual ops load", value: "−70%", note: "Pricing team freed up" },
      ],
      stack: ["Python", "BigQuery", "Internal tools", "Proprietary scoring"],
      role: "Product Lead",
      tagline: "From 3 days to minutes. 2× seller conversion.",
      story: [
        { kind: "beat", label: "The leak", text: "Conversion was bleeding through one hole: response time. Every hour after a seller inquiry dropped conversion ~8%. Pricing took the team 3 days." },
        { kind: "stat", value: "−8%", unit: "/hour", note: "Conversion decay after inquiry" },
        {
          kind: "beat",
          label: "First principles",
          text: "What does a price actually need? Comparables, condition, micro-market trends, negotiation headroom. Each was a knowable signal — we just had no engine to combine them.",
        },
        {
          kind: "beat",
          label: "The engine",
          text: "Built a proprietary scoring layer on top of BigQuery comparables. Tunable by ops for the 10% of edge cases the model couldn't trust itself on. Sub-minute end-to-end.",
        },
        { kind: "stat", value: "−90%", unit: "time", note: "3 days → minutes" },
        { kind: "stat", value: "2×", unit: "lift", note: "Seller-side conversion" },
        { kind: "lesson", text: "Speed is a feature when every hour costs you 8%." },
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
      note: "3-person team. $3M seed (Lightspeed, Info Edge). -1→0 AI consumer bets.",
      stage: "Pre-seed → Seed",
      team: "3",
      funding: "$3.6M (Lightspeed India, Info Edge)",
      highlights: [
        "Joined a 3-member founding team. Validated and shaped ideas from scratch across mental health, faith-tech and consumer convenience.",
        "Architected a faith-tech conversational agent with Letta + Mem0 + LangChain. Hit CPS > 20 with multi-session memory.",
        "Drove ground-up validation for an AI fractional concierge — manual ops, pricing experiments, scope cuts. ~50 paying subs in 8 weeks; early PMF signal.",
        "Designed the workflow + tracking system that pushed ops efficiency to 1:30 (ninja:customer) vs 1:20 industry benchmark.",
        "Co-authored the deck and storytelling for the seed round — closed $3.6M led by Lightspeed India with Info Edge participation.",
      ],
      stack: ["Letta", "Mem0", "LangChain", "N8N", "Ragas", "Cursor"],
    },
    {
      from: "Oct 2024",
      to: "Jul 2025",
      company: "Truva",
      role: "Product Manager",
      location: "Mumbai",
      note: "0→1 proptech. Expanded to 3 micro-markets. AI pricing, sales assistant, agentic calling.",
      stage: "0→1",
      team: "Cross-functional · 12+",
      funding: "Seed-stage proptech",
      highlights: [
        "Owned end-to-end product initiatives shaping roadmap and strategy. Helped expand to 3 new micro-markets.",
        "Launched and scaled a mobile app to 1,000+ Channel Partners in 3 months. 64% retention; LMS + transaction search lifted NPS by 60% and 2× conversion.",
        "Built the AI pricing engine — proprietary scoring + comparables. −90% time to valuation; freed the manual pricing team.",
        "Delivered the AI sales assistant for property visits — visit quality score climbed 5 → 8.5.",
        "Implemented an agentic calling system for presales. Conversion +35% across the funnel.",
        "Built an internal Zoho productivity platform unifying sales, ops and pricing. Team efficiency +30%.",
        "Led the website redesign — AI-furnished, life index, township pages, blogs. MAU +25%, website NPS +40%.",
      ],
      stack: ["Python", "Airtable", "Internal tools", "Zoho", "GA4", "Mixpanel"],
    },
    {
      from: "Mar 2023",
      to: "Oct 2024",
      company: "Ivy Homes (YC W21)",
      role: "Associate PM",
      location: "Bangalore",
      note: "Drove acquisition module + ops automation at a fast-scaling proptech. Enabled 3× annual growth.",
      stage: "Series A · Scale",
      team: "Sales × Ops × Tech",
      funding: "YC W21",
      highlights: [
        "Built the acquisition module for the digital channel — visit scheduling → offer generation → conversion. Drove 40% of total business.",
        "Designed a dynamic offer page replacing static PDFs. Acquisitions +35%; offer completion time −20 days.",
        "Built a lead-ranking algorithm in the CRM so sales could prioritize high-intent leads. Weekly site visits +45%.",
        "Developed a mobile inspection app + live inventory tool for ops & sales. Renovation assessment time −90%; weekly site visits 2×.",
        "Worked across BD, ops, and tech to ship internal tools that enabled 3× annual growth.",
      ],
      stack: ["React", "Figma", "CRM internals", "Mixpanel"],
    },
    {
      from: "Jun 2020",
      to: "Mar 2023",
      company: "Byju's (Think & Learn)",
      role: "Program Manager",
      location: "3 cities",
      note: "High-growth phase. Managed 8 associates. Owned regional sales + onboarding programs.",
      stage: "Hyper-growth",
      team: "8 direct reports",
      funding: "Late stage",
      highlights: [
        "Owned end-to-end program delivery for regional sales and onboarding ops across 3 cities.",
        "Aligned execution to company-wide growth targets; standardized cross-region delivery.",
        "Piloted CRM and operational alignment post-Aakash merger — reduced onboarding friction and lead leakage.",
        "Drove strategic initiatives that streamlined ops and ensured consistent delivery of business outcomes.",
      ],
      stack: ["Salesforce", "Excel", "Internal LMS"],
    },
  ],

  education: [
    { school: "IIT Madras", degree: "BS + MTech · Programming & Data Science", years: "2021 — 2026" },
    { school: "RGPV", degree: "B.Tech · Mechanical Engineering", years: "2016 — 2020" },
  ],
};
