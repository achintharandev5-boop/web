export const phone = '+94 76 670 7391'
export const address = 'A6F43, Bloemendhal, Colombo 13, Sri Lanka'
export const whatsapp = (message = "Hi Rainmakers, I'd like to learn more about your solutions.") =>
  `https://wa.me/94766707391?text=${encodeURIComponent(message)}`

export function publicEndpoint(value: string | undefined) {
  if (!value || /\s/.test(value) || value.includes('\\')) return undefined
  if (value.startsWith('/') && !value.startsWith('//')) return value
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href
  } catch { return undefined }
  return undefined
}
