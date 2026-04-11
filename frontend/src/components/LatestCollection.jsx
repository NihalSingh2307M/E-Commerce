import React, { useContext, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { ShopContext } from '../context/Shop'
import ProductItem from './ProductItem'
import Title from './Title'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

const HERO_DURATION = .3

const LatestCollection = () => {
    const { products } = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = useState([])

    const sectionRef  = useRef(null)
    const headingRef  = useRef(null)
    const subtextRef  = useRef(null)
    const dividerRef  = useRef(null)
    const gridRef     = useRef(null)

    useEffect(() => {
        setLatestProducts(products.slice(0, 12))
    }, [products])

    /* ── Scroll reveal + card animations ─────────────────────────────── */
    useLayoutEffect(() => {
        if (!latestProducts.length) return
        if (!sectionRef.current)    return

        const ctx = gsap.context(() => {
            gsap.registerPlugin(ScrollTrigger)

            // Section fade-in after hero
            gsap.set(sectionRef.current, { opacity: 0 })
            gsap.to(sectionRef.current, {
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
                delay: HERO_DURATION,
            })

            // Heading + subtext — fade + slide up
            gsap.from([headingRef.current, subtextRef.current], {
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: 'top 80%',
                    once: true,
                },
            })

            // Divider line draw
            gsap.from(dividerRef.current, {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 0.9,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: dividerRef.current,
                    start: 'top 88%',
                    once: true,
                },
            })

            // Product cards — staggered cascade
            const cards = gridRef.current ? Array.from(gridRef.current.children) : []
            gsap.from(cards, {
                opacity: 0,
                y: 40,
                scale: 0.97,
                duration: 0.55,
                stagger: { each: 0.07, from: 'start' },
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: 'top 82%',
                    once: true,
                },
            })

            // Card micro hover — scale 1.04
            cards.forEach((card) => {
                card.addEventListener('mouseenter', () =>
                    gsap.to(card, { y: -6, scale: 1.02, duration: 0.3, ease: 'power2.out' })
                )
                card.addEventListener('mouseleave', () =>
                    gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.inOut' })
                )
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [latestProducts])

    return (
        <div ref={sectionRef} className='my-10 sm:my-16 px-0' style={{ opacity: 0 }}>

            {/* Header */}
            <div className='text-center py-6'>
                <div ref={headingRef} className='text-3xl sm:text-4xl'>
                    <Title text1={'Latest'} text2={'Collection'} />
                </div>

                <div className='flex items-center justify-center gap-3 my-3' ref={dividerRef}>
                    <span className='block h-px bg-[#E2D9CC]' style={{ width: '80px' }} />
                    <span className='w-1.5 h-1.5 rounded-full bg-[#B8956A] inline-block' />
                    <span className='block h-px bg-[#E2D9CC]' style={{ width: '80px' }} />
                </div>

                <p ref={subtextRef} className='jost w-3/4 m-auto text-sm sm:text-base text-[#6B6560] leading-relaxed tracking-wide font-light'>
                    Where minimalism meets streetwear — clean lines, oversized fits, effortless layering.
                    Neutral palettes, relaxed tailoring, and utility-inspired pieces designed for everyday versatility.
                </p>
            </div>

            {/* Product Grid */}
            <div ref={gridRef} className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 gap-y-6 sm:gap-y-8 mt-6'>
                {latestProducts.map((item, index) => (
                    <div key={index}
                        className='relative cursor-pointer'
                        style={{ willChange: 'transform' }}>
                        {index < 3 && (
                            <span className='absolute top-2 left-2 z-10 text-[9px] tracking-[0.2em] uppercase
                                px-2 py-1 bg-[#1C1C1C] text-[#F9F6F0] font-medium jost'>
                                New
                            </span>
                        )}
                        <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                    </div>
                ))}
            </div>

            {/* View All CTA */}
            <div className='flex justify-center mt-10 sm:mt-14'>
                <Link to='/collection'
                    className='jost text-[11px] tracking-[0.25em] uppercase border border-[#1C1C1C] text-[#1C1C1C]
                        px-12 py-3.5 hover:bg-[#1C1C1C] hover:text-[#F9F6F0]
                        transition-all duration-300 font-medium'>
                    View All
                </Link>
            </div>

        </div>
    )
}

export default LatestCollection
