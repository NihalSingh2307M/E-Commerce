import React, { useContext, useState, useLayoutEffect, useRef } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/Shop'
import { gsap } from 'gsap'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimerRef = useRef(null)

  const logoRef = useRef(null)
  const navLinksRef = useRef(null)
  const iconsRef = useRef(null)
  const navbarRef = useRef(null)

  const openDropdown = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setProfileDropdown(true)
  }

  const closeDropdown = () => {
    closeTimerRef.current = setTimeout(() => setProfileDropdown(false), 250)
  }

  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === '/home'

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    setProfileDropdown(false)
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 })
      tl.from(logoRef.current, { opacity: 0, y: -20 })
        .from(navLinksRef.current.children, { opacity: 0, y: -12, stagger: 0.08 }, '-=0.3')
        .from(iconsRef.current.children, { opacity: 0, y: -10, stagger: 0.07 }, '-=0.25')
    }, navbarRef)
    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navBg = isHome
    ? scrolled
      ? 'bg-charcoal/95 backdrop-blur-md border-b border-white/10 shadow-lg'
      : 'bg-transparent border-b border-transparent'
    : scrolled
      ? 'bg-ivory/95 backdrop-blur-sm border-b border-ivory-border shadow-sm'
      : 'bg-ivory border-b border-ivory-border'

  const textColor = isHome && !scrolled ? 'text-white/90' : 'text-charcoal-mid'
  const activeColor = 'bg-gold'
  const iconFilter = isHome && !scrolled ? 'brightness-0 invert opacity-80' : 'opacity-70'
  const hoverText = isHome && !scrolled ? 'hover:text-gold' : 'hover:text-charcoal'

  return (
    <>
      <div
        ref={navbarRef}
        className={`flex items-center justify-between py-4 sm:py-5 font-medium
        ${isHome ? 'fixed top-0 left-0 right-0 z-50 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]' : 'relative z-50 mb-3'}
        transition-all duration-300 ${navBg}`}
      >

        {/* Logo */}
        <Link to='/' ref={logoRef} className='flex items-center gap-2.5'>
          {isHome && !scrolled ? (
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-gold flex items-center justify-center'>
                <span className='playfair text-charcoal text-sm font-bold'>F</span>
              </div>
              <span className='playfair text-white text-lg font-medium tracking-wide'>Forever</span>
            </div>
          ) : (
            <img src={assets.logo} className='w-32 sm:w-36' alt='logo' />
          )}
        </Link>

        {/* Links */}
        <ul ref={navLinksRef} className={`hidden sm:flex gap-8 text-sm jost ${textColor}`}>
          {['home', 'collection', 'about', 'contact'].map((route) => (
            <NavLink
              key={route}
              to={`/${route}`}
              className={`flex flex-col items-center gap-1 uppercase tracking-[0.2em] text-[11px] font-medium ${hoverText}`}
            >
              {({ isActive }) => (
                <>
                  <p>{route}</p>
                  <span className={`w-1 h-1 rounded-full ${activeColor} ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
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
              className={`w-8 h-8 flex items-center justify-center rounded-full ${isHome && !scrolled ? 'hover:bg-white/10' : 'hover:bg-ivory-dark'}`}
            >
              <img src={assets.search_icon} className={`w-4 ${iconFilter}`} alt='' />
            </button>
          )}

          {/* Profile */}
          <div className='relative' onMouseEnter={token ? openDropdown : undefined} onMouseLeave={token ? closeDropdown : undefined}>
            <button
              onClick={() => token ? setProfileDropdown(!profileDropdown) : navigate('/login')}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${isHome && !scrolled ? 'hover:bg-white/10' : 'hover:bg-ivory-dark'}`}
            >
              <img src={assets.profile_icon} className={`w-4 ${iconFilter}`} alt='' />
            </button>

            {token && profileDropdown && (
              <div className='absolute right-0 top-full mt-2 z-50' onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
                <div className='flex flex-col w-40 py-2 bg-charcoal text-ivory rounded-sm shadow-xl text-xs'>
                  <p className='px-5 py-2.5 hover:bg-charcoal-mid uppercase cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/orders')} className='px-5 py-2.5 hover:bg-charcoal-mid uppercase cursor-pointer'>Orders</p>
                  <div className='h-px bg-charcoal-mid mx-4 my-1'></div>
                  <p onClick={logout} className='px-5 py-2.5 hover:bg-charcoal-mid text-gold uppercase cursor-pointer'>Logout</p>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to='/cart' className='relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-ivory-dark'>
            <img src={assets.cart_icon} className={`w-4 ${iconFilter}`} alt='' />
            {getCartCount() > 0 && (
              <span className='absolute -right-0.5 -bottom-0.5 w-4 text-center leading-4 bg-gold text-ivory rounded-full text-[9px]'>
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Menu */}
          <button onClick={() => setVisible(true)} className='w-8 h-8 flex items-center justify-center sm:hidden'>
            <img src={assets.menu_icon} className={`w-4 ${iconFilter}`} alt='' />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className={`sm:hidden fixed inset-0 bg-charcoal z-60 transition-transform duration-300
        ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex flex-col text-ivory h-full'>

          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-5 border-b border-charcoal-mid'>
            <p className='text-xs uppercase text-gold'>Close</p>
          </div>

          {['/', '/collection', '/about', '/contact'].map((path, i) => (
            <NavLink key={path} onClick={() => setVisible(false)}
              className='py-5 pl-8 border-b border-charcoal-mid uppercase text-xs tracking-[0.3em] hover:text-gold'
              to={path}>
              {['Home', 'Collection', 'About', 'Contact'][i]}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}

export default Navbar