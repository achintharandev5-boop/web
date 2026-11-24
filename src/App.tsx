import { useState } from 'react'
import { MotionConfig } from 'motion/react'
import { Activity, Bot, CircleDot, Clock3, Crosshair, Database, GitBranch, Layers3, MapPin, MessageCircle, Plus, Users, Zap } from 'lucide-react'
import { Navbar, Footer, Heading, Reveal, FeatureList, WhatsApp } from './components/ui'
import { ContactForm } from './components/ContactForm'
import { Hero } from './components/hero/Hero'
import { Dashboard, SolutionPreview, WorkflowVisual } from './components/Visuals'
import { ProcessTimeline } from './components/ProcessTimeline'
import { SolutionArtwork } from './components/scenes/SolutionArtwork'
import { benefits, engine, faq, outsourcing, plans, principles } from './data/content'
import { address, phone } from './lib/config'

const principleIcons = [Bot, Users, Crosshair]
const benefitIcons = [MessageCircle, Zap, Database, Clock3, Activity, Users]
const engineGroups = [
  ['Lead management', [1, 3, 4, 5, 8]],
  ['Engagement', [0, 2, 6, 7, 9]],
  ['Operations', [10, 11, 12]],
] as const

function About() {
  return <section id="about" className="section dark paper" tabIndex={-1}><div className="shell">
    <div className="split about-layout"><Heading label="About Rainmakers" title="We help businesses build better sales operations."/>
      <Reveal className="body-copy"><p>Rainmakers is a sales technology and outsourcing company helping businesses streamline sales operations through AI-powered automation and expert inbound sales management.</p><p>We believe businesses should be able to manage customer enquiries with speed, consistency and a clear process.</p><p>By bringing sales technology and experienced people together, we help businesses organise sales activities, maintain meaningful customer conversations and work towards better conversion.</p></Reveal>
    </div>
    <div className="principles">{principles.map(([title,body],index) => {const Icon=principleIcons[index];return <Reveal className="principle-card" key={title} delay={index*.08}><span className="section-icon"><Icon aria-hidden="true"/></span><h3>{title}</h3><p>{body}</p></Reveal>})}</div>
  </div></section>
}
function Solutions() {
  return <section id="solutions" className="section dark" tabIndex={-1}><div className="shell">
    <Heading label="Our solutions" title="Two ways to power your sales."><p>Whether you want to automate your sales process or have an expert team manage inbound sales for you, Rainmakers offers a solution to support your business.</p></Heading>
    <div className="split cards">{plans.map((plan,index) => {const Icon=index===0 ? Layers3 : Users;return <Reveal key={plan.id} delay={index*.08} className="solution-card">
      <SolutionArtwork managed={index === 1} />
      <div className="solution-content">
        <div className="solution-card-top"><span className="section-icon"><Icon size={23} strokeWidth={1.6} aria-hidden="true"/></span><p className="eyebrow">{plan.subtitle}</p></div>
        <h3>{plan.title}</h3><p>{plan.description}</p>
        <SolutionPreview managed={index === 1} />
        <a className="text-link" href={`#${plan.id}`}>Explore {index===0 ? 'Sales Engine' : 'Inbound Sales Outsourcing'}</a>
      </div>
    </Reveal>})}</div>
  </div></section>
}
function Benefits() {
  return <section id="why" className="section dark paper" tabIndex={-1}><div className="shell">
    <Heading label="Why Rainmakers" title="A more organised way to manage sales."/>
    <ul className="benefits">{benefits.map((benefit,index) => {const Icon=benefitIcons[index];return <li key={benefit}><Reveal delay={(index%3)*.08}><span className="section-icon"><Icon aria-hidden="true"/></span><p>{benefit}</p></Reveal></li>})}</ul>
  </div></section>
}
function Process() {
  return <section id="process" className="section dark" tabIndex={-1}><div className="shell">
    <Heading label="How it works" title="From enquiry to opportunity."/>
    <ProcessTimeline />
  </div></section>
}
function Services() {
  return <>
    <section id="sales-engine" className="section dark" tabIndex={-1}><div className="shell split showcase">
      <div><Heading label="Package 01 — Rainmakers Sales Engine" title="Put your sales process on autopilot."><p>Rainmakers Sales Engine is an AI-powered sales automation tool that helps businesses capture, manage, engage and follow up with leads through one connected sales workflow.</p><p>A CRM is built into the platform, alongside AI chat assistance, WhatsApp integration and automation capabilities.</p></Heading>
        <div className="feature-groups">{engineGroups.map(([label, indexes]) => <div key={label}><h3>{label}</h3><FeatureList items={indexes.map(index => engine.features[index])} /></div>)}</div>
        <WhatsApp light message={engine.message}>Enquire about Sales Engine</WhatsApp></div>
      <Reveal><Dashboard/></Reveal>
    </div></section>
    <section id="outsourcing" className="section dark paper" tabIndex={-1}><div className="shell split showcase">
      <div><Heading label="Package 02 — Inbound Sales Outsourcing" title={'We handle your inbound sales.\nEnd to end.'}><p>Our inbound sales expert team manages your incoming customer enquiries and works through the sales process on your behalf — from the first response to follow-up and conversion.</p><p>We represent your business in conversations with prospects and help move qualified opportunities forward.</p></Heading><FeatureList items={outsourcing.features}/><WhatsApp light message={outsourcing.message}>Discuss inbound sales outsourcing</WhatsApp></div>
      <Reveal><WorkflowVisual/></Reveal>
    </div></section>
  </>
}
function Pricing() {
  return <section id="pricing" className="section dark" tabIndex={-1}><div className="shell">
    <Heading label="Pricing" title="Simple plans. Real growth."><p>Choose the solution that fits your business.</p></Heading>
    <div className="split cards">{plans.map((plan,index) => <Reveal delay={index*.08} key={plan.id} className={`price-card ${index===1 ? 'price-card-elevated' : ''}`}>
      <h3>{plan.title}</h3><p className="price"><span>LKR</span> <strong>{plan.price}</strong><small> / month</small></p><p className="setup"><CircleDot size={14} aria-hidden="true"/> Zero setup fee</p><p>{plan.summary}</p><FeatureList items={plan.highlights}/><WhatsApp light message={plan.message}>Get started<span className="sr-only"> with {plan.title}</span></WhatsApp>
    </Reveal>)}</div>
  </div></section>
}
function FAQ() {
  const [open,setOpen] = useState<number|null>(0)
  return <section id="faq" className="section dark paper" tabIndex={-1}><div className="shell split faq-layout">
    <Heading label="FAQ" title="Frequently asked questions."><p>Choose the solution that fits your business.</p></Heading>
    <div className="accordion">{faq.map(([question,answer],index) => {
      const expanded = open===index
      return <div key={question} data-expanded={expanded}><h3><button id={`question-${index}`} type="button" aria-expanded={expanded} aria-controls={`answer-${index}`} onClick={() => setOpen(expanded ? null : index)}>{question}<span className="accordion-icon"><Plus aria-hidden="true"/></span></button></h3>
        <div className="answer" id={`answer-${index}`} aria-labelledby={`question-${index}`} aria-hidden={!expanded}><div><p>{answer}</p></div></div>
      </div>
    })}</div>
  </div></section>
}
function Contact() {
  return <section id="contact" className="section dark" tabIndex={-1}><div className="shell split contact-layout">
    <div><Heading label="Contact" title="Let’s talk about your sales."><p>Whether you’re interested in automating your sales process or outsourcing your inbound sales operation, talk to our team.</p><p>We’ll understand your requirements and help you explore the right solution.</p></Heading>
      <address className="contact-details">
        <div><span className="section-icon"><MessageCircle size={18} aria-hidden="true" /></span><div><span className="eyebrow">WhatsApp / Phone</span><a href="tel:+94766707391">{phone}</a></div></div>
        <div><span className="section-icon"><MapPin size={18} aria-hidden="true" /></span><div><span className="eyebrow">Address</span><p>{address}</p></div></div>
      </address><WhatsApp navbar>Chat on WhatsApp</WhatsApp></div>
    <ContactForm/>
  </div></section>
}
function FinalCTA() {
  return <section id="talk" className="section dark final" tabIndex={-1}><div className="final-lines" aria-hidden="true"/><div className="shell">
    <GitBranch aria-hidden="true"/><Heading title="Ready to grow your sales?"><p>Let’s discuss how Rainmakers can help your business automate sales or outsource inbound sales management.</p></Heading><WhatsApp navbar>Chat with Rainmakers on WhatsApp</WhatsApp>
  </div></section>
}
export default function App() {
  return <MotionConfig reducedMotion="user"><a className="skip" href="#main">Skip to content</a><Navbar/><main id="main" tabIndex={-1}>
    <Hero/><About/><Solutions/><Benefits/><Process/><Services/><Pricing/><FAQ/><Contact/><FinalCTA/>
  </main><Footer/></MotionConfig>
}

