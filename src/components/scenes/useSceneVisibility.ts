import { useEffect, useState, type RefObject } from 'react'

export function useSceneVisibility(element: RefObject<HTMLElement>) {
  const [visible, setVisible] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const [pageVisible, setPageVisible] = useState(false)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    if (!element.current || !('IntersectionObserver' in window)) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const small = matchMedia('(max-width: 767px), (pointer: coarse)')
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection
    const update = () => {
      setAllowed(!motion.matches && !connection?.saveData)
      setCompact(small.matches)
      setPageVisible(!document.hidden)
    }
    update()
    motion.addEventListener('change', update)
    small.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    connection?.addEventListener('change', update)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(element.current)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', update)
      small.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
      connection?.removeEventListener('change', update)
    }
  }, [element])

  return { allowed, compact, visible, pageVisible }
}
