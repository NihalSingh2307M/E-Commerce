import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollReveal — fade + slide up on scroll entry
 * @param {object} options - gsap fromVars + scrollTrigger overrides
 */
export const useScrollReveal = (options = {}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: options.y ?? 40, ...options.from },
        {
          opacity: 1,
          y: 0,
          duration: options.duration ?? 0.9,
          ease: options.ease ?? 'power3.out',
          delay: options.delay ?? 0,
          scrollTrigger: {
            trigger: el,
            start: options.start ?? 'top 88%',
            toggleActions: 'play none none none',
            ...options.scrollTrigger,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}

/**
 * useStaggerReveal — stagger children on scroll
 * @param {string} childSelector - CSS selector for children
 * @param {object} options
 */
export const useStaggerReveal = (childSelector = '*', options = {}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const children = el.querySelectorAll(childSelector)
      if (!children.length) return

      gsap.fromTo(
        children,
        { opacity: 0, y: options.y ?? 32, scale: options.scale ?? 1 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: options.duration ?? 0.75,
          ease: options.ease ?? 'power3.out',
          stagger: options.stagger ?? 0.1,
          scrollTrigger: {
            trigger: el,
            start: options.start ?? 'top 85%',
            toggleActions: 'play none none none',
            ...options.scrollTrigger,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}

/**
 * useParallax — scroll-based parallax on element
 * @param {number} speed - parallax speed (0.2 = subtle, 0.5 = strong)
 */
export const useParallax = (speed = 0.25) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * 100 * -1,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}

/**
 * useTextReveal — char/word split reveal
 * @param {object} options
 */
export const useTextReveal = (options = {}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: options.y ?? 60, clipPath: 'inset(0 0 100% 0)' },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: options.duration ?? 1.1,
          ease: options.ease ?? 'power4.out',
          delay: options.delay ?? 0,
          scrollTrigger: {
            trigger: el,
            start: options.start ?? 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}

/**
 * useHorizontalScroll — pinned horizontal scroll section
 */
export const usePinSection = (options = {}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: options.start ?? 'top top',
        end: options.end ?? '+=300',
        pin: true,
        pinSpacing: false,
        ...options.scrollTrigger,
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}

export { gsap, ScrollTrigger }
