import { readFile, writeFile } from 'node:fs/promises'
import { loadEnv } from 'vite'
import { publicEndpoint, render } from '../.prerender/entry-server.js'

const env = loadEnv('production', process.cwd(), '')
const { SITE_ORIGIN } = env
const contact = env.VITE_CONTACT_ENDPOINT
if (contact && !publicEndpoint(contact)) {
  throw new Error('VITE_CONTACT_ENDPOINT must be a public HTTPS URL or root-relative path.')
}

let origin = ''
if (SITE_ORIGIN) {
  const url = new URL(SITE_ORIGIN)
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_ORIGIN must be an HTTPS origin without a path.')
  }
  origin = url.origin
}

const output = new URL('../dist/',import.meta.url)
const source = await readFile(new URL('index.html', output),'utf8')
const organization = {
  '@context':'https://schema.org',
  '@type':'Organization',
  name:'Rainmakers',
  slogan:'Automate. Engage. Grow.',
  telephone:'+94766707391',
  address:{'@type':'PostalAddress',streetAddress:'A6F43, Bloemendhal',addressLocality:'Colombo 13',addressCountry:'LK'},
  ...(origin ? {url:origin+'/'} : {})
}
const social = origin ? [
  `<link rel="canonical" href="${origin}/">`,
  `<meta property="og:url" content="${origin}/">`,
  `<meta property="og:image" content="${origin}/social.png">`,
  '<meta property="og:image:alt" content="Rainmakers. Automate. Engage. Grow.">',
  `<meta name="twitter:image" content="${origin}/social.png">`
].join('\n') : '<meta property="og:image" content="/social.png"><meta name="twitter:image" content="/social.png">'
const rootMarker = '<div id="root"></div>'
if (!source.includes(rootMarker) || !source.includes('</head>')) {
  throw new Error('The built HTML is missing its prerender insertion points.')
}

const markup = render()
const required = ['home','about','solutions','why','process','sales-engine','outsourcing','pricing','faq','contact','talk','footer']
if (
  !required.every(id => markup.includes(`id="${id}"`)) ||
  (markup.match(/<h1(?:\s|>)/g) ?? []).length !== 1 ||
  !['30,000','80,000'].every(price => markup.includes(price))
) {
  throw new Error('Prerendered landing page is missing required content.')
}

const html = source.replace(rootMarker, () => `<div id="root">${markup}</div>`)
  .replace('</head>',`${social}\n<script type="application/ld+json">${JSON.stringify(organization)}</script>\n</head>`)
await writeFile(new URL('index.html',output),html)
await writeFile(new URL('robots.txt',output),`User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`)
if (origin) await writeFile(new URL('sitemap.xml',output),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`)
