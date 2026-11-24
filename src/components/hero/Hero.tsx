import { motion, useReducedMotion } from 'motion/react'
import { WhatsApp } from '../ui'
import { HeroWaveField } from './HeroWaveField'

const ease = [0.22, 1, 0.36, 1] as const
const entrance = { opacity: [0.65, 1], y: [12, 0] }
const headline = { opacity: [0.85, 1], y: [14, 0] }

export function Hero() {
  const reduce = useReducedMotion()

  return <section id="home" className="hero dark" tabIndex={-1}>
    <div className="hero-layout">
      <div className="hero-copy">
        <motion.p className="hero-label" initial={false} animate={reduce ? undefined : { opacity: [0.7, 1] }} transition={{ duration: 0.45, ease }}>
          Sales technology &amp; outsourcing
        </motion.p>
        <h1>
          <motion.span initial={false} animate={reduce ? undefined : headline} transition={{ duration: 0.65, ease }}>AUTOMATE.</motion.span>{' '}
          <motion.span initial={false} animate={reduce ? undefined : headline} transition={{ duration: 0.65, delay: 0.09, ease }}>ENGAGE. GROW.</motion.span>
        </h1>
        <motion.p className="hero-description" initial={false} animate={reduce ? undefined : entrance} transition={{ duration: 0.5, delay: 0.13, ease }}>
          Turn more customer enquiries into customers with AI-powered sales automation and expert inbound sales support.
        </motion.p>
        <motion.div className="hero-buttons" initial={false} animate={reduce ? undefined : entrance} transition={{ duration: 0.45, delay: 0.21, ease }}>
          <WhatsApp light navbar>CONTACT US ON WHATSAPP</WhatsApp>
          <a className="button button-outline" href="#solutions">EXPLORE OUR SOLUTIONS</a>
        </motion.div>
      </div>
    </div>
    <HeroWaveField />
  </section>
}
