import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { assets } from '../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const containerRef = useRef(null)
  const imgRef       = useRef(null)
  const ctaRef       = useRef(null)
  const scrollIndRef = useRef(null)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(imgRef.current, { scale: 1.1, opacity: 0, duration: 1.8, ease: 'power3.out', delay: 0.1 })
      const tl = gsap.timeline({ delay: 0.5 })
      tl.from('.hero-label',   { opacity: 0, y: 24, duration: 0.55, ease: 'power2.out' })
        .from('.hero-line',    { opacity: 0, scaleX: 0, transformOrigin: 'left', duration: 0.6, ease: 'power3.out' }, '-=0.2')
        .from('.hero-heading', { opacity: 0, y: 50, duration: 1, ease: 'power3.out', stagger: 0.12 }, '-=0.3')
        .from('.hero-sub',     { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .from('.hero-cta',     { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .from('.hero-stat',    { opacity: 0, y: 20, duration: 0.55, stagger: 0.08, ease: 'power2.out' }, '-=0.25')
        .from('.hero-scroll',  { opacity: 0, duration: 0.5 }, '-=0.3')
        .from('.hero-year',    { opacity: 0, duration: 0.5 }, '-=0.4')
      gsap.to(imgRef.current, {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.4 },
      })
      if (scrollIndRef.current) {
        gsap.to(scrollIndRef.current, { opacity: 0.25, repeat: -1, yoyo: true, duration: 1.5, ease: 'sine.inOut', delay: 2.5 })
      }
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    if (!imgRef.current) return
    const ctx = gsap.context(() => {
      const el = imgRef.current
      const onMove = (e) => {
        const x = (e.clientX / window.innerWidth  - 0.5) * 18
        const y = (e.clientY / window.innerHeight - 0.5) * 18
        gsap.to(el, { x, y, duration: 0.9, ease: 'power2.out', overwrite: 'auto' })
      }
      const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'power2.out' })
      window.addEventListener('mousemove', onMove, { passive: true })
      window.addEventListener('mouseleave', onLeave)
      return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave) }
    }, imgRef)
    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    if (!ctaRef.current) return
    const ctx = gsap.context(() => {
      const btn  = ctaRef.current
      const fill = btn.querySelector('.cta-fill')
      const enter = () => gsap.to(fill, { scaleX: 1, duration: 0.38, ease: 'power2.out' })
      const leave = () => gsap.to(fill, { scaleX: 0, duration: 0.32, ease: 'power2.in' })
      btn.addEventListener('mouseenter', enter)
      btn.addEventListener('mouseleave', leave)
      return () => { btn.removeEventListener('mouseenter', enter); btn.removeEventListener('mouseleave', leave) }
    }, ctaRef)
    return () => ctx.revert()
  }, [])

  const stats = [
    { value: '52+',  label: 'Collections' },
    { value: '4.9★', label: 'Rating'      },
    { value: 'Free', label: 'Delivery'    },
    { value: '7-Day',label: 'Returns'     },
  ]

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]"
      style={{ height: '100vh', minHeight: '640px' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imgRef}
          src={assets.hero_img}
          alt="Forever — Premium Fashion"
          className="w-full h-full object-cover object-center"
          style={{ willChange: 'transform', transformOrigin: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E0D0B]/70 via-[#0E0D0B]/25 to-[#0E0D0B]/82" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0D0B]/60 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(14,13,11,0.5) 100%)' }} />
      </div>

      {/* Corner accents */}
      <div className="absolute top-24 left-6 sm:left-10 flex flex-col gap-1">
        <span className="block w-5 h-px bg-[#B8956A]/50" />
        <span className="block w-px h-5 bg-[#B8956A]/50" />
      </div>
      <div className="absolute top-24 right-6 sm:right-10 flex flex-col items-end gap-1">
        <span className="block w-5 h-px bg-[#B8956A]/50" />
        <span className="block w-px h-5 bg-[#B8956A]/50 ml-auto" />
      </div>

      <div className="hero-year absolute top-[6.5rem] right-6 sm:right-10">
        <p className="jost text-white/30 text-[9px] tracking-[0.45em] uppercase font-light">SS / 2025</p>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end pb-24 sm:pb-28 px-6 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <div className="flex items-center gap-4 mb-5">
          <p className="hero-label jost text-[#B8956A] text-[9px] sm:text-[10px] tracking-[0.5em] uppercase font-medium">New Collection</p>
          <span className="hero-line block flex-1 max-w-[60px] h-px bg-[#B8956A]/50" />
        </div>

        <div className="mb-5 overflow-visible">
          <h1 className="hero-heading playfair leading-[0.88] tracking-tight text-white font-normal"
              style={{ fontSize: 'clamp(3.2rem,10.5vw,8.5rem)' }}>
            Wear the
          </h1>
          <h1 className="hero-heading playfair leading-[0.88] tracking-tight text-[#C9A97A] font-normal italic"
              style={{ fontSize: 'clamp(3.2rem,10.5vw,8.5rem)' }}>
            Moment
          </h1>
        </div>

        <p className="hero-sub jost text-white/52 text-sm sm:text-[0.9rem] font-light tracking-wide mb-8 max-w-xs sm:max-w-sm leading-relaxed">
          Curated fashion for every story you choose to tell.
        </p>

        <div className="hero-cta mb-12 sm:mb-16">
          <Link to="/collection">
            <div
              ref={ctaRef}
              className="relative overflow-hidden inline-flex items-center gap-3 bg-[#B8956A] px-7 py-3.5 cursor-pointer"
            >
              <span className="cta-fill absolute inset-0 bg-[#C9A97A] origin-left block" style={{ transform: 'scaleX(0)' }} />
              <span className="relative z-10 jost font-semibold text-[10px] tracking-[0.35em] uppercase text-[#1C1C1C]">Explore Collection</span>
              <span className="relative z-10 text-[#1C1C1C] text-base leading-none">→</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-8 sm:gap-14">
          {stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <p className="playfair text-white text-xl sm:text-2xl font-medium leading-none">{s.value}</p>
              <p className="jost text-white/35 text-[9px] sm:text-[10px] tracking-[0.28em] uppercase mt-1 font-light">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll absolute right-6 sm:right-8 bottom-28 sm:bottom-32 flex flex-col items-center gap-3">
        <p ref={scrollIndRef} className="jost text-white/55 text-[9px] tracking-[0.42em] uppercase font-light" style={{ writingMode: 'vertical-rl' }}>
          Scroll
        </p>
        <div className="w-px h-10 bg-white/15 overflow-hidden">
          <div className="w-full bg-[#B8956A]" style={{ height: '50%', animation: 'slideDown 1.9s ease-in-out infinite' }} />
        </div>
      </div>
    </div>
  )
}

export default Hero
