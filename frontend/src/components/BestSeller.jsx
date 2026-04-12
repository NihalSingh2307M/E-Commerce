import { useContext, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { ShopContext } from '../context/Shop'
import ProductItem from './ProductItem'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BestSeller = () => {
  const { products } = useContext(ShopContext)
  const [bestSeller, setBestSeller] = useState([])

  const sectionRef  = useRef(null)
  const headingRef  = useRef(null)
  const subtextRef  = useRef(null)
  const dividerRef  = useRef(null)
  const gridRef     = useRef(null)

  useEffect(() => {
    setBestSeller(products.slice(0, 8))
  }, [products])

  useLayoutEffect(() => {
    if (!bestSeller.length || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(sectionRef.current, { opacity: 0 })
      gsap.to(sectionRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.3 })

      gsap.from([headingRef.current, subtextRef.current], {
        opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 80%', once: true },
      })

      gsap.from(dividerRef.current, {
        scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'power2.inOut',
        scrollTrigger: { trigger: dividerRef.current, start: 'top 88%', once: true },
      })

      const cards = gridRef.current ? Array.from(gridRef.current.children) : []
      gsap.from(cards, {
        opacity: 0, y: 40, scale: 0.97, duration: 0.55,
        stagger: { each: 0.07, from: 'start' }, ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true },
      })

      cards.forEach((card) => {
        card.addEventListener('mouseenter', () => gsap.to(card, { y: -6, scale: 1.02, duration: 0.3, ease: 'power2.out' }))
        card.addEventListener('mouseleave', () => gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.inOut' }))
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [bestSeller])

  return (
    <section
      ref={sectionRef}
      className="my-10 sm:my-20 py-14 sm:py-20 bg-[#1C1C1C] -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]"
      style={{ opacity: 0 }}
    >
      {/* Header — centered editorial */}
      <div className="text-center px-6 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <p className="jost text-[9px] tracking-[0.45em] uppercase text-[#B8956A] font-medium mb-3">Favourites</p>

        <div ref={headingRef} className="mb-4">
          <span className="playfair text-[#D4B896] text-2xl sm:text-3xl font-normal tracking-wide">
            Best <span className="font-semibold italic text-[#F9F6F0]">Sellers</span>
          </span>
        </div>

        <div ref={dividerRef} className="flex items-center justify-center gap-3 mb-5">
          <span className="block h-px bg-[#3A3633]" style={{ width: '70px' }} />
          <span className="w-1 h-1 rounded-full bg-[#B8956A] inline-block" />
          <span className="block h-px bg-[#3A3633]" style={{ width: '70px' }} />
        </div>

        <p ref={subtextRef} className="jost w-3/4 max-w-md m-auto text-sm text-[#6B6560] leading-relaxed tracking-wide font-light">
          Our most-loved pieces — tried, tested, and trusted by thousands. Timeless staples that never go out of style.
        </p>
      </div>

      {/* Product Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 gap-y-6 sm:gap-y-8 mt-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"
      >
        {bestSeller.map((item) => (
          <div key={item._id} className="relative cursor-pointer" style={{ willChange: 'transform' }}>
            <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default BestSeller
