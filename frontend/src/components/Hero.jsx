import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { assets } from '../assets/frontend_assets/assets'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const imgRef = useRef(null)

  useEffect(() => {
    // clip-path image reveal — UNCHANGED
    gsap.from(imgRef.current, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1.3,
      ease: 'power4.inOut',
      delay: 0.2,
    })

    // staggered text reveal — UNCHANGED
    const tl = gsap.timeline({ delay: 0.1 })
    tl.from('.hero-line', { scaleX: 0, transformOrigin: 'left center', duration: 0.4, ease: 'power2.out' })
      .from('.hero-label', { opacity: 0, x: -15, duration: 0.4, ease: 'power2.out' }, '-=0.2')
      .from('.hero-heading', { opacity: 0, y: 35, duration: 0.7, ease: 'power3.out' }, '-=0.2')
      .from('.hero-cta', { opacity: 0, x: -20, duration: 0.45, ease: 'power2.out' }, '-=0.3')

    // scroll parallax — UNCHANGED
    gsap.to(imgRef.current, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: imgRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div className='flex flex-col sm:flex-row border border-[#DDDBD7] bg-[#fff7e6] mt-3' style={{ minHeight: '82vh' }}>

      {/* Left */}
      <div className='w-full sm:w-1/2 flex items-center justify-start py-10 sm:py-0 px-10 sm:px-16'>
        <div className='text-[#1A1A1A]' style={{ fontFamily: "'Inter', sans-serif" }}>

          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-1px bg-[#5C5244] hero-line'></p>
            <p className='font-medium text-xs md:text-base tracking-[0.25em] uppercase text-[#6B6A66] hero-label'>
              Our Bestsellers
            </p>
          </div>

          <h1 className='prata-regular text-4xl sm:py-4 lg:text-6xl leading-tight tracking-tight text-[#1A1A1A] hero-heading'>
            Latest Arrival
          </h1>

          <div className='flex items-center gap-3 hero-cta group cursor-pointer'>
            <p className='font-semibold text-sm md:text-base tracking-[0.15em] uppercase text-[#3A3A3A]'>Shop Now</p>
            <p className='w-8 md:w-11 h-px bg-[#5C5244] transition-all duration-300 group-hover:w-14'></p>
          </div>

        </div>
      </div>

      {/* Right */}
      <div className='w-full sm:w-1/2 overflow-hidden'>
        <img
          ref={imgRef}
          className='w-full h-full object-cover'
          src={assets.hero_img}
          alt=''
          style={{ willChange: 'transform, clip-path' }}
        />
      </div>

    </div>
  )
}

export default Hero