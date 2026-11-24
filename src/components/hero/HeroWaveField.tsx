import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useSceneVisibility } from '../scenes/useSceneVisibility'

export function HeroWaveField() {
  const wrapper = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const time = useRef(0)
  const [paused, setPaused] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const { allowed, compact, visible, pageVisible } = useSceneVisibility(wrapper)
  const playing = allowed && visible && pageVisible && !paused && !failed

  useEffect(() => {
    if (!playing || !canvas.current || !wrapper.current || !('ResizeObserver' in window)) return
    const element = canvas.current
    const layer = wrapper.current
    const hero = layer.parentElement
    const ctx = element.getContext('2d')
    if (!ctx || !hero) {
      setFailed(true)
      return
    }

    let width = 0
    let height = 0
    let frame = 0
    let previous = 0
    const pointer = { x: 0, y: 0, active: false, strength: 0 }
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width
      height = entry.contentRect.height
      if (!width || !height) return
      const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.5, Math.sqrt(2_000_000 / (width * height)))
      element.width = Math.round(width * dpr)
      element.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    })
    resize.observe(layer)

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const box = layer.getBoundingClientRect()
      pointer.x = event.clientX - box.left
      pointer.y = event.clientY - box.top
      pointer.active = true
    }
    const leave = () => { pointer.active = false }
    if (!compact) {
      hero.addEventListener('pointermove', move, { passive: true })
      hero.addEventListener('pointerleave', leave, { passive: true })
    }

    const count = compact ? 14 : 38
    const segments = compact ? 50 : 96
    let first = true
    function draw(timestamp: number) {
      if (!ctx) return
      const delta = previous ? Math.min((timestamp - previous) / 1000, 0.05) : 0
      previous = timestamp
      time.current += delta
      const phase = time.current * 0.39
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * (1 - Math.exp(-5 * delta))
      if (width && height) {
        ctx.clearRect(0, 0, width, height)
        for (let row = 0; row < count; row++) {
          const depth = row / (count - 1)
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(196,209,226,' + (0.11 + depth * 0.17) + ')'
          ctx.lineWidth = row % 5 === 0 ? 1.2 : 0.8
          for (let col = 0; col <= segments; col++) {
            const u = col / segments
            const x = u * width
            const arc = Math.sin(u * 7.1 - depth * 3.1 - phase) * (0.08 + depth * 0.095)
              + Math.sin(u * 12.6 + depth * 2.7 + phase * 0.72) * 0.035
            let y = height * (0.17 + depth * 0.77 + arc)
            if (pointer.strength > 0.01) {
              const influence = Math.max(0, 1 - Math.hypot(pointer.x - x, pointer.y - y) / 220)
              y += 15 * pointer.strength * influence * influence * Math.sin((x - pointer.x) * 0.011 + phase)
            }
            if (col === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
        if (first) {
          first = false
          setReady(true)
        }
      }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
    }
  }, [compact, playing])

  const live = allowed && ready && !failed
  return <>
    <div className="hero-waves" ref={wrapper} data-live={live} aria-hidden="true">
      <img src="/rainmakers-waves.svg" width={1440} height={900} alt="" />
      <canvas ref={canvas} />
    </div>
    {live && <button type="button" className="hero-motion-control" aria-label={paused ? 'Resume wave animation' : 'Pause wave animation'}
      onClick={() => setPaused(value => !value)}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>}
  </>
}
