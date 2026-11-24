import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { AudioLines, Bot, CircleCheck, Database, Inbox, MessageSquareText, Target, Users, Workflow } from 'lucide-react'
import { outsourcing } from '../data/content'

const salesFlow = [
  ['Capture', Inbox], ['Engage', Bot], ['Qualify', Database], ['Follow-up', MessageSquareText],
] as const
const inboundFlow = [
  ['Incoming enquiry', Inbox], ['Sales specialist', Users], ['Qualification', Target],
  ['Follow-up', MessageSquareText], ['Conversion', CircleCheck],
] as const
const inboundDetails = [0, 1, 3, 6, 7] as const
const orbitPositions = [[50, 14], [81, 38], [70, 78], [30, 78], [19, 38]] as const
const samples = [
  { label: 'New', status: 'Enquiry captured', followUp: 'Continue the enquiry', message: 'Can you share more about your services?', reply: 'Of course. What would you like to explore?', activity: [2, 4, 3, 5, 4, 6, 7, 6] },
  { label: 'Qualified', status: 'Requirements recorded', followUp: 'Share the relevant service details', message: 'We’re looking for inbound sales support.', reply: 'How are you handling enquiries today?', activity: [2, 3, 3, 5, 5, 6, 7, 8] },
  { label: 'Follow-up', status: 'Follow-up scheduled', followUp: 'Check in next week', message: 'Could we discuss this next week?', reply: 'I’ll make a note to follow up next week.', activity: [3, 4, 4, 5, 6, 7, 6, 8] },
] as const

export function SolutionPreview({ managed }: { managed: boolean }) {
  const reduce = useReducedMotion()
  const sequence = managed ? inboundFlow : salesFlow
  return <figure className="solution-preview" data-managed={managed}>
    <figcaption>{managed ? 'Inbound workflow' : 'Automation workflow'}</figcaption>
    <div className="preview-flow">
      <motion.span className="preview-track" aria-hidden="true" initial={false} whileInView={reduce ? undefined : { scaleX: [0, 1], opacity: [0.2, 1] }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
      <ol>{sequence.map(([label, Icon]) => <li key={label}><span><Icon size={17} strokeWidth={1.65} aria-hidden="true" /></span>{label}</li>)}</ol>
    </div>
  </figure>
}

export function Dashboard() {
  const [selected, setSelected] = useState(0)
  const reduce = useReducedMotion()
  const sample = samples[selected]

  return <figure className="dashboard">
    <figcaption><Workflow size={19} aria-hidden="true" /> Sales Engine <span>Illustrative sample data</span></figcaption>
    <div className="dashboard-body">
      <div className="pipeline">
        <h3>Lead pipeline</h3>
        <div className="pipeline-grid" role="group" aria-label="Example pipeline stage">
          {samples.map(({ label }, index) => <button type="button" key={label} aria-pressed={selected === index}
            onClick={() => setSelected(index)}>{label}</button>)}
        </div>
        <div className="pipeline-meter" aria-hidden="true"><span style={{ transform: 'scaleX(' + (selected + 1) / samples.length + ')' }} /></div>
      </div>
      <div className="dashboard-split">
        <div className="conversation"><h3><MessageSquareText size={16} aria-hidden="true" /> AI conversation</h3>
          <motion.div key={sample.label} initial={false} animate={reduce ? undefined : { opacity: [0.6, 1], y: [4, 0] }} transition={{ duration: 0.24 }}>
            <p className="bubble">{sample.message}</p><p className="bubble reply">{sample.reply}</p>
          </motion.div>
        </div>
        <div className="dashboard-chart"><h3><AudioLines size={16} aria-hidden="true" /> Sales activity</h3>
          <div className="activity" role="img" aria-label={`Illustrative sales activity counts ${sample.activity.join(', ')}`}>
            {sample.activity.map((count, index) => <motion.i key={index} style={{ height: count * 10 + '%' }} title={`Illustrative count ${count}`} initial={false}
              whileInView={reduce ? undefined : { scaleY: [0.25, 1] }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.04 }} />)}
          </div>
        </div>
      </div>
      <div className="flow-label"><Database size={17} aria-hidden="true" /><div><strong>CRM status</strong><span role="status">{sample.status}</span></div></div>
      <div className="flow-label"><MessageSquareText size={17} aria-hidden="true" /><div><strong>Follow-up activity</strong><span>{sample.followUp}</span></div></div>
    </div>
  </figure>
}

export function WorkflowVisual() {
  const [selected, setSelected] = useState(0)
  const reduce = useReducedMotion()

  return <figure className="workflow-visual">
    <figcaption><Users size={19} aria-hidden="true" /> Inbound sales workflow</figcaption>
    <div className="workflow-path">
      <svg className="workflow-track" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="50" cy="48" rx="34" ry="33" fill="none" stroke="#8993a255" vectorEffect="non-scaling-stroke" />
        <motion.path d="M 50 14 C 69 14 83 26 81 38 C 84 54 81 71 70 78 C 53 88 45 88 30 78 C 15 67 14 54 19 38 C 20 25 34 14 50 14" fill="none" stroke="#aeb8ca" vectorEffect="non-scaling-stroke"
          initial={false} whileInView={reduce ? undefined : { pathLength: [0, 1] }} viewport={{ once: true }} transition={{ duration: 0.85 }} />
      </svg>
      <span className="workflow-hub" aria-hidden="true"><Users size={33} strokeWidth={1.4} /></span>
      <ol className="workflow-steps">
      {inboundFlow.map(([label, Icon], index) => <li key={label} style={{ left: orbitPositions[index][0] + '%', top: orbitPositions[index][1] + '%' }}>
        <button type="button" aria-pressed={index === selected} onClick={() => setSelected(index)}>
          <span className="workflow-icon"><Icon size={18} aria-hidden="true" /></span>
          <span>{label}</span>
        </button>
      </li>)}
      </ol>
    </div>
    <p className="workflow-detail" role="status">{outsourcing.features[inboundDetails[selected]]}</p>
  </figure>
}
