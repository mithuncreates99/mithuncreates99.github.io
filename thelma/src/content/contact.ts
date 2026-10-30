/**
 * Contact configuration.
 *
 * Every value here comes from the CV
 * (Thelma_Agnes_Peter_CV.pdf). Leave a field as an empty string to hide it
 * everywhere on the site — nothing is rendered for an empty value, so no
 * placeholder link can go live by accident.
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
  email: 'thelmaagnespeter@gmail.com',
  /** CV header: linkedin.com/in/thelma-agnes */
  linkedin: 'https://www.linkedin.com/in/thelma-agnes',
  /** CONFIG: optional. No GitHub on the CV — add a profile URL to show it. */
  github: '',
  /**
   * CONFIG: optional. The CV lists a phone number; it is left out of the
   * public site on purpose. Add it here (e.g. '+91 …') to show it.
   */
  phone: '',
  /**
   * CONFIG: optional. Path or URL of a downloadable CV (for example
   * './Thelma_Agnes_Peter_CV.pdf' placed in /public). Empty = no download link.
   */
  cvUrl: '',
  location: 'Chennai, India',
}

export const mailto = (subject?: string) =>
  `mailto:${contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`

export const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
