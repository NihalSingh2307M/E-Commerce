import React, { useContext, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../context/Shop'


const Navbar = () => {
  const [visible, setVisible] = useState(false);

  //show search icon -----

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to='/'>
        <img src={assets.logo} className="w-36" alt="logo" />
      </Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/home' className='flex flex-col items-center gap-1 uppercase'>
          {({ isActive }) => (
            <>
              <p >Home</p>
              <hr className={`w-2/4 border-none  h-[1.5px] bg-gray-700 transition-all duration-300 ease-in-out ${isActive ? '  opacity-100 scale-x-100 ' : 'opacity-0 scale-x-0'
                }`} />
            </>
          )}
        </NavLink>

        <NavLink to='/collection' className='flex flex-col items-center gap-1 uppercase'>
          {({ isActive }) => (
            <>
              <p>Collection</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 transition-all duration-300 ease-in-out ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`} />
            </>
          )}
        </NavLink>

        <NavLink to='/about' className='flex flex-col items-center gap-1 uppercase'>
          {({ isActive }) => (
            <>
              <p>About</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 transition-all duration-300 ease-in-out ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`} />
            </>
          )}
        </NavLink>

        <NavLink to='/contact' className='flex flex-col items-center gap-1 uppercase'>
          {({ isActive }) => (
            <>
              <p>Contact</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 transition-all duration-300 ease-in-out ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`} />
            </>
          )}
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

        <div className='group relative'>
          <img onClick={() => token ? null : navigate('/login')} src={assets.profile_icon} className='w-5 cursor-pointer' alt="" />
          {/* drop down */}
          {token && <div className='group-hover:block hidden absolute dropdown-menu right-0 pt4'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
              <p className='cursor-pointer hover:text-black'>My Profile</p>
              <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Order</p>
              <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
            </div>
          </div>}

        </div>
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 w-min-5 cursor-pointer' alt="" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
      </div>
      {/* Sidebar menu fot small screen */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white translate-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className=' py-2 pl-6 border uppercase' to='/'>Home</NavLink>
          <NavLink onClick={() => setVisible(false)} className=' py-2 pl-6 border uppercase' to='/collection'>Collection</NavLink>
          <NavLink onClick={() => setVisible(false)} className=' py-2 pl-6 border uppercase' to='/about'>About</NavLink>
          <NavLink onClick={() => setVisible(false)} className=' py-2 pl-6 border uppercase' to='/contact'>Contact</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar