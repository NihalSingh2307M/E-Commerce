import React, { useContext, useEffect, useRef, useState } from 'react'
import { ShopContext } from '../context/Shop'
import ProductItem from './ProductItem'
import Title from './Title'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LatestCollection = () => {
    const { products } = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = useState([])

    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const subtextRef = useRef(null)
    const dividerLeftRef = useRef(null)
    const dividerRightRef = useRef(null)
    const dotRef = useRef(null)
    const gridRef = useRef(null)
    const ctaRef = useRef(null)
    const bgTextRef = useRef(null)
    const cardRefs = useRef([])

    useEffect(() => {
        setLatestProducts(products.slice(0, 12))
    }, [products])

    useEffect(() => {
        if (!latestProducts.length) return

        const ctx = gsap.context(() => {

            // Background parallax ghost text
            if (bgTextRef.current) {
                gsap.fromTo(bgTextRef.current,
                    { y: 0 },
                    {
                        y: -80,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.8,
                        }
                    }
                )
            }

            // Section fade in
            gsap.fromTo(sectionRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.7, ease: 'power2.out' }
            )

            // Heading: clip-path reveal sweep
            gsap.fromTo(headingRef.current,
                { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    opacity: 1,
                    duration: 1.1,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    }
                }
            )

            // Subtext: blur fade up
            gsap.fromTo(subtextRef.current,
                { y: 22, opacity: 0, filter: 'blur(6px)' },
                {
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.95,
                    ease: 'power3.out',
                    delay: 0.25,
                    scrollTrigger: {
                        trigger: subtextRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                }
            )

            // Dividers expand outward from center
            gsap.fromTo(dividerLeftRef.current,
                { scaleX: 0, transformOrigin: 'right center' },
                {
                    scaleX: 1,
                    duration: 0.85,
                    ease: 'power2.inOut',
                    scrollTrigger: {
                        trigger: dividerLeftRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                }
            )
            gsap.fromTo(dividerRightRef.current,
                { scaleX: 0, transformOrigin: 'left center' },
                {
                    scaleX: 1,
                    duration: 0.85,
                    ease: 'power2.inOut',
                    scrollTrigger: {
                        trigger: dividerRightRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                }
            )
            gsap.fromTo(dotRef.current,
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.55,
                    ease: 'back.out(3)',
                    delay: 0.4,
                    scrollTrigger: {
                        trigger: dotRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                }
            )

            // Cards: 3D tilt entrance stagger
            const cards = cardRefs.current.filter(Boolean)
            gsap.fromTo(cards,
                {
                    opacity: 0,
                    y: 65,
                    rotateX: 20,
                    scale: 0.91,
                    transformPerspective: 900,
                },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    duration: 0.72,
                    stagger: { each: 0.065, from: 'start', grid: 'auto', ease: 'power2.inOut' },
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 84%',
                        toggleActions: 'play none none none',
                    }
                }
            )

            // Card interactive hover: magnetic lift + 3D tilt + image zoom
            cards.forEach((card) => {
                const imgEl = card.querySelector('img')

                const onEnter = () => {
                    gsap.to(card, {
                        y: -11,
                        scale: 1.025,
                        boxShadow: '0 24px 48px -8px rgba(0,0,0,0.14)',
                        duration: 0.35,
                        ease: 'power2.out',
                    })
                    if (imgEl) gsap.to(imgEl, { scale: 1.09, duration: 0.55, ease: 'power2.out' })
                }
                const onLeave = () => {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                        rotateY: 0,
                        boxShadow: '0 0px 0px rgba(0,0,0,0)',
                        duration: 0.45,
                        ease: 'power2.inOut',
                    })
                    if (imgEl) gsap.to(imgEl, { scale: 1, duration: 0.45, ease: 'power2.inOut' })
                }
                const onMove = (e) => {
                    const rect = card.getBoundingClientRect()
                    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
                    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12
                    gsap.to(card, {
                        rotateY: x,
                        rotateX: -y,
                        transformPerspective: 700,
                        duration: 0.2,
                        ease: 'power1.out',
                    })
                }

                card.addEventListener('mouseenter', onEnter)
                card.addEventListener('mouseleave', onLeave)
                card.addEventListener('mousemove', onMove)
            })

            // CTA button rise
            if (ctaRef.current) {
                gsap.fromTo(ctaRef.current,
                    { opacity: 0, y: 26 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.75,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: ctaRef.current,
                            start: 'top 92%',
                            toggleActions: 'play none none none',
                        }
                    }
                )

                // CTA hover pulse
                const btn = ctaRef.current.querySelector('button')
                if (btn) {
                    btn.addEventListener('mouseenter', () =>
                        gsap.to(btn, { scale: 1.04, duration: 0.25, ease: 'power2.out' })
                    )
                    btn.addEventListener('mouseleave', () =>
                        gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.inOut' })
                    )
                }
            }

        }, sectionRef)

        return () => ctx.revert()
    }, [latestProducts])

    return (
        <div
            ref={sectionRef}
            className="my-6 px-4 sm:px-0 relative overflow-hidden font-sans opacity-0"
        >
            {/* Ghost watermark */}
            <div
                ref={bgTextRef}
                className="absolute z-0 inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                aria-hidden="true"
            >
                <span
                    className="text-[#3A3A3A] font-black uppercase tracking-[0.4em] whitespace-nowrap text-[clamp(64px,14vw,200px)] opacity-[0.045]"
                >
                    LATEST
                </span>
            </div>

            {/* Header */}
            <div className="text-center py-3 relative z-0">
                <div ref={headingRef} className="text-3xl sm:text-4xl clip-path-[inset(0_100%_0_0)]" >
                    <Title text1={'Latest'} text2={'Collection'} />
                </div>

                <div className="flex items-center justify-center gap-3 my-2">
                    <span
                        ref={dividerLeftRef}
                        className=" h-px bg-[#BBBAB6] inline-block w-[60px]"
                    />
                    <span
                        ref={dotRef}
                        className="w-1.5 h-1.5 rounded-full bg-[#C9B99A] inline-block scale-0"
                    />
                    <span
                        ref={dividerRightRef}
                        className="h-px bg-[#BBBAB6] inline-block w-[60px]"
                    />
                </div>

                <p
                    ref={subtextRef}
                    className="w-3/4 m-auto text-sm sm:text-base text-[#6B6A66] leading-relaxed tracking-wide opacity-0"
                >
                    Where minimalism meets streetwear — clean lines, oversized fits, effortless layering.
                    Neutral palettes, relaxed tailoring, and utility-inspired pieces designed for everyday versatility.
                </p>
            </div>

            {/* Product Grid */}
            <div
                ref={gridRef}
                className="grid grid-cols-2 z-1 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6 mt-4 relative"
            >
                {latestProducts.map((item, index) => (
                    <div
                        key={index}
                        ref={el => { cardRefs.current[index] = el }}
                        className="group relative bg-[#F7F6F4] border border-[#DDDBD7] rounded-sm overflow-hidden cursor-pointer transition-colors duration-300 hover:border-[#BBBAB6] will-change-transform opacity-0 [transform-3d]"
                    >
                        {index < 3 && (
                            <span className="absolute top-2 left-2 z-10 text-[10px] tracking-widest uppercase px-2 py-0.5 bg-[#5C5244] text-[#F7F6F4] rounded-sm">
                                New
                            </span>
                        )}
                        <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                    </div>
                ))}
            </div>

            {/* View All CTA */}
            <div ref={ctaRef} className="flex justify-center mt-6 opacity-0" >
                <button
                    className="text-xs tracking-[0.2em] uppercase border border-[#3A3A3A] text-[#3A3A3A] px-10 py-3 hover:bg-[#1A1A1A] hover:text-[#F7F6F4] hover:border-[#1A1A1A] transition-all duration-300 rounded-sm"
                    onClick={() => window.location.href = '/collection'}
                >
                    View All
                </button>
            </div>
        </div>
    )
}

export default LatestCollection