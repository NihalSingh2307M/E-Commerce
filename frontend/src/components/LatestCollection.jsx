import React, { useContext, useEffect, useRef, useState } from 'react'
import { ShopContext } from '../context/Shop'
import ProductItem from './ProductItem'
import Title from './Title'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HERO_DURATION = .3

const LatestCollection = () => {
    const { products } = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = useState([])

    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const subtextRef = useRef(null)
    const dividerRef = useRef(null)
    const gridRef = useRef(null)

    useEffect(() => {
        setLatestProducts(products.slice(0, 12))
    }, [products])

    useEffect(() => {
        if (!latestProducts.length) return

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
    }, [latestProducts])

    return (
        <div ref={sectionRef} className='my-6 px-4 sm:px-0'
            style={{ fontFamily: "'Inter', sans-serif", opacity: 0 }}>

            {/* ── Header ── */}
            <div className='text-center py-3'>
                <div ref={headingRef} className='text-3xl sm:text-4xl'>
                    <Title text1={'Latest'} text2={'Collection'} />
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
                    Where minimalism meets streetwear — clean lines, oversized fits, effortless layering.
                    Neutral palettes, relaxed tailoring, and utility-inspired pieces designed for everyday versatility.
                </p>
            </div>

            {/* ── Product Grid ── */}
            <div ref={gridRef}
                className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6 mt-4'>
                {latestProducts.map((item, index) => (
                    <div key={index}
                        className='group relative bg-[#F7F6F4] border border-[#DDDBD7] rounded-sm overflow-hidden cursor-pointer transition-colors duration-300 hover:border-[#BBBAB6]'
                        style={{ willChange: 'transform' }}>
                        {index < 3 && (
                            <span className='absolute top-2 left-2 z-10 text-[10px] tracking-widest uppercase
                px-2 py-0.5 bg-[#5C5244] text-[#F7F6F4] rounded-sm'>
                                New
                            </span>
                        )}
                        <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                    </div>
                ))}
            </div>

            {/* ── View All CTA ── */}
            <div className='flex justify-center mt-6'>
                <button
                    className='text-xs tracking-[0.2em] uppercase border border-[#3A3A3A] text-[#3A3A3A]
            px-10 py-3 hover:bg-[#1A1A1A] hover:text-[#F7F6F4] hover:border-[#1A1A1A]
            transition-all duration-300 rounded-sm'
                    onClick={() => window.location.href = '/collection'}>
                    View All
                </button>
            </div>

        </div>
    )
}

export default LatestCollection