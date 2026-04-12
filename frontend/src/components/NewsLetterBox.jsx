import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NewsLetterBox = () => {
  const sectionRef = useRef(null)
  const btnRef     = useRef(null)

  const onSubmitHandler = (event) => {
    event.preventDefault()
  }

  useLayoutEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const children = sectionRef.current.querySelectorAll('.nl-item')
      gsap.from(children, {
        opacity: 0, y: 50, duration: 0.8, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    if (!btnRef.current) return
    const ctx = gsap.context(() => {
      const btn  = btnRef.current
      const fill = btn.querySelector('.nl-fill')
      const enter = () => gsap.to(fill, { scaleX: 1, duration: 0.4, ease: 'power2.out' })
      const leave = () => gsap.to(fill, { scaleX: 0, duration: 0.4, ease: 'power2.out' })
      btn.addEventListener('mouseenter', enter)
      btn.addEventListener('mouseleave', leave)
      return () => { btn.removeEventListener('mouseenter', enter); btn.removeEventListener('mouseleave', leave) }
    }, btnRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="my-14 sm:my-20 py-14 sm:py-20 px-6 sm:px-16 bg-[#1C1C1C] text-center -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]">
      <div className="max-w-2xl mx-auto">
        <p className="nl-item jost text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#B8956A] font-medium mb-4">Exclusive Access</p>
        <h2 className="nl-item playfair text-2xl sm:text-3xl lg:text-4xl text-[#F9F6F0] font-normal mb-3">
          Subscribe &amp; Save <em className="text-[#B8956A]">20% Off</em>
        </h2>
        <p className="nl-item jost text-[#6B6560] text-sm font-light leading-relaxed mb-8 max-w-md mx-auto">
          Join our inner circle for early access to new collections, exclusive offers, and style inspiration delivered directly to you.
        </p>
        <form onSubmit={onSubmitHandler} className="nl-item flex flex-col sm:flex-row items-stretch sm:items-center gap-0 max-w-md mx-auto">
          <input
            className="flex-1 bg-transparent border border-[#3A3633] text-[#F9F6F0] placeholder-[#6B6560] px-5 py-3.5 text-sm jost font-light focus:border-[#B8956A] transition-colors duration-200 outline-none w-full"
            type="email"
            placeholder="Your email address"
            required
          />
          <button
            ref={btnRef}
            type="submit"
            className="relative overflow-hidden jost text-[11px] tracking-[0.25em] uppercase font-semibold px-8 py-3.5 whitespace-nowrap bg-[#B8956A] text-[#1C1C1C]"
          >
            <span className="nl-fill absolute inset-0 bg-[#D4B896] origin-left block" style={{ transform: 'scaleX(0)' }} />
            <span className="relative z-10">Subscribe</span>
          </button>
        </form>
        <p className="nl-item jost text-[#3A3633] text-xs mt-4 font-light">No spam, unsubscribe at any time.</p>
      </div>
    </div>
  )
}

export default NewsLetterBox
