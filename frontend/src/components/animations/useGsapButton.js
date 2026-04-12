import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'

/**
 * Reusable GSAP left-to-right fill animation for buttons.
 * Attach ref to the button element; it must contain a child with class `btn-fill`.
 */
const useGsapButton = (btnRef) => {
  useLayoutEffect(() => {
    if (!btnRef.current) return

    const ctx = gsap.context(() => {
      const btn  = btnRef.current
      const fill = btn.querySelector('.btn-fill')
      if (!fill) return

      const enter = () => gsap.to(fill, { scaleX: 1, duration: 0.42, ease: 'power2.out' })
      const leave = () => gsap.to(fill, { scaleX: 0, duration: 0.36, ease: 'power2.in' })

      btn.addEventListener('mouseenter', enter)
      btn.addEventListener('mouseleave', leave)

      return () => {
        btn.removeEventListener('mouseenter', enter)
        btn.removeEventListener('mouseleave', leave)
      }
    }, btnRef)

    return () => ctx.revert()
  }, [])
}

export default useGsapButton
