import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/Shop'
import { assets } from '../assets/frontend_assets/assets';
import { useLocation } from 'react-router-dom';

const Search = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('collection') && showSearch) {
      setVisible(true);
    } else {
      setVisible(false)
    }
  }, [location])

  return showSearch ? (
    <div className='bg-[#F0EBE1] border-b border-[#E2D9CC] py-4 px-4 sm:px-0'>
      <div className='flex items-center justify-center gap-3'>
        <div className='flex items-center border border-[#E2D9CC] bg-[#F9F6F0] px-4 py-2.5 w-full max-w-md focus-within:border-[#B8956A] transition-colors duration-200'>
          <img className='w-4 opacity-50 mr-3' src={assets.search_icon} alt='' />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='flex-1 bg-transparent text-sm text-[#1C1C1C] placeholder-[#6B6560] jost font-light outline-none'
            type='text'
            placeholder='Search products...'
          />
        </div>
        <button
          onClick={() => setShowSearch(false)}
          className='w-8 h-8 flex items-center justify-center hover:bg-[#E2D9CC] rounded-full transition-colors duration-200 shrink-0'
        >
          <img className='w-3' src={assets.cross_icon} alt='Close' />
        </button>
      </div>
    </div>
  ) : null
}

export default Search
