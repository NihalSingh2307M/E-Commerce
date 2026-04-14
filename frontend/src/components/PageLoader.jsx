import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const PageLoader = ({ loaderRef, onComplete }) => {
  const barRef  = useRef(null)
  const textRef = useRef(null)
  const [count, setCount] = useState(0)

  useLayoutEffect(() => {
    const loader = loaderRef?.current
    if (!loader) return

    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(loader, { display: 'none' })
      onComplete?.()
      return
    }

    const obj = { val: 0 }
    const tl  = gsap.timeline()

    // Phase 1 — count up + bar fill
    tl.to(obj, {
      val: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => setCount(Math.round(obj.val)),
    }, 0)
    tl.to(barRef.current, {
      scaleX: 1,
      duration: 1.6,
      ease: 'power2.inOut',
    }, 0)
    tl.fromTo(textRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      0.25
    )

    // Phase 2 — fade the entire overlay out
    // onComplete fires WHILE overlay is still fading (overlapping start)
    // so the UI reveal begins underneath a still-dark screen.
    tl.to(loader, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onStart: () => {
        // Tell App to start revealing the UI NOW — loader still covers it
        onComplete?.()
      },
      onComplete: () => {
        // Fully remove from paint & interaction
        gsap.set(loader, { display: 'none' })
      },
    }, '+=0.15') // tiny pause after count hits 100

    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-10 bg-[linear-gradient(135deg,#0E0D0B_0%,#161210_50%,#0E0D0B_100%)]"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#B8956A] flex items-center justify-center">
          <span className="cormorant text-[#1C1C1C] text-xl font-light italic">F</span>
        </div>
        <span
          ref={textRef}
          className="cormorant text-[#F9F6F0] text-2xl font-light tracking-[0.15em] uppercase opacity-0"
        >
          Forever
        </span>
      </div>

      <div
        className="cormorant text-[#F9F6F0] leading-none tracking-tight min-w-[4ch] text-center tabular-nums font-light opacity-80"
      >
        {count}
      </div>

      <div className="w-48 sm:w-64 h-px overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          ref={barRef}
          className="w-full h-full origin-left scale-x-0 bg-[linear-gradient(90deg,#B8956A,#D4B896)]"
          
        />
      </div>

      <p className="jost text-[9px] tracking-[0.4em] uppercase text-[rgba(255,255,255,0.15)]" >
        Loading Collection
      </p>
    </div>
  )
}

export default PageLoader
