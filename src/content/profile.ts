/**
 * Single source of truth for everything the portfolio says about Mithun.
 *
 * Sources:
 *  - CV: Mithun_Kumar_V_CV_Marketing.pdf
 *  - Tell Me repository (github.com/mithuncreates99/tell-me): README,
 *    docs/CASE_STUDY.md and web/package.json, for the product facts and stack.
 *
 * Nothing here is invented. If a fact changes, change it here only.
 */

/** Year shown in the footer. */
export const siteYear = new Date().getFullYear()

export const person = {
  name: 'Mithun Kumar V',
  firstName: 'Mithun',
  lastName: 'Kumar V',
  initials: 'MKV',
  role: 'Master in Management Student',
  focus: 'Business, Digital & Data',
  school: 'NEOMA Business School',
  location: 'Rouen, France',
  availability: 'Seeking an internship from January 2027',
  /** CV profile, lightly shortened */
  lead: 'A NEOMA Master in Management student with a technology background, turning user insight and data into clear dashboards and digital experiences.',
  profile:
    'NEOMA Master in Management student with a technology background, combining consumer-focused product design, brand partnerships and data analysis.',
  seeking:
    'An internship from January 2027. Open to roles across functions, anywhere analytical and digital skills are useful.',
}

export type Education = {
  school: string
  place: string
  degree: string
  dates: string
  detail?: string
}

export const education: Education[] = [
  {
    school: 'NEOMA Business School',
    place: 'Rouen, France',
    degree: 'Master in Management (MiM), Business Administration and Management',
    dates: 'Sept 2026 – Sept 2028',
    detail:
      'Marketing, strategy and management coursework. Nike strategic case study: a VRIO analysis of competitive advantage, presented as a team.',
  },
  {
    school: 'Bannari Amman Institute of Technology',
    place: 'Tamil Nadu, India',
    degree: 'Bachelor of Technology (B.Tech), Information Technology',
    dates: 'Nov 2022 – Apr 2026',
    detail: 'CGPA 7.76 / 10',
  },
]

export const experience = [
  {
    org: 'Meridien Brand Society',
    role: 'Partnerships & Relationships Team Member',
    dates: 'Oct 2026 – Present',
    points: [
      'Identifying and approaching FMCG brands, particularly in dairy, to build brand partnerships for a student branding association.',
      'Researching target brands and preparing partnership outreach in a cross-functional student team.',
    ],
  },
]

export type Award = {
  mark: string
  tone: 'yellow' | 'red' | 'blue'
  title: string
  detail: string
  date: string
}

export const awards: Award[] = [
  {
    mark: 'Gold',
    tone: 'yellow',
    title: 'State Gold Medal — Tamil Nadu Skills Competition, Level 3, Woodworking',
    detail: 'Qualified to represent the state at regional level.',
    date: 'Dec 2025',
  },
  {
    mark: 'Bronze',
    tone: 'red',
    title: 'Bronze Medal — IndiaSkills Southern Regional Competition 2025–26, Joinery',
    detail:
      'Hyderabad, representing Tamil Nadu. Awarded by the Union Minister of State for Skill Development.',
    date: 'Feb 2026',
  },
  {
    mark: 'Best Paper',
    tone: 'blue',
    title: "Best Paper Award — ICMCCT'25 international conference",
    detail: '“Alumni Nexus: Enhancing Professional Growth through Digital Alumni Networks.”',
    date: '2025',
  },
]

export const certifications = [
  { name: 'Certified Pega System Architect (CSA)', issuer: 'Pegasystems', date: 'July 2025' },
  { name: 'Power BI Data Analyst Professional Certificate', issuer: 'Microsoft', date: '' },
]

export type SkillGroup = { verb: string; note: string; items: { name: string; detail?: string }[] }

/** CV skills, regrouped by what they are used for. */
export const skillGroups: SkillGroup[] = [
  {
    verb: 'Understand',
    note: 'Read the market and the user before designing anything.',
    items: [
      { name: 'Market & competitor analysis', detail: 'VRIO' },
      { name: 'UX research & user testing' },
    ],
  },
  {
    verb: 'Design',
    note: 'Shape the journey people actually go through.',
    items: [
      { name: 'Customer journey design' },
      { name: 'Figma' },
      { name: 'Adobe XD' },
      { name: 'Pega', detail: 'low-code' },
    ],
  },
  {
    verb: 'Measure',
    note: 'Turn data into reports people can act on.',
    items: [
      { name: 'KPI tracking' },
      { name: 'Data analysis & reporting' },
      { name: 'Power BI', detail: 'dashboards, DAX, Power Query' },
      { name: 'Microsoft Excel', detail: 'pivot tables, lookups' },
      { name: 'SQL' },
    ],
  },
  {
    verb: 'Build',
    note: 'Enough engineering to make ideas real.',
    items: [{ name: 'HTML' }, { name: 'CSS' }, { name: 'Java' }, { name: 'Git' }, { name: 'PowerPoint' }],
  },
  {
    verb: 'Partner',
    note: 'Work with brands and teams.',
    items: [
      { name: 'Brand partnerships' },
      { name: 'Communication' },
      { name: 'Teamwork' },
      { name: 'Creativity' },
      { name: 'Adaptability' },
    ],
  },
]

export const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Tamil', level: 'Native' },
  { name: 'French', level: 'A2 · B1 in progress', note: 'Alliance Française de Madras' },
]

export const interests = ['Woodworking (national competitions)', 'Fitness', 'Reading']

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export const tellMe = {
  id: 'tell-me',
  title: 'Tell Me',
  kicker: 'Personal project · Product design & launch',
  dates: 'Oct 2026 – Present',
  tagline: 'A habit tracker built around one question: did you show up?',
  problem:
    'Habit apps quietly fail because logging is work. Once tracking becomes a chore, people stop opening the app — and the habit fades with it.',
  solution:
    'One question per habit, asked at the right moment: Yes or No, answered in a single tap from the notification. Those answers feed weekly reports with plain-language insights.',
  contribution:
    'Designed and launched the consumer app on web and iPhone, taking it from concept to live launch with a privacy-first positioning and a focus on simple, daily use.',
  stack: [
    'React',
    'TypeScript',
    'Vite',
    'PWA + Web Push',
    'Capacitor (iPhone)',
    'Cloudflare Workers + D1',
    'IndexedDB',
    'English & French',
  ],
  links: [
    { label: 'Open the live app', href: 'https://mithuncreates99.github.io/tell-me/' },
    { label: 'Try it with demo data', href: 'https://mithuncreates99.github.io/tell-me/#/demo' },
    { label: 'Source on GitHub', href: 'https://github.com/mithuncreates99/tell-me' },
  ],
  screens: [
    { key: 'today', label: 'Today', note: 'What is due, streaks and the next check-in.' },
    { key: 'checkin', label: 'The one question', note: 'Did you show up? Yes or No.' },
    { key: 'report', label: 'Weekly report', note: 'Completion, trends and insights in plain words.' },
  ],
} as const

export type CaseFile = {
  id: string
  n: string
  title: string
  context: string
  role: string
  dates: string
  summary: string
  tools: string[]
  diagram: 'loop' | 'journey' | 'patient'
}

export const caseFiles: CaseFile[] = [
  {
    id: 'school',
    n: '02',
    title: 'Online School Management System',
    context: 'Team project · team of 4',
    role: 'UI/UX Designer',
    dates: 'Nov – Dec 2024',
    summary:
      'Designed the user interfaces and dashboards in Figma, then ran user testing and feedback sessions to improve usability and navigation.',
    tools: ['Figma', 'User testing'],
    diagram: 'loop',
  },
  {
    id: 'onboarding',
    n: '03',
    title: 'Customer Onboarding Journey',
    context: 'Digital banking application · Pega',
    role: 'Designed the journey',
    dates: 'Aug 2025',
    summary:
      'A multi-step customer onboarding journey — verification, document upload, account setup and card preferences — with automated pricing logic and approval timelines.',
    tools: ['Pega (low-code)'],
    diagram: 'journey',
  },
  {
    id: 'health',
    n: '04',
    title: 'Digital Health Checkup',
    context: 'Case management · Pega',
    role: 'Built the journey',
    dates: 'May 2025',
    summary:
      'A patient journey for appointment booking and consultations, with KPI reports tracking appointment statistics and trends.',
    tools: ['Pega (low-code)', 'KPI reports'],
    diagram: 'patient',
  },
]
