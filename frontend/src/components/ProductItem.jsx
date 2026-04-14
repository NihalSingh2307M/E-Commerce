import React, { useContext } from 'react'
import { ShopContext } from '../context/Shop'
import { Link } from 'react-router-dom';

const ProductItem = ({id, image, name, price}) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link className='text-[#1C1C1C] cursor-pointer block group' to={`/product/${id}`}>
      <div className='overflow-hidden bg-[#F0EBE1] aspect-3/4 relative'>
        <img
          className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
          src={image[0]}
          alt={name}
        />
        <div className='absolute inset-0 bg-[#1C1C1C]/0 group-hover:bg-[#1C1C1C]/5 transition-colors duration-400' />
      </div>
      <div className='pt-3 pb-1 px-1'>
        <p className='jost text-xs sm:text-sm text-[#3A3633] leading-snug line-clamp-2 font-light tracking-wide'>{name}</p>
        <p className='jost text-sm font-semibold text-[#1C1C1C] mt-1 tracking-wide'>{currency}{price}</p>
      </div>
    </Link>
  )
}

export default ProductItem
