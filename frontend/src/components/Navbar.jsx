import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/Shop'
import gsap from 'gsap'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)

  const logoRef    = useRef(null)
  const navLinksRef = useRef(null)
  const iconsRef   = useRef(null)

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

    // logo drops in from above
    tl.from(logoRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: 'power3.out',
    })
    // nav links stagger in
    .from(navLinksRef.current.children, {
      opacity: 0,
      y: -12,
      stagger: 0.08,
      duration: 0.45,
      ease: 'power2.out',
    }, '-=0.3')
    // icons fade in together
    .from(iconsRef.current.children, {
      opacity: 0,
      y: -10,
      stagger: 0.07,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.25')

  }, [])

  return (
    <div className="flex items-center justify-between py-5 font-medium relative z-50">

      <Link to='/' ref={logoRef}>
        <img src={assets.logo} className="w-36" alt="logo" />
      </Link>

      <ul ref={navLinksRef} className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/home' className='flex flex-col items-center gap-1 uppercase'>
          {({ isActive }) => (
            <>
              <p>Home</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 transition-all duration-300 ease-in-out
                ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
            </>
          )}
        </NavLink>

        <NavLink to='/collection' className='flex flex-col items-center gap-1 uppercase'>
          {({ isActive }) => (
            <>
              <p>Collection</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 transition-all duration-300 ease-in-out
                ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
            </>
          )}
        </NavLink>

        <NavLink to='/about' className='flex flex-col items-center gap-1 uppercase'>
          {({ isActive }) => (
            <>
              <p>About</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 transition-all duration-300 ease-in-out
                ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
            </>
          )}
        </NavLink>

        <NavLink to='/contact' className='flex flex-col items-center gap-1 uppercase'>
          {({ isActive }) => (
            <>
              <p>Contact</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 transition-all duration-300 ease-in-out
                ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
            </>
          )}
        </NavLink>
      </ul>

      {/* icons group — ref wraps all icon siblings */}
      <div ref={iconsRef} className='flex items-center gap-6'>

        {location.pathname === '/collection' && (
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className='w-5 cursor-pointer'
            alt=""
          />
        )}

        <div className='relative group' onMouseLeave={() => setProfileDropdown(false)}>
          <img
            onClick={() => token ? setProfileDropdown(!profileDropdown) : navigate('/login')}
            onMouseEnter={() => token ? setProfileDropdown(true) : null}
            src={assets.profile_icon}
            className='w-5 cursor-pointer'
            alt=""
          />
          {token && profileDropdown && (
            <div className='absolute right-0 top-full mt-2 z-50'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow'>
                <p className='cursor-pointer hover:text-black'>My Profile</p>
                <p onClick={() => { navigate('/orders'); setProfileDropdown(false) }}
                   className='cursor-pointer hover:text-black'>Order</p>
                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          )}
        </div>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5 cursor-pointer' alt="" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>

        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
      </div>

      {/* sidebar unchanged */}
      <div className={`sm:hidden fixed top-0 left-0 right-0 bottom-0 w-full overflow-y-auto bg-white z-50
        transition-transform duration-300 ease-in-out
        ${visible ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border uppercase' to='/'>Home</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border uppercase' to='/collection'>Collection</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border uppercase' to='/about'>About</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border uppercase' to='/contact'>Contact</NavLink>
        </div>
      </div>

    </div>
  )
}

export default Navbar