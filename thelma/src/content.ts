/**
 * Everything the site says about Thelma, in one place.
 *
 * Sources: her two CVs. The newer one (written for a Gartner application)
 * wins where they differ; the older one adds the Power BI / Tableau
 * projects, FITA Python, the Christ University MUN mention, volunteering and
 * interests. The employer-specific line of the newer CV is left out so the
 * site works for any role. Nothing here is invented.
 *
 * Leave a contact field empty to hide it everywhere.
 */

export const person = {
  name: 'Thelma Agnes Peter',
  first: 'Thelma',
  initials: 'TP',
  role: 'Business & Research Analyst',
  roles: 'Business & Research Analyst · Digital Operations · Data Insights',
  kicker: 'Research · Analysis · Digital operations',
  nameLines: ['Thelma', 'Agnes'],
  nameLast: 'Peter.',
  location: 'Chennai, India',
  reach: 'Open to roles in other Indian cities',
}

export const contact = {
  email: 'thelmaagnespeter@gmail.com',
  linkedin: 'https://www.linkedin.com/in/thelma-agnes',
  linkedinLabel: 'thelma-agnes',
  /** Left off the public site on purpose. */
  phone: '',
}

export const hero = {
  introBefore: 'I turn ',
  introEm: 'complex information',
  introAfter:
    ' into insights leaders can act on, from market research at Stellantis to automation workflows at KLA and client operations today.',
  badges: [
    { k: 'Stellantis · IT assets', v: '15% less downtime' },
    { k: 'SSN University MUN', v: 'Best IP Photojournalist' },
  ],
  figCaption: 'B.Tech CSBS · GPA 8.91',
}

/** Count-up band under the hero. `value` is animated; prefix/suffix are static. */
export const stats = [
  { value: 500, suffix: '+', label: 'IT assets monitored' },
  { value: 15, suffix: '%', label: 'less downtime' },
  { value: 100, suffix: '+', label: 'data points analysed' },
  { value: 15, suffix: '+', label: 'partners coordinated' },
  { value: 8.91, decimals: 2, label: 'GPA, B.Tech CSBS' },
]

export const about = {
  heading: ['Research that holds up, ', 'from raw data', ' to the leadership deck.'],
  leadBefore: 'I’m a business and research analyst with ',
  leadEm: 'three years',
  leadAfter: ' across market research, business process automation and operations.',
  body: [
    'I gather and analyse qualitative and quantitative data with Advanced Excel, SQL, Python and Power BI, then turn it into PowerPoint storyboards and executive presentations for leadership and varied stakeholders.',
    'At KLA I turned business requirements into ServiceNow and Resolve automation workflows, which showed me first-hand how digital tools change the way a process runs. I’m quick to learn new industries, business models and technologies.',
  ],
  principles: [
    { n: 'I.', title: 'Start from the data', text: 'Market research, benchmarking and competitive landscape analysis before any recommendation.' },
    { n: 'II.', title: 'Automate the repeatable', text: 'Business requirements turned into reliable, scalable ServiceNow and Resolve workflows.' },
    { n: 'III.', title: 'Make it land', text: 'Findings told as storyboards and executive presentations that leadership can act on.' },
  ],
  facts: [
    { k: 'Degree', v: 'B.Tech, Computer Science & Business Systems' },
    { k: 'College', v: 'SRM Institute of Science and Technology' },
    { k: 'GPA', v: '8.91', big: true },
    { k: 'Top grades', v: 'Operations Research A+ · IT Project Management A+ · Service Operations O' },
  ],
  milestones: [
    { when: '2018 – 2019', what: 'Event coordinator at Sampoorna NGO, rehabilitating rural places in India.' },
    { when: 'Aug 2020', what: 'Began the B.Tech in Computer Science & Business Systems at SRM IST, a twinning programme of technical and management studies.' },
    { when: '2021 – 2024', what: 'Rose from head of administration to secretary to vice president of Camogenics, SRM IST’s official media partner; vice president of the Department of CSE in 2022 – 2023.' },
    { when: 'Jun 2023', what: 'Market Research Analyst at Stellantis, Chennai.' },
    { when: 'Jan 2024', what: 'Asset Manager in Stellantis’ IT infrastructure team.' },
    { when: 'Aug 2024', what: 'Graduated with a GPA of 8.91.' },
    { when: 'Oct 2024', what: 'Automation & Business Process Analyst at KLA.' },
    { when: 'Mar 2025', what: 'Operations Executive at Bible Tours, Chennai.' },
  ],
}

export type Art = 'assets' | 'automation' | 'cases' | 'dashboards'

export type Project = {
  id: string
  kicker: string
  title: string
  lead: string
  stats: { value: string; label: string }[]
  chips: string[]
  details: string[]
  art: Art
}

export const work = {
  heading: ['Roles and projects, ', 'with results.'],
  sub: 'Three companies and two dashboards: IT assets that stayed up, workflows that ran themselves, and cases closed from first contact to resolution.',
  projects: [
    {
      id: 'stellantis',
      kicker: '01 · Stellantis · Chennai · 2023 – 2024',
      title: 'IT Assets & Market Research',
      lead: 'As Asset Manager in the IT infrastructure team, I owned issue tracking and resolution for 500+ IT assets with cross-functional teams. Earlier, as Market Research Analyst, I turned industry data into insights for the marketing team.',
      stats: [
        { value: '15%', label: 'less downtime' },
        { value: '500+', label: 'IT assets monitored' },
        { value: '10+', label: 'reports every month' },
      ],
      chips: ['Power BI', 'Excel', 'Site24x7', 'Benchmarking', 'PowerPoint'],
      details: [
        'Monitored 500+ IT assets with Site24x7, Application Manager and OPS Manager, cutting downtime by 15%.',
        'Built Power BI and Excel dashboards and analysed 100+ data points to give leadership data-driven recommendations.',
        'Delivered 10+ performance reports a month, improving team efficiency by 30%.',
        'Ran competitive landscape and benchmarking analysis, presented to leadership as storyboarded PowerPoint decks.',
      ],
      art: 'assets',
    },
    {
      id: 'kla',
      kicker: '02 · KLA · IT process automation · 2024 – 2025',
      title: 'Process Automation',
      lead: 'Gave first-level support for system interface errors by designing ServiceNow and Resolve automation workflows that turned business requirements into reliable, scalable processes.',
      stats: [
        { value: 'L1', label: 'support for interface errors' },
        { value: '2', label: 'automation platforms' },
        { value: 'SQL', label: '+ Python dashboards' },
      ],
      chips: ['ServiceNow', 'Resolve', 'SQL', 'Python'],
      details: [
        'Designed and implemented automated workflows in Resolve as part of the IT Process Automation team, reducing manual effort.',
        'Built SQL- and Python-based dashboards to track performance and spot trends in operational data.',
        'Turned those findings into recommendations that improved service efficiency and issue turnaround.',
      ],
      art: 'automation',
    },
    {
      id: 'bible-tours',
      kicker: '03 · Bible Tours · Chennai · 2025 – Present',
      title: 'Client & Order Operations',
      lead: 'I own the dispute and complaint process end to end, from logging each case and finding its root cause to closing the loop with the customer.',
      stats: [
        { value: '15+', label: 'vendor, hotel & transport partners' },
        { value: '3', label: 'channels: email, phone, chat' },
        { value: 'SLA', label: 'and quality standards' },
      ],
      chips: ['SLAs', 'Root cause analysis', 'Vendor liaison', 'Order tracking'],
      details: [
        'Handle client and partner queries across email, phone and live chat in line with SLAs and quality standards.',
        'Log cases accurately, run root cause analysis, liaise with vendors and escalate when needed.',
        'Coordinate 15+ vendor, hotel and transport partners and track service-level metrics against targets.',
        'Manage order placement, amendments and delivery tracking, keeping stakeholders updated.',
      ],
      art: 'cases',
    },
    {
      id: 'dashboards',
      kicker: '04 · Power BI · Tableau · Projects',
      title: 'Loan & HR Analytics',
      lead: 'Two dashboards built to speed up decisions: loan approval trends in Power BI, and employee performance and HR analytics in Tableau.',
      stats: [
        { value: '10+', label: 'loan metrics tracked' },
        { value: '30%', label: 'faster loan decisions' },
        { value: '20%', label: 'more efficient HR processes' },
      ],
      chips: ['Power BI', 'Tableau', 'Data modelling', 'HR analytics'],
      details: [
        'Loan Data Analysis Dashboard: interactive Power BI views of loan data trends across 10+ key metrics, for a 30% faster approval process.',
        'Employee Performance & HR Analytics: Tableau visualisations of performance trends that made HR processes 20% more efficient.',
      ],
      art: 'dashboards',
    },
  ] as Project[],
}

export const toolkit = {
  heading: ['What I work with, ', 'and why.'],
  sub: 'Grouped by the job they do.',
  groups: [
    { n: '01', name: 'Data & BI', wide: true, big: ['Power BI', 'Excel'], mid: ['SQL', 'Python', 'Tableau'], note: 'Advanced Excel: complex formulas, pivot tables, large data sets.' },
    { n: '02', name: 'Research', big: ['Market research'], mid: ['Benchmarking', 'Competitive landscape'], note: 'Qualitative and quantitative analysis.' },
    { n: '03', name: 'Process', big: ['Automation'], mid: ['ServiceNow', 'Resolve', 'Requirements'], note: 'Process design and documentation.' },
    { n: '04', name: 'Operations', big: ['SLAs'], mid: ['Root cause analysis', 'Vendors', 'Orders'], note: 'Stakeholder management.' },
    { n: '05', name: 'Communication', big: ['Storyboards'], mid: ['Executive decks', 'Word', 'Outlook'], note: 'Written and verbal English.' },
    { n: '06', name: 'Languages', wide: true, big: ['English', 'Hindi', 'Tamil'], mid: ['Malayalam', 'French'], note: 'Fluent in English, Hindi and Tamil.' },
  ],
}

/** Timeline lanes; dates as decimal years. `end: null` runs to today. */
export const timeline = {
  heading: ['Four years of study, ', 'three of work.'],
  start: 2018,
  end: 2027,
  lanes: [
    { name: 'Education', bars: [{ start: 2020.58, end: 2024.58, label: 'B.Tech CSBS · SRM IST', short: 'B.Tech · SRM', when: 'Aug 2020 – Aug 2024' }] },
    {
      name: 'Work',
      bars: [
        { start: 2023.42, end: 2023.67, label: 'Market research', short: 'Market research', full: 'Market Research Analyst, Stellantis', when: 'Jun – Sep 2023' },
        { start: 2024.0, end: 2024.42, label: 'Asset manager', short: 'Asset manager', full: 'Asset Manager, Stellantis', when: 'Jan – Jun 2024' },
        { start: 2024.75, end: 2025.17, label: 'KLA', short: 'KLA', full: 'Automation & Business Process Analyst, KLA', when: 'Oct 2024 – Mar 2025' },
        { start: 2025.17, end: null, label: 'Operations · Bible Tours', short: 'Bible Tours', full: 'Operations Executive, Bible Tours', when: 'Mar 2025 – Present' },
      ],
    },
    {
      name: 'Camogenics',
      bars: [
        { start: 2021.0, end: 2022.0, label: 'Head of admin', short: 'Admin', full: 'Head of administration, Camogenics', when: '2021 – 2022' },
        { start: 2022.0, end: 2023.0, label: 'Secretary', short: 'Secretary', full: 'Secretary, Camogenics', when: '2022 – 2023' },
        { start: 2023.0, end: 2024.0, label: 'Vice President', short: 'VP', full: 'Vice President, Camogenics', when: '2023 – 2024' },
      ],
    },
    {
      name: 'Campus & NGO',
      bars: [
        { start: 2018.0, end: 2019.0, label: 'Sampoorna NGO', short: 'NGO', full: 'Event coordinator, Sampoorna NGO', when: '2018 – 2019' },
        { start: 2021.0, end: 2022.0, label: 'Campus events', short: 'Events', full: 'Event coordinator, department, Campus Life', when: '2021 – 2022' },
        { start: 2022.0, end: 2023.0, label: 'VP · CSE', short: 'VP · CSE', full: 'Vice President, Department of CSE', when: '2022 – 2023' },
      ],
    },
  ],
  stats: [
    { k: 'Companies', v: '3', s: 'Stellantis → Bible Tours' },
    { k: 'Experience', v: '3 yrs', s: 'since June 2023' },
    { k: 'GPA', v: '8.91', s: 'B.Tech CSBS' },
    { k: 'Leadership', v: '6', s: 'roles since 2018' },
  ],
}

export const recognition = {
  heading: ['Impact, ', 'on the record.'],
  cards: [
    { size: 'xl', mark: '15%', kicker: 'Stellantis · IT infrastructure', title: '15% less downtime', text: 'Across 500+ IT assets, by owning issue tracking and resolution end to end.' },
    { size: 'md', mark: '9+', kicker: 'Model UN · photojournalism', title: 'Best IP Photojournalist', text: 'SSN University MUN 2023, one of 9+ MUN awards. Honourable mention at Christ University, 2022.' },
    { size: 'md', mark: '8.91', kicker: 'Academics', title: 'GPA 8.91', text: 'B.Tech, Computer Science & Business Systems, SRM IST.' },
    { size: 'lg', mark: 'VP', kicker: 'Leadership', title: 'Vice President, twice', text: 'Vice president of the Department of CSE (2022 – 23), then of Camogenics, SRM IST’s official media partner (2023 – 24), after serving as its head of administration and secretary. Led teams that ran inter-college events such as Monocle and Texus.', pills: [{ k: 'NCC', v: 'A++', s: '‘A’ certificate' }, { k: 'Volunteer', v: '6 yrs', s: 'Sampoorna NGO' }] },
  ],
}

export const path = {
  heading: ['The path ', 'so far.'],
  experience: [
    {
      when: 'Mar 2025 – Present',
      role: 'Operations Executive, Client & Order Management',
      org: 'Bible Tours · Chennai',
      points: [
        'Own the dispute and complaint process end to end, from logging to closing the loop.',
        'Coordinate 15+ vendor, hotel and transport partners against service-level targets.',
      ],
    },
    {
      when: 'Oct 2024 – Mar 2025',
      role: 'Automation & Business Process Analyst',
      org: 'KLA · Chennai',
      points: ['Designed ServiceNow and Resolve workflows from business requirements.', 'Built SQL and Python dashboards on operational data.'],
    },
    {
      when: 'Jun 2023 – Jun 2024',
      role: 'Asset Manager & Market Research Analyst',
      org: 'Stellantis · Chennai',
      points: ['Cut downtime by 15% across 500+ IT assets.', 'Built Power BI and Excel dashboards and benchmarking decks for leadership.'],
    },
  ],
  education: [
    { when: 'Aug 2020 – Aug 2024', role: 'B.Tech, Computer Science & Business Systems', org: 'SRM Institute of Science and Technology', tag: 'GPA 8.91' },
    { when: '2020 – 2021', role: 'BSS Advanced Diploma in Acupuncture', org: 'S.A.K Academy of Acupuncture', tag: '' },
  ],
  certifications: [
    { issuer: 'IIBA', items: ['CBAP – AI-Powered Business Analyst Professional'] },
    { issuer: 'Besant', items: ['Data Analyst (2024)'] },
    { issuer: 'IIT Madras', items: ['Product & App Management Workshop (2023)'] },
    { issuer: 'FITA', items: ['Python (2022)'] },
    { issuer: 'NCC', items: ['National Cadet Corps ‘A’ Certificate, A++ grade'] },
  ],
}

export const contactSection = {
  heading: ['Let’s turn data ', 'into decisions.'],
  text: 'Hiring for an analyst, research or operations role? My inbox is open.',
  interests: 'Away from work: photojournalism, portrait photography and singing in a choir.',
}

export const lens = {
  label: 'Behind the lens',
  heading: ['Behind the lens, ', 'the same eye for detail.'],
  body: [
    'Away from spreadsheets, I’m a photojournalist and portrait photographer. Both jobs start the same way: look closely, find what matters in the frame, and leave out the noise.',
    'My photojournalism at Model United Nations conferences earned Best IP Photojournalist at SSN University and an honourable mention at Christ University.',
  ],
  notes: [
    { k: 'SSN University MUN, 2023', v: 'Best IP Photojournalist' },
    { k: 'Christ University MUN, 2022', v: 'Honourable mention, photojournalism' },
    { k: 'Model UN', v: '9+ awards' },
    { k: 'Also', v: 'Portrait photography · choir member' },
  ],
  flashLabel: 'Portrait of Thelma, lit by a movable light. Use the arrow keys to move it.',
  alt: 'Thelma, smiling in a yellow top, leaning on a wooden counter framed by two round arches.',
  caption: 'Portrait · Thelma Agnes Peter',
}

export const hire = {
  button: 'Hire me',
  eyebrow: 'Open to analyst, research and operations roles',
  title: ['Hire', 'Thelma.'],
  text: 'Based in Chennai and open to roles in other Indian cities. The quickest way to reach me is email.',
  cta: 'Email Thelma',
  subject: 'Opportunity for Thelma Agnes Peter',
  stageHint: 'Drag the button, or tap the hand to give the strings a tug.',
}

/** Leadership roles, as Thelma listed them. */
export const leadership = {
  label: 'Leadership',
  heading: ['Six roles, ', 'one steady climb.'],
  sub: 'From coordinating NGO events in 2018 to vice president of SRM IST’s official media partner.',
  ladder: {
    org: 'Camogenics',
    note: 'Official media partner of SRM IST',
    steps: [
      { role: 'Head of Admin\u00adistration', when: '2021 – 2022', h: 38 },
      { role: 'Secretary', when: '2022 – 2023', h: 66 },
      { role: 'Vice President', when: '2023 – 2024', h: 94 },
    ],
  },
  roles: [
    { role: 'Event Coordinator', org: 'Sampoorna NGO', when: '2018 – 2019', note: 'Rehabilitating rural places in India.' },
    { role: 'Event Coordinator', org: 'Department · Campus Life', when: '2021 – 2022', note: '' },
    { role: 'Vice President', org: 'Department of Computer Science (CSE), SRM IST', when: '2022 – 2023', note: '' },
  ],
  also: 'Led teams that ran inter-college events such as Monocle and Texus.',
}
