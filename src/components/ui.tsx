import { useState, useEffect, useRef, type ReactNode } from 'react'
import { MessageCircle, Menu, X, Check } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { navigation } from '../data/content'
import { address, phone, whatsapp } from '../lib/config'
import { useSmartHeader } from '../lib/useSmartHeader'

export function WhatsApp({children, message, light = false, navbar = false}: {children:ReactNode; message?:string; light?:boolean; navbar?:boolean}) {
  return <a className={`button ${light ? 'button-light' : 'button-dark'}${navbar ? ' button-whatsapp' : ''}`} href={whatsapp(message)} target="_blank" rel="noopener noreferrer">{navbar ? <img className="whatsapp-mark" src="/whatsapp.svg" width={22} height={22} alt="" aria-hidden="true"/> : <MessageCircle size={17} aria-hidden="true"/>}{children}</a>
}
export function Brand({dark = false, square = false, onSelect}: {dark?:boolean; square?:boolean; onSelect?:()=>void}) {
  const asset = square ? import.meta.env.VITE_LOGO_LIGHT || '/rainmakers-logo.jpeg' : dark ? import.meta.env.VITE_LOGO_DARK : import.meta.env.VITE_LOGO_LIGHT
  return <a className={`brand${square ? ' nav-brand' : ''}`} href="#home" aria-label="Rainmakers home" onClick={onSelect}>{asset ? <img src={asset} alt="Rainmakers" width={square ? 120 : 152} height={square ? 120 : 30}/> : 'RAINMAKERS'}</a>
}
function NavLinks({active, onSelect, minimal}: {active?:string; onSelect?:(id:string)=>void; minimal?:boolean}) {
  return navigation.map(([label,id]) => {
    const extra = id === 'home' || id === 'process' || id === 'about'
    const hidden = extra && minimal
    return <a key={id} href={`#${id}`} data-extra={extra && minimal !== undefined || undefined} aria-hidden={hidden || undefined} {...(hidden ? {inert: ''} : {})}
      tabIndex={hidden ? -1 : undefined} aria-current={active === id ? 'location' : undefined}
      onClick={() => onSelect?.(id)}>{label}</a>
  })
}
export function Navbar() {
  const [open,setOpen] = useState(false)
  const [focused,setFocused] = useState<HTMLElement|null>(null)
  const header = useRef<HTMLElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const destination = useRef<string>()
  const { visible, atTop, dark, boundary, active } = useSmartHeader(header, open || focused !== null)
  const hidden = !visible && !open && !focused
  const minimal = !atTop && !focused?.hasAttribute('data-extra')

  useEffect(() => {
    const desktop = matchMedia('(min-width: 1024px)')
    const close = () => { if(desktop.matches) dialog.current?.close() }
    desktop.addEventListener('change',close)
    return () => desktop.removeEventListener('change',close)
  },[])
  function onClose() {
    setOpen(false)
    const id = destination.current
    destination.current = undefined
    if (id) document.getElementById(id)?.focus({preventScroll:true})
    else if (trigger.current?.getClientRects().length) trigger.current.focus()
    else header.current?.querySelector<HTMLElement>('.nav-brand')?.focus()
  }
  return <><div className="nav-spacer" aria-hidden="true"/><header ref={header} className="nav" data-hidden={hidden} data-dark={dark} data-boundary={boundary}>
    <div className="shell nav-inner" {...(hidden ? {inert: ''} : {})}
      onFocus={event => setFocused(event.target)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null) }}>
      <Brand square/>
      <nav aria-label="Main navigation" className="desktop-nav" data-minimal={minimal}><NavLinks active={active} minimal={minimal}/></nav>
      <button ref={trigger} className="menu-toggle" aria-label="Open navigation" aria-controls="mobile-menu" aria-expanded={open} onClick={() => {dialog.current?.showModal();setOpen(true)}}>
        <Menu className="menu-outline" strokeWidth={4} aria-hidden="true"/><Menu aria-hidden="true"/>
      </button>
    </div>
    <dialog id="mobile-menu" ref={dialog} aria-label="Mobile navigation" onClose={onClose}>
      <div className="dialog-bar"><Brand square onSelect={() => {destination.current="home";dialog.current?.close()}}/><button autoFocus aria-label="Close navigation" onClick={() => dialog.current?.close()}><X aria-hidden="true"/></button></div>
      <nav aria-label="Mobile links"><NavLinks active={active} onSelect={id => {destination.current=id;dialog.current?.close()}}/></nav>
    </dialog>
  </header></>
}
export function Reveal({children, className='', delay=0}: {children:ReactNode; className?:string; delay?:number}) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={false} whileInView={reduce ? undefined : {opacity:[.72,1],y:[20,0]}} viewport={{once:true,amount:0.22}} transition={{duration:.6,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>
}
export function Heading({label,title,children}: {label?:string;title:string;children?:ReactNode}) {
  return <Reveal className="section-heading">{label && <p className="eyebrow">{label}</p>}<h2>{title}</h2>{children && <div className="section-lead">{children}</div>}</Reveal>
}
export function FeatureList({items}: {items:string[]}) {
  return <ul className="features">{items.map(item => <li key={item}><Check size={16} aria-hidden="true"/>{item}</li>)}</ul>
}
export function Footer() {
  return <footer id="footer" className="dark"><div className="shell">
    <div className="footer-grid"><div className="footer-brand"><Brand square/><div><p>Automate. Engage. Grow.</p><p>Sales technology &amp; outsourcing.</p></div></div>
    <div><p className="eyebrow">Explore</p><nav aria-label="Footer navigation"><NavLinks/></nav></div>
    <div><p className="eyebrow">Contact</p><address><a href="tel:+94766707391">{phone}</a><p>{address}</p></address></div></div>
    <div className="fine-print">© {new Date().getUTCFullYear()} Rainmakers. All rights reserved.</div>
  </div></footer>
}

