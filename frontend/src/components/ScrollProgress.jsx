import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ScrollProgress = () => {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    })

    return () => ScrollTrigger.getAll().forEach((t) => {
      if (t.vars?.trigger === document.documentElement) t.kill()
    })
  }, [])

  return (
    <div
      ref={barRef}
      id="scroll-progress"
      className="scale-x-0 origin-left"
    />
  )
}

export default ScrollProgress
