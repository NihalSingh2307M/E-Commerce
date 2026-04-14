import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { assets } from '../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  const containerRef = useRef(null)
  const imgRef       = useRef(null)
  const ctaRef       = useRef(null)
  const scrollIndRef = useRef(null)

  /* ── 1. Entry animation ─────────────────────────────────────────── */
  useLayoutEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger)

      // Image reveal — fade in from slightly scaled down
      gsap.from(imgRef.current, {
        scale: 1.08,
        opacity: 0,
        duration: 1.6,
        ease: 'power3.out',
        delay: 0.1,
      })

      // Staggered text entry — fade + slide up
      const tl = gsap.timeline({ delay: 0.4 })
      tl.from('.hero-label',   { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' })
        .from('.hero-heading', { opacity: 0, y: 40, duration: 0.9, ease: 'power2.out', stagger: 0.1 }, '-=0.2')
        .from('.hero-sub',     { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .from('.hero-cta',     { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.25')
        .from('.hero-stats',   { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, '-=0.2')
        .from('.hero-scroll',  { opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .from('.hero-year',    { opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')

      // Scroll parallax on background image
      gsap.to(imgRef.current, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      })

      // Scroll indicator pulse
      if (scrollIndRef.current) {
        gsap.to(scrollIndRef.current, {
          opacity: 0.3,
          repeat: -1,
          yoyo: true,
          duration: 1.4,
          ease: 'sine.inOut',
          delay: 2,
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  /* ── 2. Mouse parallax on hero image ─────────────────────────────── */
  useLayoutEffect(() => {
    if (!imgRef.current) return

    const ctx = gsap.context(() => {
      const el = imgRef.current

      const move = (e) => {
        const { innerWidth, innerHeight } = window
        const x = (e.clientX / innerWidth  - 0.5) * 20
        const y = (e.clientY / innerHeight - 0.5) * 20
        gsap.to(el, { x, y, duration: 0.8, ease: 'power2.out', overwrite: 'auto' })
      }

      const reset = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' })
      }

      window.addEventListener('mousemove', move, { passive: true })
      window.addEventListener('mouseleave', reset)

      return () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseleave', reset)
      }
    }, imgRef)

    return () => ctx.revert()
  }, [])

  /* ── 3. CTA Button fill LEFT → RIGHT ─────────────────────────────── */
  useLayoutEffect(() => {
    if (!ctaRef.current) return

    const ctx = gsap.context(() => {
      const btn  = ctaRef.current
      const fill = btn.querySelector('.btn-fill')

      const enter = () => gsap.to(fill, { scaleX: 1, duration: 0.4, ease: 'power2.out' })
      const leave = () => gsap.to(fill, { scaleX: 0, duration: 0.35, ease: 'power2.in' })

      btn.addEventListener('mouseenter', enter)
      btn.addEventListener('mouseleave', leave)

      return () => {
        btn.removeEventListener('mouseenter', enter)
        btn.removeEventListener('mouseleave', leave)
      }
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
    /* Full-viewport hero — overflows the App padding via negative margins */
    <div
      ref={containerRef}
      className=' h-screen min-h-[600px] relative overflow-hidden -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]'
    >
      {/* Background image */}
      <div className='absolute inset-0 overflow-hidden'>
        <img
          ref={imgRef}
          src={assets.hero_img}
          alt='Forever — Premium Fashion'
          className='w-full h-full object-cover object-center will-change-transform origin-center'
        />
        {/* Dark gradient overlay */}
        <div className='absolute inset-0 bg-linear-to-b from-[#1C1C1C]/60 via-[#1C1C1C]/30 to-[#1C1C1C]/75' />
        <div className='absolute inset-0 bg-linear-to-r from-[#1C1C1C]/50 via-transparent to-transparent' />
      </div>

      {/* "SS / 2025" — top right */}
      <div className='hero-year absolute top-28 right-6 sm:right-10'>
        <p className='jost text-white/40 text-[10px] tracking-[0.4em] uppercase font-light'>SS / 2025</p>
      </div>

      {/* Main content — bottom-left aligned */}
      <div className='absolute inset-0 flex flex-col justify-end pb-24 sm:pb-28 px-6 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

        {/* Label */}
        <p className='hero-label jost text-[#B8956A] text-[10px] sm:text-xs tracking-[0.4em] uppercase font-medium mb-4'>
          New Collection
        </p>

        {/* Heading */}
        <div className='mb-4 overflow-hidden'>
          <h1 className='hero-heading playfair text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tight text-white font-normal'>
            Wear the
          </h1>
          <h1 className='hero-heading playfair text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tight text-[#B8956A] font-normal italic'>
            Moment
          </h1>
        </div>

        {/* Subline */}
        <p className='hero-sub jost text-white/60 text-sm sm:text-base font-light tracking-wide mb-8 max-w-xs sm:max-w-sm'>
          Curated fashion for every story you choose to tell.
        </p>

        {/* CTA Button */}
        <div className='hero-cta mb-12 sm:mb-16'>
          <Link to='/collection'>
            <div
              ref={ctaRef}
              className='relative overflow-hidden inline-flex items-center gap-3 bg-[#B8956A] px-7 py-3.5 cursor-pointer group'
            >
              {/* Hover fill */}
              <span
                className='btn-fill absolute inset-0 bg-[#D4B896] origin-left block scale-x-0'
              />
              <span className='relative z-10 jost font-semibold text-[11px] tracking-[0.3em] uppercase text-[#1C1C1C]'>
                Explore Collection
              </span>
              <span className='relative z-10 text-[#1C1C1C] text-base leading-none'>→</span>
            </div>
          </Link>
        </div>

        {/* Stats bar */}
        <div className='flex items-center gap-8 sm:gap-16'>
          {stats.map((s, i) => (
            <div key={i} className='hero-stats'>
              <p className='playfair text-white text-lg sm:text-2xl font-medium leading-none'>{s.value}</p>
              <p className='jost text-white/40 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase mt-1 font-light'>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator — right side vertical */}
      <div className='hero-scroll absolute right-6 sm:right-8 bottom-28 sm:bottom-32 flex flex-col items-center gap-3'>
        <p
          ref={scrollIndRef}
          className='jost text-white/60 text-[9px] [writing-mode:vertical-rl] tracking-[0.4em] uppercase font-light'
        >
          Scroll
        </p>
        <div className='w-px h-10 bg-white/20 overflow-hidden'>
          <div className='w-full h-1/2 bg-[#B8956A] animate-slideDown' />
        </div>
      </div>

    </div>
  )
}

export default Hero
