import { useContext, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { ShopContext } from '../context/Shop'
import ProductItem from './ProductItem'
import Title from './Title'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const LatestCollection = () => {
  const { products } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])

  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const subtextRef = useRef(null)
  const dividerRef = useRef(null)
  const gridRef    = useRef(null)

  useEffect(() => {
    setLatestProducts(products.slice(0, 12))
  }, [products])

  useLayoutEffect(() => {
    if (!latestProducts.length || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(sectionRef.current, { opacity: 0 })
      gsap.to(sectionRef.current, { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.3 })

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
  }, [latestProducts])

  return (
    <section ref={sectionRef} className="my-16 sm:my-24 px-0" style={{ opacity: 0 }}>

      {/* Section intro — split layout */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-14">
        <div>
          <p className="jost text-[9px] tracking-[0.45em] uppercase text-[#B8956A] font-medium mb-3">Arrivals</p>
          <div ref={headingRef}>
            <Title text1="Latest" text2="Collection" />
          </div>
        </div>
        <div ref={subtextRef} className="sm:max-w-xs">
          <div ref={dividerRef} className="flex items-center gap-3 mb-3">
            <span className="block h-px bg-[#E2D9CC] flex-1 max-w-[50px]" />
            <span className="w-1 h-1 rounded-full bg-[#B8956A] inline-block" />
          </div>
          <p className="jost text-sm text-[#6B6560] leading-relaxed font-light">
            Clean lines, oversized fits, effortless layering. Neutral palettes and utility-inspired pieces for everyday versatility.
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 gap-y-6 sm:gap-y-10">
        {latestProducts.map((item, index) => (
          <div
            key={item._id}
            className="relative cursor-pointer"
            style={{ willChange: 'transform' }}
          >
            {index < 3 && (
              <span className="absolute top-2 left-2 z-10 text-[9px] tracking-[0.2em] uppercase px-2 py-1 bg-[#1C1C1C] text-[#F9F6F0] font-medium jost">
                New
              </span>
            )}
            <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="flex justify-center mt-12 sm:mt-16">
        <Link
          to="/collection"
          className="jost text-[11px] tracking-[0.28em] uppercase border border-[#1C1C1C] text-[#1C1C1C] px-12 py-3.5 hover:bg-[#1C1C1C] hover:text-[#F9F6F0] transition-all duration-300 font-medium"
        >
          View All
        </Link>
      </div>
    </section>
  )
}

export default LatestCollection
