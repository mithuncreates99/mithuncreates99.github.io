/**
 * Contact configuration.
 *
 * Every value here comes from the CV (Mithun_Kumar_V_CV_Marketing.pdf) or
 * from the GitHub account that hosts the projects. Leave a field as an empty
 * string to hide it everywhere on the site — nothing is ever rendered for an
 * empty value, so no placeholder link can go live by accident.
 */
type Contact = {
  email: string
  linkedin: string
  github: string
  phone: string
  cvUrl: string
  location: string
}

export const contact: Contact = {
  /** CV header */
  email: 'mithunv7778@gmail.com',
  /** CV header: linkedin.com/in/mithun-kumar-9416462a0 */
  linkedin: 'https://www.linkedin.com/in/mithun-kumar-9416462a0',
  /** Owner of the tell-me repository */
  github: 'https://github.com/mithuncreates99',
  /**
   * CONFIG: optional. The CV lists a phone number; it is left out of the
   * public site on purpose. Add it here (e.g. '+33 7 58 21 81 68') to show it.
   */
  phone: '',
  /**
   * CONFIG: optional. Path or URL of a downloadable CV (for example
   * '/Mithun_Kumar_V_CV.pdf' placed in /public). Empty = no download link.
   */
  cvUrl: '',
  location: 'Rouen, France',
}

export const mailto = (subject?: string) =>
  `mailto:${contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`

export const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
