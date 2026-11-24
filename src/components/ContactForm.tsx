import { useState, useSyncExternalStore } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { publicEndpoint } from '../lib/config'
import { MessageCircle } from 'lucide-react'

const interests = ['Sales Engine','Inbound Sales Outsourcing','Both'] as const
const schema = z.object({
  name:z.string().trim().min(1,'Enter your name.').max(100),
  business:z.string().trim().min(1,'Enter your business name.').max(120),
  phone:z.string().trim().max(30).refine(value => /^\+?[\d(). -]+$/.test(value) && /^\d{7,15}$/.test(value.replace(/\D/g,'')),'Enter a valid phone or WhatsApp number.'),
  email:z.string().trim().max(254).email('Enter a valid email address.').or(z.literal('')),
  interest:z.enum(interests),
  message:z.string().trim().min(1,'Enter a message.').max(2000),
  website:z.string().max(0)
})
type Enquiry = z.infer<typeof schema>
const endpoint = publicEndpoint(import.meta.env.VITE_CONTACT_ENDPOINT)
const hydratedSnapshot = () => true
const staticSnapshot = () => false
const subscribeToHydration = () => () => {}
const fields = [
  ['name','Name','name','text',100],
  ['business','Business name','organization','text',120],
  ['phone','Phone / WhatsApp number','tel','tel',30],
  ['email','Email address (optional)','email','email',254]
] as const

export function ContactForm() {
  const [result,setResult] = useState<'idle'|'success'|'error'>('idle')
  const hydrated = useSyncExternalStore(subscribeToHydration,hydratedSnapshot,staticSnapshot)
  const {register,handleSubmit,reset,formState:{errors,isSubmitting}} = useForm<Enquiry>({resolver:zodResolver(schema),mode:'onBlur',defaultValues:{interest:'Both',website:''}})
  const submit = async (data:Enquiry) => {
    if (!endpoint) return
    setResult('idle')
    try {
      const response = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000),redirect:'error'})
      if (!response.ok || (await response.json()).accepted !== true) throw new Error('Enquiry not accepted')
      reset()
      setResult('success')
    } catch { setResult('error') }
  }
  return <form className="enquiry" method="post" aria-labelledby="enquiry-title" noValidate onSubmit={handleSubmit(submit,() => setResult('idle'))}>
    <h3 id="enquiry-title">Online enquiry</h3>
    {!endpoint && <p id="form-pending" className="pending"><MessageCircle size={17} aria-hidden="true" /><span>Online enquiries are pending activation. Please use WhatsApp to reach the team.</span></p>}
    <fieldset className="form-grid" disabled={!hydrated || !endpoint || isSubmitting} aria-describedby={endpoint ? undefined : 'form-pending'}>
      <legend className="sr-only">Enquiry details</legend>
      {fields.map(([name,label,auto,type,length]) => <div key={name}><label htmlFor={name}>{label}</label><input id={name} type={type} autoComplete={auto} maxLength={length} required={name !== 'email'} spellCheck={name === 'email' ? false : undefined} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} {...register(name)}/>{errors[name] && <p className="field-error" id={`${name}-error`}>{errors[name]?.message}</p>}</div>)}
      <div className="span-all"><label htmlFor="interest">Interested in</label><select id="interest" defaultValue="Both" {...register('interest')}>{interests.map(value => <option key={value}>{value}</option>)}</select></div>
      <div className="span-all"><label htmlFor="message">Message</label><textarea id="message" rows={4} required maxLength={2000} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} {...register('message')}/>{errors.message && <p className="field-error" id="message-error">{errors.message.message}</p>}</div>
      <div hidden><label htmlFor="website">Leave this empty</label><input id="website" autoComplete="off" tabIndex={-1} {...register('website')}/></div>
    </fieldset>
    <button type="submit" className="button button-dark" disabled={!hydrated || !endpoint || isSubmitting} aria-describedby={endpoint ? undefined : 'form-pending'}>{isSubmitting ? 'Sending enquiry…' : endpoint ? 'Send enquiry' : 'Online submission unavailable'}</button>
    <div role="status">{result === 'success' && 'Thank you for contacting Rainmakers. Our team will get in touch with you soon.'}</div>
    {result === 'error' && <p role="alert">We couldn’t send your enquiry. Please try again or contact us on WhatsApp.</p>}
  </form>
}
