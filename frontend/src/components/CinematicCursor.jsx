import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

const CinematicCursor = () => {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useLayoutEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Fast-following dot + lagging ring for depth
    const moveDot = (e) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY })
    }

    const moveRing = (e) => {
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('mousemove', moveDot, { passive: true })
    window.addEventListener('mousemove', moveRing, { passive: true })

    return () => {
      window.removeEventListener('mousemove', moveDot)
      window.removeEventListener('mousemove', moveRing)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className='cursor-dot'  />
      <div ref={ringRef} className='cursor-ring' />
    </>
  )
}

export default CinematicCursor
