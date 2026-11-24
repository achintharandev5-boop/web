import { useRef, useState } from 'react'
import { CheckCircle2, Crosshair, Inbox, MessageCircle } from 'lucide-react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { stages } from '../data/content'

const icons = [Inbox, MessageCircle, Crosshair, CheckCircle2]

export function ProcessTimeline() {
  const timeline = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState(0)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: timeline, offset: ['start 0.8', 'end 0.24'] })

  useMotionValueEvent(scrollYProgress, 'change', progress => {
    const step = Math.min(stages.length - 1, Math.floor(progress * stages.length))
    setSelected(current => current === step ? current : step)
  })

  return <div className="timeline" ref={timeline}>
    <div className="timeline-line" aria-hidden="true">
      <motion.div initial={false} whileInView={reduce ? undefined : { opacity: [0, 1] }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
        <span style={{ '--step-progress': selected / (stages.length - 1) } as React.CSSProperties} />
      </motion.div>
    </div>
    <ol>{stages.map(([title, body], index) => {
      const Icon = icons[index]
      const active = index === selected
      return <li key={title} data-active={active}>
        <h3><button type="button" aria-pressed={active} onClick={() => setSelected(index)}>
          <span className="stage-icon"><Icon size={21} aria-hidden="true" /></span>
          <span className="stage-number">0{index + 1}</span>
          <span>{title}</span>
        </button></h3>
        <p>{body}</p>
      </li>
    })}</ol>
  </div>
}
