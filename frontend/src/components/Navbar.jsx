import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/Shop'
import gsap from 'gsap'

const Navbar = () => {
  const [visible, setVisible]               = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)

  const logoRef     = useRef(null)
  const navLinksRef = useRef(null)
  const iconsRef    = useRef(null)

  const location = useLocation()
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    setProfileDropdown(false)
  }

  useEffect(() => {
    const tl = gsap.timeline()
    tl.from(logoRef.current, { opacity: 0, y: -20, duration: 0.6, ease: 'power3.out' })
      .from(navLinksRef.current.children, { opacity: 0, y: -12, stagger: 0.08, duration: 0.45, ease: 'power2.out' }, '-=0.3')
      .from(iconsRef.current.children, { opacity: 0, y: -10, stagger: 0.07, duration: 0.4, ease: 'power2.out' }, '-=0.25')
  }, [])

  return (
    <div className="flex items-center justify-between py-5 font-medium relative z-50 border-b border-[#DDDBD7] bg-[#F7F6F4] mb-3">

      <Link to='/' ref={logoRef}>
        <img src={assets.logo} className="w-36" alt="logo" />
      </Link>

      <ul ref={navLinksRef} className='hidden sm:flex gap-5 text-sm text-[#3A3A3A]' style={{ fontFamily: "'Inter', sans-serif" }}>
        {['home', 'collection', 'about', 'contact'].map((route) => (
          <NavLink key={route} to={`/${route}`} className='flex flex-col items-center gap-1 uppercase tracking-widest text-xs'>
            {({ isActive }) => (
              <>
                <p>{route}</p>
                <hr className={`w-2/4 border-none h-[1.5px] bg-[#5C5244] transition-all duration-300 ease-in-out
                  ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
              </>
            )}
          </NavLink>
        ))}
      </ul>

      <div ref={iconsRef} className='flex items-center gap-6'>

        {location.pathname === '/collection' && (
          <img onClick={() => setShowSearch(true)} src={assets.search_icon}
            className='w-5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity' alt="" />
        )}

        <div className='relative group' onMouseLeave={() => setProfileDropdown(false)}>
          <img
            onClick={() => token ? setProfileDropdown(!profileDropdown) : navigate('/login')}
            onMouseEnter={() => token ? setProfileDropdown(true) : null}
            src={assets.profile_icon}
            className='w-5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity' alt=""
          />
          {token && profileDropdown && (
            <div className='absolute right-0 top-full mt-2 z-50'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-[#DDDBD7] text-[#3A3A3A] rounded-sm shadow-md text-sm'>
                <p className='cursor-pointer hover:text-[#1A1A1A] transition-colors'>My Profile</p>
                <p onClick={() => { navigate('/orders'); setProfileDropdown(false) }}
                  className='cursor-pointer hover:text-[#1A1A1A] transition-colors'>Orders</p>
                <p onClick={logout} className='cursor-pointer hover:text-[#1A1A1A] transition-colors'>Logout</p>
              </div>
            </div>
          )}
        </div>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity' alt="" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-[#5C5244] text-[#F7F6F4] aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>

        <img onClick={() => setVisible(true)} src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden opacity-70 hover:opacity-100 transition-opacity' alt="" />
      </div>

      {/* Mobile Sidebar */}
      <div className={`sm:hidden fixed top-0 left-0 right-0 bottom-0 w-full overflow-y-auto bg-[#F7F6F4] z-50
        transition-transform duration-300 ease-in-out
        ${visible ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}>
        <div className='flex flex-col text-[#3A3A3A]' style={{ fontFamily: "'Inter', sans-serif" }}>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-4 cursor-pointer border-b border-[#DDDBD7]'>
            <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="" />
            <p className='text-sm tracking-widest uppercase'>Back</p>
          </div>
          {['/', '/collection', '/about', '/contact'].map((path, i) => (
            <NavLink key={path} onClick={() => setVisible(false)}
              className='py-4 pl-6 border-b border-[#DDDBD7] uppercase text-xs tracking-widest hover:bg-[#DDDBD7] transition-colors'
              to={path}>
              {['Home', 'Collection', 'About', 'Contact'][i]}
            </NavLink>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Navbar