import React, { useLayoutEffect, useRef } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'
import { gsap, ScrollTrigger } from '../hooks/useGSAP'

const PILLARS = [
  {
    num: '01',
    title: 'Quality Assurance',
    desc: 'Every garment passes rigorous quality checks before reaching you. We partner only with ethical manufacturers who share our commitment to excellence and fair labour practices.',
  },
  {
    num: '02',
    title: 'Effortless Convenience',
    desc: 'From discovery to delivery, we make your shopping experience seamless. Enjoy free shipping, easy returns, and a curated selection that makes finding your perfect piece simple.',
  },
  {
    num: '03',
    title: 'Exceptional Support',
    desc: "Our dedicated team is available 24/7 to assist you. Whether it's sizing advice, order tracking, or styling tips — we're always here to help you look your best.",
  },
]

const STATS = [
  { value: '12K+', label: 'Happy Customers' },
  { value: '850+', label: 'Curated Styles' },
  { value: '40+',  label: 'Partner Brands' },
  { value: '98%',  label: 'Satisfaction Rate' },
]

const About = () => {
  const heroRef    = useRef(null)
  const imgRef     = useRef(null)
  const statsRef   = useRef(null)
  const pillarsRef = useRef(null)

  /* ── Hero entrance ─────────────────────────────────────────── */
  useLayoutEffect(() => {
    if (!heroRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.ab-tag',     { opacity: 0, y: 20, duration: 0.6 })
        .from('.ab-h1',      { opacity: 0, y: 40, duration: 0.9 }, '-=0.3')
        .from('.ab-body p',  { opacity: 0, y: 30, stagger: 0.15, duration: 0.8 }, '-=0.5')
        .from('.ab-mission', { opacity: 0, x: -30, duration: 0.7 }, '-=0.4')
    }, heroRef)
    return () => ctx.revert()
  }, [])

  /* ── Image parallax ────────────────────────────────────────── */
  useLayoutEffect(() => {
    if (!imgRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: imgRef.current.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, imgRef)
    return () => ctx.revert()
  }, [])

  /* ── Stats reveal ──────────────────────────────────────────── */
  useLayoutEffect(() => {
    if (!statsRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        opacity: 0,
        y: 50,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 82%', once: true },
      })
    }, statsRef)
    return () => ctx.revert()
  }, [])

  /* ── Pillars reveal ────────────────────────────────────────── */
  useLayoutEffect(() => {
    if (!pillarsRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.pillar-card', {
        opacity: 0,
        y: 60,
        stagger: 0.14,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: pillarsRef.current, start: 'top 80%', once: true },
      })
    }, pillarsRef)
    return () => ctx.revert()
  }, [])

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className='text-center pt-10 pb-4 border-t border-[#E2D9CC]'>
        <Title text1={'About'} text2={'Us'} />
      </div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div ref={heroRef} className='my-10 sm:my-14 flex flex-col md:flex-row gap-10 sm:gap-16'>
        {/* Parallax image */}
        <div className='w-full md:max-w-[420px] bg-[#F0EBE1] overflow-hidden relative' style={{ minHeight: 420 }}>
          <img
            ref={imgRef}
            className='w-full h-[120%] object-cover absolute inset-0'
            src={assets.about_img}
            alt='About Forever'
          />
          <div className='absolute bottom-0 left-0 bg-[#1C1C1C] px-5 py-3 z-10'>
            <p className='jost text-[9px] tracking-[0.3em] uppercase text-gold font-medium'>Est. 2020</p>
          </div>
        </div>

        {/* Text content */}
        <div className='flex flex-col justify-center gap-5 md:w-1/2'>
          <p className='ab-tag jost text-[10px] tracking-[0.3em] uppercase text-gold font-medium'>Our Story</p>
          <h1 className='ab-h1 playfair text-3xl sm:text-4xl text-[#1C1C1C] font-normal leading-snug'>
            Crafted for the <em>Timeless</em>
          </h1>
          <div className='ab-body flex flex-col gap-4'>
            <p className='jost text-[#6B6560] text-sm sm:text-base leading-relaxed font-light'>
              Born from a passion for timeless style, Forever was created to bridge the gap between luxury fashion and everyday wearability. We believe great clothing should last — in quality, in design, and in how it makes you feel.
            </p>
            <p className='jost text-[#6B6560] text-sm sm:text-base leading-relaxed font-light'>
              Every piece in our collection is thoughtfully curated, responsibly sourced, and crafted to become a cherished part of your wardrobe for years to come.
            </p>
          </div>
          <div className='ab-mission pl-6 mt-2 border-l-2 border-gold'>
            <p className='playfair text-[#1C1C1C] text-lg font-medium italic'>Our Mission</p>
            <p className='jost text-[#6B6560] text-sm leading-relaxed font-light mt-2'>
              To empower individuals through beautiful, sustainable fashion that respects both people and planet — without compromising on elegance or accessibility.
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats bar ──────────────────────────────────────────── */}
      <div ref={statsRef} className='py-12 sm:py-16 bg-[#1C1C1C]'>
        <div className='grid grid-cols-2 md:grid-cols-4'>
          {STATS.map(({ value, label }, i) => (
            <div
              key={i}
              className={`stat-item flex flex-col items-center justify-center py-10 px-6 gap-2
                ${i < STATS.length - 1 ? 'border-r border-[#2E2B28]' : ''}
                ${i < 2 ? 'border-b border-[#2E2B28] md:border-b-0' : ''}`}
            >
              <span className='playfair text-3xl sm:text-4xl text-gold font-normal'>{value}</span>
              <span className='jost text-[9px] tracking-[0.3em] uppercase text-[#6B6560] font-medium'>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Forever ────────────────────────────────────────── */}
      <div ref={pillarsRef} className='py-14 sm:py-20 border-t border-[#E2D9CC]'>
        <div className='text-center mb-12'>
          <p className='jost text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-2'>Our Promise</p>
          <h2 className='playfair text-2xl sm:text-3xl text-[#1C1C1C]'>Why Choose <em>Forever</em></h2>
        </div>

        <div className='flex flex-col md:flex-row gap-0'>
          {PILLARS.map(({ num, title, desc }, i) => (
            <div
              key={i}
              className='pillar-card group flex-1 border border-[#E2D9CC] px-8 sm:px-10 py-10 sm:py-14 flex flex-col gap-5 hover:bg-[#F0EBE1] transition-colors duration-500 relative overflow-hidden'
            >
              <span className='playfair absolute -top-4 right-6 text-[6rem] font-bold text-[#E2D9CC] select-none group-hover:text-[#D4B896] transition-colors duration-500 leading-none pointer-events-none'>
                {num}
              </span>
              <div className='w-8 h-px bg-gold' />
              <p className='playfair font-medium text-[#1C1C1C] text-lg relative z-10'>{title}</p>
              <p className='jost text-[#6B6560] text-sm leading-relaxed font-light relative z-10'>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <NewsLetterBox />
    </div>
  )
}

export default About