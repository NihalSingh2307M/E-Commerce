import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

const PageTransition = ({ children }) => {
  const location   = useLocation()
  const overlayRef = useRef(null)

  useEffect(() => {
    const isHome = location.pathname === '/' || location.pathname === '/home'
    if (isHome) return

    const overlay = overlayRef.current
    gsap.set(overlay, { clipPath: 'inset(0 0% 0 0)', display: 'block' })
    gsap.to(overlay, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1.0,
      ease: 'power4.inOut',
      delay: 0.05,
      onComplete: () => gsap.set(overlay, { display: 'none' }),
    })
  }, [location.pathname])

  return (
    <div className="relative">
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-[#F7F6F4] z-[9999] pointer-events-none hidden"
      />
      {children}
    </div>
  )
}

export default PageTransition
