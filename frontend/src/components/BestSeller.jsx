import React, { useContext, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { ShopContext } from '../context/Shop'
import ProductItem from './ProductItem'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const HERO_DURATION = .3

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

    /* ── Scroll reveal + card animations ─────────────────────────────── */
    useLayoutEffect(() => {
        if (!bestSeller.length)  return
        if (!sectionRef.current) return

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

            // Card micro hover — scale 1.02 + lift
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
    }, [bestSeller])

    return (
        <div ref={sectionRef} className='my-10 sm:my-20 py-12 sm:py-16 bg-[#1C1C1C] -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]' style={{ opacity: 0 }}>

            {/* Header */}
            <div className='text-center py-4'>
                <div ref={headingRef} className='text-3xl sm:text-4xl'>
                    <span className='playfair text-[#D4B896] text-lg tracking-wide font-normal'>
                        Best <span className='font-semibold italic text-[#F9F6F0]'>Sellers</span>
                    </span>
                    <div className='flex items-center justify-center gap-2 mt-2'>
                        <span className='block w-10 h-px bg-[#B8956A]'></span>
                        <span className='block w-1.5 h-1.5 rounded-full bg-[#B8956A]'></span>
                        <span className='block w-10 h-px bg-[#B8956A]'></span>
                    </div>
                </div>

                <div className='flex items-center justify-center gap-3 my-3' ref={dividerRef}>
                    <span className='block h-px bg-[#3A3633]' style={{ width: '80px' }} />
                    <span className='w-1 h-1 rounded-full bg-[#B8956A] inline-block' />
                    <span className='block h-px bg-[#3A3633]' style={{ width: '80px' }} />
                </div>

                <p ref={subtextRef} className='jost w-3/4 m-auto text-sm sm:text-base text-[#6B6560] leading-relaxed tracking-wide font-light'>
                    Our most-loved pieces — tried, tested, and trusted by thousands.
                    Timeless staples and crowd favourites that never go out of style.
                </p>
            </div>

            {/* Product Grid */}
            <div ref={gridRef} className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 gap-y-6 sm:gap-y-8 mt-8 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
                {bestSeller.map((item, index) => (
                    <div key={index}
                        className='relative cursor-pointer'
                        style={{ willChange: 'transform' }}>
                        <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default BestSeller
