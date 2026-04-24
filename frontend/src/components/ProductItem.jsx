import React, { useContext, useRef } from 'react'
import { ShopContext } from '../context/Shop'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext)
  const cardRef = useRef(null)

  return (
    <Link
      ref={cardRef}
      to={`/product/${id}`}
      className="group relative block rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all duration-500 hover:shadow-2xl hover:shadow-black/60 cursor-pointer"
      style={{ textDecoration: 'none' }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-3/4 bg-neutral-800">
        <img
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={image[0]}
          alt={name}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick View pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out">
          <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-widest uppercase whitespace-nowrap">
            View Product
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-neutral-300 text-sm font-medium leading-snug tracking-tight line-clamp-2 group-hover:text-white transition-colors duration-300">
          {name}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-white text-sm font-semibold tracking-tight">
            {currency}{price}
          </p>
          {/* Subtle arrow indicator */}
          <span className="text-neutral-600 group-hover:text-neutral-300 group-hover:translate-x-1 transition-all duration-300 text-base">
            →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
