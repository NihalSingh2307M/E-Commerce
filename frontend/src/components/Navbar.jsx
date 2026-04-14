import React, { useContext, useState, useLayoutEffect, useRef } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/Shop'
import { gsap } from 'gsap'

const Navbar = () => {
  const [visible, setVisible]               = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [scrolled, setScrolled]             = useState(false)

  const logoRef     = useRef(null)
  const navLinksRef = useRef(null)
  const iconsRef    = useRef(null)
  const navbarRef   = useRef(null)

  const location  = useLocation()
  const isHome    = location.pathname === '/' || location.pathname === '/home'

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    setProfileDropdown(false)
  }

  /* ── Entry animation ─────────────────────────────────────────────── */
  useLayoutEffect(() => {
    if (!navbarRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 })
      tl.from(logoRef.current, { opacity: 0, y: -20, duration: 0.6, ease: 'power3.out' })
        .from(navLinksRef.current.children, { opacity: 0, y: -12, stagger: 0.08, duration: 0.45, ease: 'power2.out' }, '-=0.3')
        .from(iconsRef.current.children, { opacity: 0, y: -10, stagger: 0.07, duration: 0.4, ease: 'power2.out' }, '-=0.25')
    }, navbarRef)
    return () => ctx.revert()
  }, [])

  /* ── Scroll listener ─────────────────────────────────────────────── */
  useLayoutEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Dynamic navbar style ─────────────────────────────────────────── */
  const navBg = isHome
    ? scrolled
      ? 'bg-[#1C1C1C]/95 backdrop-blur-md border-b border-white/10 shadow-lg'
      : 'bg-transparent border-b border-transparent'
    : scrolled
      ? 'bg-[#F9F6F0]/95 backdrop-blur-sm border-b border-[#E2D9CC] shadow-sm'
      : 'bg-[#F9F6F0] border-b border-[#E2D9CC]'

  const textColor   = isHome && !scrolled ? 'text-white/90'     : 'text-[#3A3633]'
  const activeColor = isHome && !scrolled ? 'bg-[#B8956A]'      : 'bg-[#B8956A]'
  const iconFilter  = isHome && !scrolled ? 'brightness-0 invert opacity-80' : 'opacity-70'
  const hoverText   = isHome && !scrolled ? 'hover:text-[#B8956A]' : 'hover:text-[#1C1C1C]'

  return (
    <>
      <div
        ref={navbarRef}
        className={`flex items-center justify-between py-4 sm:py-5 font-medium
          ${isHome ? 'fixed top-0 left-0 right-0 z-50 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]' : 'relative z-50 mb-3'}
          transition-all duration-400 ${navBg}`}
      >

        {/* Logo */}
        <Link to='/' ref={logoRef} className='flex items-center gap-2.5'>
          {isHome && !scrolled ? (
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-[#B8956A] flex items-center justify-center'>
                <span className='playfair text-[#1C1C1C] text-sm font-bold'>F</span>
              </div>
              <span className='playfair text-white text-lg font-medium tracking-wide'>Forever</span>
            </div>
          ) : (
            <img src={assets.logo} className='w-32 sm:w-36' alt='logo' />
          )}
        </Link>

        {/* Nav Links */}
        <ul ref={navLinksRef} className={`hidden sm:flex gap-8 text-sm jost ${textColor}`}>
          {['home', 'collection', 'about', 'contact'].map((route) => (
            <NavLink
              key={route}
              to={`/${route}`}
              className={`flex flex-col items-center gap-1 uppercase tracking-[0.2em] text-[11px] font-medium ${hoverText} transition-colors duration-300`}
            >
              {({ isActive }) => (
                <>
                  <p>{route}</p>
                  <span className={`w-1 h-1 rounded-full ${activeColor} transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                </>
              )}
            </NavLink>
          ))}
        </ul>

        {/* Icons */}
        <div ref={iconsRef} className='flex items-center gap-5 sm:gap-6'>

          {location.pathname === '/collection' && (
            <button
              onClick={() => setShowSearch(true)}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${isHome && !scrolled ? 'hover:bg-white/10' : 'hover:bg-[#EDE0CE]'}`}
            >
              <img src={assets.search_icon} className={`w-4 transition-all ${iconFilter}`} alt='' />
            </button>
          )}

          <div className='relative' onMouseLeave={() => setProfileDropdown(false)}>
            <button
              onClick={() => token ? setProfileDropdown(!profileDropdown) : navigate('/login')}
              onMouseEnter={() => token ? setProfileDropdown(true) : null}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${isHome && !scrolled ? 'hover:bg-white/10' : 'hover:bg-[#EDE0CE]'}`}
            >
              <img src={assets.profile_icon} className={`w-4 transition-all ${iconFilter}`} alt='' />
            </button>
            {token && profileDropdown && (
              <div className='absolute right-0 top-full mt-2 z-50'>
                <div className='flex flex-col w-40 py-2 bg-[#1C1C1C] text-[#F9F6F0] rounded-sm shadow-xl text-xs overflow-hidden'>
                  <p className='cursor-pointer px-5 py-2.5 hover:bg-[#3A3633] transition-colors tracking-widest uppercase'>My Profile</p>
                  <p
                    onClick={() => { navigate('/orders'); setProfileDropdown(false) }}
                    className='cursor-pointer px-5 py-2.5 hover:bg-[#3A3633] transition-colors tracking-widest uppercase'
                  >Orders</p>
                  <div className='h-px bg-[#3A3633] mx-4 my-1'></div>
                  <p onClick={logout} className='cursor-pointer px-5 py-2.5 hover:bg-[#3A3633] transition-colors tracking-widest uppercase text-[#B8956A]'>Logout</p>
                </div>
              </div>
            )}
          </div>

          <Link
            to='/cart'
            className={`relative w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${isHome && !scrolled ? 'hover:bg-white/10' : 'hover:bg-[#EDE0CE]'}`}
          >
            <img src={assets.cart_icon} className={`w-4 transition-all ${iconFilter}`} alt='' />
            {getCartCount() > 0 && (
              <span className='absolute -right-0.5 -bottom-0.5 w-4 text-center leading-4 bg-[#B8956A] text-[#F9F6F0] aspect-square rounded-full text-[9px] font-semibold'>
                {getCartCount()}
              </span>
            )}
          </Link>

          <button
            onClick={() => setVisible(true)}
            className={`w-8 h-8 flex items-center justify-center sm:hidden rounded-full transition-colors duration-200 ${isHome && !scrolled ? 'hover:bg-white/10' : 'hover:bg-[#EDE0CE]'}`}
          >
            <img src={assets.menu_icon} className={`w-4 transition-all ${iconFilter}`} alt='' />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`sm:hidden fixed top-0 left-0 right-0 bottom-0 w-full overflow-y-auto bg-[#1C1C1C] z-60
        transition-transform duration-400 ease-in-out
        ${visible ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}>
        <div className='flex flex-col text-[#F9F6F0] jost h-full'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-5 cursor-pointer border-b border-[#3A3633]'>
            <img src={assets.dropdown_icon} className='h-3 rotate-180 invert' alt='' />
            <p className='text-xs tracking-[0.3em] uppercase text-[#B8956A]'>Close</p>
          </div>
          <div className='flex flex-col flex-1 py-8'>
            {['/', '/collection', '/about', '/contact'].map((path, i) => (
              <NavLink
                key={path}
                onClick={() => setVisible(false)}
                className='py-5 pl-8 border-b border-[#3A3633] uppercase text-xs tracking-[0.3em] hover:text-[#B8956A] transition-colors font-medium'
                to={path}
              >
                {['Home', 'Collection', 'About', 'Contact'][i]}
              </NavLink>
            ))}
          </div>
          <div className='p-8 border-t border-[#3A3633]'>
            <p className='text-[#6B6560] text-xs tracking-widest uppercase'>Premium Fashion</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
