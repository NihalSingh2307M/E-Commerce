import React, { useContext, useEffect, useRef, useState } from 'react'
import { ShopContext } from '../context/Shop'
import ProductItem from './ProductItem'
import Title from './Title'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BestSeller = () => {
    const { products } = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([])

    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const subtextRef = useRef(null)
    const dividerLeftRef = useRef(null)
    const dividerRightRef = useRef(null)
    const dotRef = useRef(null)
    const gridRef = useRef(null)
    const bgTextRef = useRef(null)
    const cardRefs = useRef([])
    const rankRefs = useRef([])

    useEffect(() => {
    const filtered = products.filter(p => p.bestseller)
    setBestSeller(filtered.length > 0 ? filtered.slice(0, 8) : products.slice(0, 8))
    }, [products])

    useEffect(() => {
        if (!bestSeller.length) return

        const ctx = gsap.context(() => {

            // Background ghost text — counter-scroll for depth
            if (bgTextRef.current) {
                gsap.fromTo(bgTextRef.current,
                    { y: 40 },
                    {
                        y: -40,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 2,
                        }
                    }
                )
            }

            // Section fade in
            gsap.fromTo(sectionRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.65, ease: 'power2.out' }
            )

            // Heading: slide in from left with slight rotation
            gsap.fromTo(headingRef.current,
                { x: -40, opacity: 0, rotateZ: -1 },
                {
                    x: 0,
                    opacity: 1,
                    rotateZ: 0,
                    duration: 1.0,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    }
                }
            )

            // Subtext: scale up from slightly smaller
            gsap.fromTo(subtextRef.current,
                { y: 18, opacity: 0, scale: 0.97, filter: 'blur(4px)' },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.9,
                    ease: 'power3.out',
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: subtextRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                }
            )

            // Dividers: different — draw from outside inward (converging)
            gsap.fromTo(dividerLeftRef.current,
                { scaleX: 0, transformOrigin: 'left center' },
                {
                    scaleX: 1,
                    duration: 0.8,
                    ease: 'expo.inOut',
                    scrollTrigger: {
                        trigger: dividerLeftRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                }
            )
            gsap.fromTo(dividerRightRef.current,
                { scaleX: 0, transformOrigin: 'right center' },
                {
                    scaleX: 1,
                    duration: 0.8,
                    ease: 'expo.inOut',
                    scrollTrigger: {
                        trigger: dividerRightRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                }
            )
            gsap.fromTo(dotRef.current,
                { scale: 0, rotation: 180, opacity: 0 },
                {
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'back.out(4)',
                    delay: 0.38,
                    scrollTrigger: {
                        trigger: dotRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                }
            )

            // Cards: alternating row — even rows slide from left, odd from right
            const cards = cardRefs.current.filter(Boolean)
            cards.forEach((card, i) => {
                const fromLeft = i % 2 === 0
                gsap.fromTo(card,
                    {
                        opacity: 0,
                        x: fromLeft ? -50 : 50,
                        y: 30,
                        scale: 0.93,
                        transformPerspective: 800,
                    },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        duration: 0.7,
                        delay: i * 0.07,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: 'top 86%',
                            toggleActions: 'play none none none',
                        }
                    }
                )
            })

            // Rank badge pop-in after cards settle
            const ranks = rankRefs.current.filter(Boolean)
            gsap.fromTo(ranks,
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.45,
                    stagger: 0.06,
                    ease: 'back.out(3.5)',
                    delay: 0.55,
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 86%',
                        toggleActions: 'play none none none',
                    }
                }
            )

            // Card hover: spotlight glow + lift + image zoom
            cards.forEach((card) => {
                const imgEl = card.querySelector('img')
                const glowEl = card.querySelector('[data-glow]')

                const onEnter = () => {
                    gsap.to(card, {
                        y: -10,
                        scale: 1.025,
                        boxShadow: '0 20px 45px -10px rgba(90,72,55,0.2)',
                        duration: 0.32,
                        ease: 'power2.out',
                    })
                    if (imgEl) gsap.to(imgEl, { scale: 1.1, duration: 0.5, ease: 'power2.out' })
                    if (glowEl) gsap.to(glowEl, { opacity: 1, duration: 0.35, ease: 'power2.out' })
                }
                const onLeave = () => {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                        rotateY: 0,
                        boxShadow: '0 0px 0px rgba(0,0,0,0)',
                        duration: 0.42,
                        ease: 'power2.inOut',
                    })
                    if (imgEl) gsap.to(imgEl, { scale: 1, duration: 0.42, ease: 'power2.inOut' })
                    if (glowEl) gsap.to(glowEl, { opacity: 0, duration: 0.35, ease: 'power2.inOut' })
                }
                const onMove = (e) => {
                    const rect = card.getBoundingClientRect()
                    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
                    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10
                    gsap.to(card, {
                        rotateY: x,
                        rotateX: -y,
                        transformPerspective: 700,
                        duration: 0.2,
                        ease: 'power1.out',
                    })
                    // Move glow spotlight toward cursor
                    if (glowEl) {
                        const pX = ((e.clientX - rect.left) / rect.width) * 100
                        const pY = ((e.clientY - rect.top) / rect.height) * 100
                        glowEl.style.background = `radial-gradient(circle at ${pX}% ${pY}%, rgba(201,185,154,0.18) 0%, transparent 65%)`
                    }
                }

                card.addEventListener('mouseenter', onEnter)
                card.addEventListener('mouseleave', onLeave)
                card.addEventListener('mousemove', onMove)
            })

        }, sectionRef)

        return () => ctx.revert()
    }, [bestSeller])

    return (
        <div
            ref={sectionRef}
            className="my-10  relative overflow-hidden font-sans opacity-0"
        >
            {/* Ghost watermark */}
            <div
                ref={bgTextRef}
                className="absolute z-0 inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                aria-hidden="true"
            >
                <span
                    className="text-[#5C5244] font-black uppercase tracking-[0.35em] whitespace-nowrap"
                    style={{ fontSize: 'clamp(56px, 12vw, 180px)', opacity: 0.04 }}
                >
                    BESTSELLERS
                </span>
            </div>

            {/* Header */}
            <div className="text-center py-8 text-3xl relative" style={{ zIndex: 1 }}>
                <div ref={headingRef} style={{ opacity: 0 }}>
                    <Title text1={'Best'} text2={'Sellers'} />
                </div>

                <div className="flex items-center justify-center gap-3 my-2">
                    <span
                        ref={dividerLeftRef}
                        className=" h-px bg-[#BBBAB6] inline-block"
                        style={{ width: '60px' }}
                    />
                    <span
                        ref={dotRef}
                        className="w-1.5 h-1.5 rounded-full bg-[#C9B99A] inline-block"
                        style={{ transform: 'scale(0)' }}
                    />
                    <span
                        ref={dividerRightRef}
                        className="h-px bg-[#BBBAB6] inline-block"
                        style={{ width: '60px' }}
                    />
                </div>

                <p
                    ref={subtextRef}
                    className="w-3/4 m-auto text-sm sm:text-base text-[#6B6A66] leading-relaxed tracking-wide"
                    style={{ opacity: 0 }}
                >
                    Our most-loved pieces — tried, tested, and trusted by thousands.
                    Timeless staples and crowd favourites that never go out of style.
                </p>
            </div>

            {/* Product Grid */}
            <div
                ref={gridRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6 relative"
                style={{ zIndex: 1 }}
            >
                {bestSeller.map((item, index) => (
                    <div
                        key={index}
                        ref={el => { cardRefs.current[index] = el }}
                        className="group relative bg-ivory border border-[#DDDBD7] rounded-sm overflow-hidden cursor-pointer transition-colors duration-300 hover:border-[#BBBAB6]"
                        style={{ willChange: 'transform', opacity: 0, transformStyle: 'preserve-3d' }}
                    >
                        {/* Spotlight glow overlay — moves with cursor */}
                        <div
                            data-glow="true"
                            className="absolute inset-0 pointer-events-none"
                            style={{ opacity: 0, zIndex: 2, background: 'transparent' }}
                        />

                        {/* Rank badge */}
                        <span
                            ref={el => { rankRefs.current[index] = el }}
                            className="absolute top-2 right-2 z-10 text-[10px] tracking-widest uppercase px-2 py-0.5 bg-[#C9B99A] text-[#2A2017] rounded-sm font-medium"
                            style={{ transform: 'scale(0)', opacity: 0 }}
                        >
                            #{index + 1}
                        </span>

                        <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BestSeller