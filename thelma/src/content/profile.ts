/**
 * Single source of truth for everything the portfolio says about Thelma.
 *
 * Source: CV (Thelma_Agnes_Peter_CV.pdf). Nothing here is invented.
 * The CV was written for one application; the employer-specific line in its
 * summary is left out so the site works for any role.
 */

/** Year shown in the footer. */
export const siteYear = new Date().getFullYear()

export const person = {
  name: 'Thelma Agnes Peter',
  nameLines: ['Thelma', 'Agnes', 'Peter'],
  firstName: 'Thelma',
  initials: 'TAP',
  role: 'Business & Research Analyst',
  focus: 'Digital Operations, Data Analysis & Insights',
  location: 'Chennai, India',
  /** CONFIG: the CV says "open to Gurgaon"; widen or narrow as needed. */
  availability: 'Open to analyst & consulting roles',
  reach: 'anywhere in India',
  lead: 'A business and research analyst with three years across market research, process automation and operations — turning complex data into actionable insights.',
  seeking:
    'Analyst and consulting roles where data, research and digital operations meet. Based in Chennai and open to relocating within India.',
}

/* ------------------------------------------------------------------ */
/* Headline figures (all from the CV)                                   */
/* ------------------------------------------------------------------ */

export const signals = [
  { figure: '500+', label: 'IT assets tracked end-to-end', where: 'Stellantis', tone: 'ivory' as const },
  { figure: '−15%', label: 'downtime across those assets', where: 'Stellantis', tone: 'yellow' as const },
  { figure: '100+', label: 'data points turned into leadership recommendations', where: 'Stellantis', tone: 'ivory' as const },
  { figure: '15+', label: 'vendor, hotel and transport partners coordinated', where: 'Bible Tours', tone: 'red' as const },
]

/* ------------------------------------------------------------------ */
/* Work — each role told as a case file                                */
/* ------------------------------------------------------------------ */

export type CaseFile = {
  id: string
  n: string
  org: string
  title: string
  place: string
  dates: string
  summary: string
  points: string[]
  tools: string[]
  diagram: 'assets' | 'automation' | 'disputes'
}

export const caseFiles: CaseFile[] = [
  {
    id: 'stellantis',
    n: '01',
    org: 'Stellantis',
    title: 'Asset Manager & Market Research Analyst',
    place: 'Chennai',
    dates: 'Jun 2023 – Jun 2024',
    summary:
      'Owned issue tracking and resolution for 500+ IT assets with cross-functional teams, cutting downtime by 15%.',
    points: [
      'Built Power BI and Excel dashboards and analysed 100+ data points to give leadership data-driven recommendations.',
      'Ran competitive landscape and benchmarking analysis, presented to leadership as storyboarded PowerPoint decks.',
    ],
    tools: ['Power BI', 'Excel', 'PowerPoint'],
    diagram: 'assets',
  },
  {
    id: 'kla',
    n: '02',
    org: 'KLA',
    title: 'Automation & Business Process Analyst',
    place: 'Chennai',
    dates: 'Oct 2024 – Mar 2025',
    summary:
      'Provided first-level support for system interface errors by designing ServiceNow and Resolve automation workflows that turned business requirements into reliable, scalable processes.',
    points: [
      'Built SQL- and Python-based dashboards to track performance and spot trends in operational data, with recommendations that improved service efficiency and issue turnaround.',
    ],
    tools: ['ServiceNow', 'Resolve', 'SQL', 'Python'],
    diagram: 'automation',
  },
  {
    id: 'bible-tours',
    n: '03',
    org: 'Bible Tours',
    title: 'Operations Executive — Client & Order Management',
    place: 'Chennai',
    dates: 'Mar 2025 – Present',
    summary:
      'Owns the dispute and complaint process end-to-end, from logging each case to closing the loop with the customer.',
    points: [
      'Handles client and partner queries across email, phone and live chat in line with SLAs and quality standards.',
      'Coordinates 15+ vendor, hotel and transport partners and tracks service-level metrics against targets.',
      'Manages order placement, amendments and delivery tracking, keeping stakeholders updated.',
    ],
    tools: ['SLA tracking', 'Root cause analysis', 'Stakeholder updates'],
    diagram: 'disputes',
  },
]

/* ------------------------------------------------------------------ */
/* Record                                                              */
/* ------------------------------------------------------------------ */

export const education = {
  school: 'SRM Institute of Science and Technology',
  degree: 'B.Tech, Computer Science & Business Systems',
  dates: '2020 – 2024',
  gpa: '8.91 / 10',
  coursework: [
    { name: 'Operations Research', grade: 'A+' },
    { name: 'IT Project Management', grade: 'A+' },
    { name: 'Services Science & Service Operational Management', grade: 'O' },
    { name: 'Business Analytics', grade: '' },
    { name: 'Business Communication', grade: '' },
    { name: 'Database Management', grade: '' },
  ],
}

export type Award = {
  mark: string
  tone: 'yellow' | 'red' | 'blue'
  title: string
  detail: string
}

export const leadership: Award[] = [
  {
    mark: '9+',
    tone: 'yellow',
    title: 'Model United Nations — 9+ awards',
    detail: 'Including Best IP Photojournalist (SSN University).',
  },
  {
    mark: 'A++',
    tone: 'red',
    title: 'NCC “A” Certificate',
    detail: 'Awarded with an A++ grade.',
  },
  {
    mark: 'VP',
    tone: 'blue',
    title: 'Vice President — Dept. of CSE & CAMOGENICS',
    detail: 'SRM Institute of Science and Technology.',
  },
]

export const certifications = [
  { name: 'CBAP — AI-Powered Business Analyst Professional', issuer: 'IIBA' },
  { name: 'Data Analyst', issuer: 'Besant Technologies' },
  { name: 'Product & App Management Workshop', issuer: 'IIT Madras' },
]

/* ------------------------------------------------------------------ */
/* Toolkit — CV skills, grouped by what they are used for              */
/* ------------------------------------------------------------------ */

export type SkillGroup = { verb: string; note: string; items: { name: string; detail?: string }[] }

export const skillGroups: SkillGroup[] = [
  {
    verb: 'Research',
    note: 'Map the market before recommending anything.',
    items: [
      { name: 'Market research' },
      { name: 'Benchmarking' },
      { name: 'Competitive landscape analysis' },
    ],
  },
  {
    verb: 'Analyse',
    note: 'Find the pattern in large, messy data.',
    items: [
      { name: 'Qualitative & quantitative analysis' },
      { name: 'Large and complex data sets' },
      { name: 'Advanced Excel' },
      { name: 'SQL' },
      { name: 'Python' },
      { name: 'Power BI' },
    ],
  },
  {
    verb: 'Automate',
    note: 'Turn requirements into processes that run themselves.',
    items: [
      { name: 'Digital business process automation' },
      { name: 'Business requirements' },
      { name: 'Process design & documentation' },
      { name: 'ServiceNow & Resolve', detail: 'workflows' },
    ],
  },
  {
    verb: 'Present',
    note: 'Make the insight land with leadership.',
    items: [
      { name: 'PowerPoint', detail: 'storyboards, executive decks' },
      { name: 'Synthesising complex information' },
      { name: 'Written & verbal English' },
      { name: 'Word & Outlook' },
    ],
  },
  {
    verb: 'Coordinate',
    note: 'Keep people and timelines moving.',
    items: [
      { name: 'Stakeholder management' },
      { name: 'Organisation & time management' },
      { name: 'Quick learner' },
    ],
  },
]

export const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Hindi', level: 'Fluent' },
  { name: 'Tamil', level: 'Fluent' },
  { name: 'Malayalam', level: '' },
  { name: 'French', level: '' },
]
