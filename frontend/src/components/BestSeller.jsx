import React, { useContext, useEffect, useRef, useState } from 'react'
import { ShopContext } from '../context/Shop'
import ProductItem from './ProductItem'
import Title from './Title'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HERO_DURATION = .3

const BestSeller = () => {
    const { products } = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([])

    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const subtextRef = useRef(null)
    const dividerRef = useRef(null)
    const gridRef = useRef(null)

    useEffect(() => {
        setBestSeller(products.slice(0, 8))
    }, [products])

    useEffect(() => {
        if (!bestSeller.length) return

        // Start invisible — fade the whole section in after hero finishes
        gsap.set(sectionRef.current, { opacity: 0 })
        gsap.to(sectionRef.current, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: HERO_DURATION,
        })

        // ── Heading block: fade + lift in when section enters viewport ──
        gsap.from([headingRef.current, subtextRef.current], {
            opacity: 0,
            y: 28,
            duration: 0.75,
            stagger: 0.15,
            ease: 'power3.out',
            delay: HERO_DURATION + 0.1,
            scrollTrigger: {
                trigger: headingRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        })

        // ── Divider line draws in left → right ──
        gsap.from(dividerRef.current, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.9,
            ease: 'power2.inOut',
            delay: HERO_DURATION + 0.1,
            scrollTrigger: {
                trigger: dividerRef.current,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
        })

        // ── Product cards: staggered cascade ──
        const cards = gridRef.current ? Array.from(gridRef.current.children) : []

        gsap.from(cards, {
            opacity: 0,
            y: 40,
            scale: 0.97,
            duration: 0.55,
            stagger: { each: 0.07, from: 'start' },
            ease: 'power2.out',
            delay: HERO_DURATION + 0.1,
            scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 82%',
                toggleActions: 'play none none none',
            },
        })

        // ── Hover lift ──
        cards.forEach((card) => {
            card.addEventListener('mouseenter', () => gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out' }))
            card.addEventListener('mouseleave', () => gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.inOut' }))
        })

        return () => ScrollTrigger.getAll().forEach(t => t.kill())
    }, [bestSeller])

    return (
        <div ref={sectionRef} className='my-10'
            style={{ fontFamily: "'Inter', sans-serif", opacity: 0 }}>

            {/* ── Header ── */}
            <div className='text-center py-8 text-3xl'>
                <div ref={headingRef}>
                    <Title text1={'Best'} text2={'Sellers'} />
                </div>

                {/* Decorative divider */}
                <div className='flex items-center justify-center gap-3 my-2'>
                    <span ref={dividerRef}
                        className='block h-px bg-[#BBBAB6]'
                        style={{ width: '60px', display: 'inline-block' }} />
                    <span className='w-1.5 h-1.5 rounded-full bg-[#C9B99A] inline-block' />
                    <span className='block h-px bg-[#BBBAB6]'
                        style={{ width: '60px', display: 'inline-block' }} />
                </div>

                <p ref={subtextRef}
                    className='w-3/4 m-auto text-sm sm:text-base text-[#6B6A66] leading-relaxed tracking-wide'>
                    Our most-loved pieces — tried, tested, and trusted by thousands.
                    Timeless staples and crowd favourites that never go out of style.
                </p>
            </div>

            {/* ── Product Grid ── */}
            <div ref={gridRef}
                className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6'>
                {bestSeller.map((item, index) => (
                    <div key={index}
                        className='group relative bg-[#F7F6F4] border border-[#DDDBD7] rounded-sm overflow-hidden cursor-pointer transition-colors duration-300 hover:border-[#BBBAB6]'
                        style={{ willChange: 'transform' }}>
                        <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default BestSeller