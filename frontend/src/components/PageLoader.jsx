import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const PageLoader = ({ onComplete }) => {
  const loaderRef  = useRef(null)
  const barRef     = useRef(null)
  const textRef    = useRef(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { onComplete?.(); return }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          yPercent: -100, duration: 0.85, ease: 'power4.inOut',
          onComplete: () => onComplete?.(),
        })
      },
    })

    const obj = { val: 0 }
    tl.to(obj, {
      val: 100, duration: 1.6, ease: 'power2.inOut',
      onUpdate: () => setCount(Math.round(obj.val)),
    })
    tl.to(barRef.current, { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
    tl.fromTo(textRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3)

    return () => tl.kill()
  }, [onComplete])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] bg-[#1C1C1C] flex flex-col items-center justify-center gap-8"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-[#B8956A] flex items-center justify-center">
          <span className="playfair text-[#1C1C1C] text-base font-bold italic">F</span>
        </div>
        <span ref={textRef} className="playfair text-[#F9F6F0] text-xl tracking-wide" style={{ opacity: 0 }}>
          Forever
        </span>
      </div>

      <div className="playfair text-[#F9F6F0] text-6xl leading-none tracking-tight min-w-[4ch] text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {count}
      </div>

      <div className="w-[200px] h-px bg-white/10 overflow-hidden">
        <div
          ref={barRef}
          className="w-full h-full bg-[#B8956A] origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <p className="jost text-[9px] tracking-[0.3em] uppercase text-white/25">Loading Collection</p>
    </div>
  )
}

export default PageLoader
