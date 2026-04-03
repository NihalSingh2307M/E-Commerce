import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { assets } from '../assets/frontend_assets/assets'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const imgRef = useRef(null)

  useEffect(() => {

    // ── ANIMATION 4 · clip-path image reveal ──────────────────────
    gsap.from(imgRef.current, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1.3,
      ease: 'power4.inOut',
      delay: 0.2,
    })

    // ── ANIMATION 2 · staggered text reveal ───────────────────────
    const tl = gsap.timeline({ delay: 0.1 })

    tl.from('.hero-line', {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.4,
      ease: 'power2.out',
    })
    .from('.hero-label', {
      opacity: 0,
      x: -15,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.2')
    .from('.hero-heading', {
      opacity: 0,
      y: 35,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.2')
    .from('.hero-cta', {
      opacity: 0,
      x: -20,
      duration: 0.45,
      ease: 'power2.out',
    }, '-=0.3')

    // ── ANIMATION 5 · scroll parallax on image ────────────────────
    gsap.to(imgRef.current, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: imgRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,          // smooth scrub
      },
    })

    // cleanup on unmount
    return () => ScrollTrigger.getAll().forEach(t => t.kill())

  }, [])

  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>

      {/* left side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-[#414141]'>

          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-0.5 bg-[#414141] hero-line'></p>
            <p className='font-medium text-sm md:text-base hero-label'>
              Our BestSellers
            </p>
          </div>

          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed hero-heading'>
            Latest Arrival
          </h1>

          <div className='flex items-center gap-2 hero-cta'>
            <p className='font-semibold text-sm md:text-base'>Shop Now</p>
            <p className='w-8 md:w-11 h-px bg-[#414141]'></p>
          </div>

        </div>
      </div>

      {/* right side */}
      <div className='w-full sm:w-1/2 overflow-hidden'>
        <img
          ref={imgRef}
          className='w-full'
          src={assets.hero_img}
          alt=''
          style={{ willChange: 'transform, clip-path' }}
        />
      </div>

    </div>
  )
}

export default Hero