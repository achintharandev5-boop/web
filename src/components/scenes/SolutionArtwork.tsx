import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Pause, Play } from 'lucide-react'
import { useSceneVisibility } from './useSceneVisibility'

const SolutionScene = lazy(() => import('./SolutionScene'))

export class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? null : this.props.children }
}

function SceneFallback({ managed }: { managed: boolean }) {
  return <svg viewBox="0 0 640 340" className="scene-fallback" aria-hidden="true" focusable="false">
    <g fill="none" stroke="#a8b4c3" strokeOpacity=".38">
      <ellipse cx="320" cy="170" rx="231" ry="82" transform={managed ? 'rotate(-10 320 170)' : 'rotate(-17 320 170)'} />
      <ellipse cx="320" cy="170" rx="214" ry="109" transform={managed ? 'rotate(12 320 170)' : 'rotate(20 320 170)'} />
      <path d="M116 210 320 170 493 94M181 90 320 170 526 199M303 273 320 170 396 65" />
    </g>
    <g fill="#17191d" stroke="#e0e6ef">
      {[[116,210],[181,90],[493,94],[526,199],[303,273],[396,65]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="5" />)}
      {managed ? <g strokeWidth="1.5">
        <circle cx="320" cy="141" r="19" /><circle cx="267" cy="155" r="15" /><circle cx="373" cy="155" r="15" />
        <path d="M288 207v-9a32 28 0 0 1 64 0v9ZM239 209v-9a25 24 0 0 1 45-14l-3 23ZM401 209v-9a25 24 0 0 0-45-14l3 23Z" />
      </g> : <g strokeWidth="1.3">
        <path d="M320 103 378 136 378 204 320 237 262 204 262 136Z" />
        <path d="M320 103 320 170 378 204M262 204 320 170 378 136M262 136 320 237" fill="none" />
        <circle cx="320" cy="170" r="12" />
      </g>}
    </g>
  </svg>
}

export function SolutionArtwork({ managed }: { managed: boolean }) {
  const stage = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0, active: false })
  const [paused, setPaused] = useState(false)
  const [started, setStarted] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const { visible, pageVisible, allowed, compact } = useSceneVisibility(stage)
  const running = visible && pageVisible && allowed && !paused
  const start = visible && pageVisible && allowed
  const live = allowed && started && !failed
  const fail = () => setFailed(true)

  useEffect(() => {
    if (start) setStarted(true)
    if (!allowed) setReady(false)
  }, [allowed, start])

  return <div className="solution-artwork" ref={stage} data-managed={managed} data-live={live && ready}
    onPointerMove={event => {
      if (compact || !running || event.pointerType !== 'mouse') return
      const box = event.currentTarget.getBoundingClientRect()
      pointer.current.x = (event.clientX - box.left) / box.width * 2 - 1
      pointer.current.y = 1 - (event.clientY - box.top) / box.height * 2
      pointer.current.active = true
    }}
    onPointerLeave={() => { pointer.current.active = false }}>
    <div className="solution-art-content" aria-hidden="true">
      <SceneFallback managed={managed} />
      {live && <div className="solution-canvas">
        <SceneBoundary onFailure={fail}>
          <Suspense fallback={null}>
            <SolutionScene managed={managed} compact={compact} pointer={pointer} onReady={setReady} onFailure={setFailed}
              loop={running ? 'always' : visible && pageVisible ? 'demand' : 'never'} />
          </Suspense>
        </SceneBoundary>
      </div>}
    </div>
    {live && ready && <button type="button" className="scene-motion-control"
      aria-label={(paused ? 'Resume ' : 'Pause ') + (managed ? 'outsourcing animation' : 'Sales Engine animation')}
      onClick={() => {pointer.current.active = false; setPaused(value => !value)}}>
      {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
    </button>}
  </div>
}
