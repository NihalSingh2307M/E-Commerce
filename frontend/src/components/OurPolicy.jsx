import { useLayoutEffect, useRef } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const OurPolicy = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll('.policy-item')

      gsap.from(items, {
        opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })

      items.forEach((item) => {
        const circle = item.querySelector('.policy-icon-circle')
        item.addEventListener('mouseenter', () => gsap.to(circle, { scale: 1.12, duration: 0.3, ease: 'power2.out' }))
        item.addEventListener('mouseleave', () => gsap.to(circle, { scale: 1, duration: 0.4, ease: 'power2.inOut' }))
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const policies = [
    { icon: assets.exchange_icon, title: 'Easy Exchange Policy',  desc: 'Hassle-free exchange on all orders within 30 days' },
    { icon: assets.quality_icon,  title: '7 Days Return Policy',  desc: 'Free returns within 7 days, no questions asked'    },
    { icon: assets.support_img,   title: 'Best Customer Support', desc: 'Dedicated 24/7 support for all your queries'       },
  ]

  return (
    <div ref={sectionRef} className="my-14 sm:my-20 py-12 sm:py-16 border-y border-[#E2D9CC]">

      {/* Section label */}
      <p className="text-center jost text-[9px] tracking-[0.45em] uppercase text-[#B8956A] font-medium mb-10">Our Promise</p>

      <div className="flex flex-col sm:flex-row justify-around gap-10 sm:gap-4 text-center">
        {policies.map((policy) => (
          <div key={policy.title} className="policy-item flex flex-col items-center gap-4 px-4 cursor-default">
            <div className="policy-icon-circle w-14 h-14 rounded-full bg-[#EDE0CE] flex items-center justify-center">
              <img src={policy.icon} className="w-6 h-6 object-contain" alt={policy.title} />
            </div>
            <div>
              <p className="jost font-semibold text-[#1C1C1C] tracking-wide text-sm sm:text-base mb-1">{policy.title}</p>
              <p className="jost text-[#6B6560] text-xs sm:text-sm font-light leading-relaxed max-w-[180px] mx-auto">{policy.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OurPolicy
