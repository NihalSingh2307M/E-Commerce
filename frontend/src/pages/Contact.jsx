import React, { useLayoutEffect, useRef, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'
import { gsap, ScrollTrigger } from '../hooks/useGSAP'

const INFO_BLOCKS = [
  {
    tag: 'Visit Us',
    heading: 'Our Store',
    lines: ['5678 Wills Station, Suite 350', 'Bandra, Mumbai, India'],
  },
  {
    tag: 'Get In Touch',
    heading: null,
    lines: ['Tel: +91 89768 76709', 'Email: admin@forever.com'],
  },
]

const FAQ = [
  { q: 'What are your delivery timelines?',       a: 'Standard delivery takes 3–5 business days across India. Express options are available at checkout.' },
  { q: 'Do you accept international orders?',     a: 'Yes — we ship worldwide. International orders typically arrive within 7–14 business days depending on destination.' },
  { q: 'How do I initiate a return?',             a: 'Returns are accepted within 30 days of delivery. Use the Returns portal in your account or email us directly.' },
  { q: 'Do you offer gift wrapping?',             a: 'We offer complimentary luxury gift wrapping on all orders. Simply select the option at checkout.' },
]

const Contact = () => {
  const heroRef  = useRef(null)
  const imgRef   = useRef(null)
  const faqRef   = useRef(null)
  const [openFaq, setOpenFaq] = useState(null)

  /* ── Hero entrance ─────────────────────────────────────────── */
  useLayoutEffect(() => {
    if (!heroRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.ct-img-wrap', { opacity: 0, x: -40, duration: 0.9 })
        .from('.ct-block',    { opacity: 0, y: 30, stagger: 0.14, duration: 0.75 }, '-=0.6')
        .from('.ct-cta',      { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
    }, heroRef)
    return () => ctx.revert()
  }, [])

  /* ── Image parallax ────────────────────────────────────────── */
  useLayoutEffect(() => {
    if (!imgRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        yPercent: -10,
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

  /* ── FAQ reveal ────────────────────────────────────────────── */
  useLayoutEffect(() => {
    if (!faqRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.faq-item', {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: faqRef.current, start: 'top 82%', once: true },
      })
    }, faqRef)
    return () => ctx.revert()
  }, [])

  /* ── FAQ accordion GSAP ────────────────────────────────────── */
  const answerRefs = useRef({})
  const toggleFaq = (i) => {
    const prev = openFaq
    setOpenFaq(prev === i ? null : i)

    FAQ.forEach((_, idx) => {
      const el = answerRefs.current[idx]
      if (!el) return
      if (idx === i && prev !== i) {
        gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' })
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' })
      }
    })
  }

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className='text-center pt-10 pb-4 border-t border-[#E2D9CC]'>
        <Title text1={'Contact'} text2={'Us'} />
      </div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div ref={heroRef} className='my-10 sm:my-14 flex flex-col md:flex-row gap-10 sm:gap-16 mb-20 sm:mb-28'>
        {/* Parallax image */}
        <div className='ct-img-wrap w-full md:max-w-[460px] bg-[#F0EBE1] overflow-hidden relative' style={{ minHeight: 460 }}>
          <img
            ref={imgRef}
            className='w-full h-[120%] object-cover absolute inset-0'
            src={assets.contact_img}
            alt='Contact Forever'
          />
          {/* Decorative corner tag */}
          <div className='absolute top-0 right-0 bg-gold px-4 py-2 z-10'>
            <p className='jost text-[9px] tracking-[0.25em] uppercase text-[#1C1C1C] font-semibold'>Open Daily</p>
          </div>
        </div>

        {/* Info + CTA */}
        <div className='flex flex-col justify-center gap-8 md:max-w-sm'>
          {INFO_BLOCKS.map(({ tag, heading, lines }, i) => (
            <div key={i} className={`ct-block ${i > 0 ? 'border-t border-[#E2D9CC] pt-6' : ''}`}>
              <p className='jost text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-2'>{tag}</p>
              {heading && <p className='playfair text-xl text-[#1C1C1C] font-medium mb-3'>{heading}</p>}
              {lines.map((l, j) => (
                <p key={j} className='jost text-[#6B6560] text-sm font-light leading-relaxed'>{l}</p>
              ))}
            </div>
          ))}

          {/* Careers CTA */}
          <div className='ct-cta border-t border-[#E2D9CC] pt-6 flex flex-col gap-4'>
            <div>
              <p className='playfair text-xl text-[#1C1C1C] font-medium mb-1'>Careers at Forever</p>
              <p className='jost text-[#6B6560] text-sm font-light leading-relaxed'>
                We are always looking for talented, passionate people to join our team.
              </p>
            </div>
            {/* Animated button — fill left → right */}
            <CareersButton />
          </div>

          {/* Hours strip */}
          <div className='ct-block bg-[#F0EBE1] px-6 py-5 flex gap-8'>
            {[['Mon – Fri', '10am – 8pm'], ['Sat – Sun', '11am – 6pm']].map(([day, time]) => (
              <div key={day}>
                <p className='jost text-[9px] tracking-[0.25em] uppercase text-gold font-medium mb-1'>{day}</p>
                <p className='playfair text-[#1C1C1C] text-base'>{time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <div ref={faqRef} className='py-14 sm:py-20 border-t border-[#E2D9CC]'>
        <div className='text-center mb-12'>
          <p className='jost text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-2'>Got Questions?</p>
          <h2 className='playfair text-2xl sm:text-3xl text-[#1C1C1C]'>Frequently <em>Asked</em></h2>
        </div>

        <div className='max-w-2xl mx-auto flex flex-col'>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} className='faq-item border-t border-[#E2D9CC] last:border-b'>
              <button
                onClick={() => toggleFaq(i)}
                className='w-full flex items-center justify-between py-5 text-left gap-6'
              >
                <span className='playfair text-[#1C1C1C] text-base sm:text-lg font-normal'>{q}</span>
                <span
                  className='shrink-0 w-5 h-5 rounded-full border border-gold flex items-center justify-center transition-transform duration-300'
                  style={{ transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <svg width='10' height='10' viewBox='0 0 10 10' fill='none'>
                    <path d='M5 1v8M1 5h8' stroke='#B8956A' strokeWidth='1.5' strokeLinecap='round' />
                  </svg>
                </span>
              </button>
              <div
                ref={(el) => { answerRefs.current[i] = el }}
                className='overflow-hidden'
                style={{ height: 0, opacity: 0 }}
              >
                <p className='jost text-[#6B6560] text-sm font-light leading-relaxed pb-5'>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NewsLetterBox />
    </div>
  )
}

/* ── Careers button with GSAP fill ────────────────────────────── */
const CareersButton = () => {
  const btnRef = useRef(null)

  useLayoutEffect(() => {
    if (!btnRef.current) return
    const ctx = gsap.context(() => {
      const btn  = btnRef.current
      const fill = btn.querySelector('.btn-fill')
      const enter = () => gsap.to(fill, { scaleX: 1, duration: 0.4, ease: 'power2.out' })
      const leave = () => gsap.to(fill, { scaleX: 0, duration: 0.4, ease: 'power2.out' })
      btn.addEventListener('mouseenter', enter)
      btn.addEventListener('mouseleave', leave)
      return () => {
        btn.removeEventListener('mouseenter', enter)
        btn.removeEventListener('mouseleave', leave)
      }
    }, btnRef)
    return () => ctx.revert()
  }, [])

  return (
    <button
      ref={btnRef}
      className='relative overflow-hidden self-start jost border border-[#1C1C1C] text-[#1C1C1C] text-[11px] tracking-[0.25em] uppercase px-8 py-3.5 font-medium hover:text-[#F9F6F0] transition-colors duration-300'
    >
      <span className='btn-fill absolute inset-0 bg-[#1C1C1C] origin-left block' style={{ transform: 'scaleX(0)' }} />
      <span className='relative z-10'>Explore Jobs</span>
    </button>
  )
}

export default Contact 