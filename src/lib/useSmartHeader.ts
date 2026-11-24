import { useEffect, useState, type RefObject } from 'react'

const topThreshold = 80
const scrollThreshold = 8

interface HeaderState {
  visible: boolean
  atTop: boolean
  dark: boolean
  boundary: boolean
  active: string
}

function getActiveLink(section: string) {
  if (['why', 'sales-engine', 'outsourcing'].includes(section)) return 'solutions'
  if (section === 'faq') return 'pricing'
  if (section === 'talk') return 'contact'
  return section
}

export function useSmartHeader(header: RefObject<HTMLElement>, keepVisible: boolean): HeaderState {
  const [state, setState] = useState<HeaderState>({
    visible: true,
    atTop: true,
    dark: true,
    boundary: false,
    active: 'home',
  })

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section, #footer')).reverse()
    const control = header.current?.querySelector<HTMLElement>('.menu-toggle')
    const desktopNav = header.current?.querySelector<HTMLElement>('.desktop-nav')
    let referenceY = Math.max(0, window.scrollY)
    let visible = true
    let frame = 0
    let previous: HeaderState | undefined

    function update() {
      frame = 0
      const y = Math.max(0, window.scrollY)
      const atTop = y < topThreshold

      if (atTop || keepVisible) {
        visible = true
        referenceY = y
      } else {
        // Track the extremum while moving in the current direction so small reversals are ignored.
        const delta = y - referenceY
        if (visible ? delta >= scrollThreshold : delta <= -scrollThreshold) {
          visible = !visible
          referenceY = y
        } else {
          referenceY = visible ? Math.min(referenceY, y) : Math.max(referenceY, y)
        }
      }

      // Layout offsets ignore the header's animated transform. Glass padding surrounds the 44px control row.
      const panel = control?.offsetParent ? control : desktopNav
      const rowCenter = (panel?.offsetTop ?? 0) + (panel?.offsetHeight ?? 44) / 2
      const positions = sections.map(section => ({ section, top: section.getBoundingClientRect().top }))
      const surface = positions.find(({ top }) => top <= rowCenter)
      const dark = surface?.section.classList.contains('dark') ?? true
      const boundary = positions.some(({ top, section }, index) => {
        const preceding = sections[index + 1]
        return preceding && Math.abs(top - rowCenter) < 22 &&
          section.classList.contains('dark') !== preceding.classList.contains('dark')
      })
      const current = positions.find(({ top, section }) => section.id !== 'footer' && top <= Math.min(160, window.innerHeight / 3))
      const active = atTop ? 'home' : getActiveLink(current?.section.id ?? 'home')

      if (previous?.visible === visible && previous.atTop === atTop && previous.active === active &&
        previous.dark === dark && previous.boundary === boundary) return

      previous = { visible, atTop, dark, boundary, active }
      setState(previous)
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    update()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [header, keepVisible])

  return state
}
