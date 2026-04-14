import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/Shop'
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  return (
    <div className='border-t border-[#E2D9CC] pt-12'>
      <div className='text-2xl mb-6'>
        <Title text1={'Your'} text2={'Cart'} />
      </div>

      <div className='flex flex-col gap-0'>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          return (
            <div key={index} className='py-5 border-b border-[#E2D9CC] flex items-center gap-4 sm:gap-6'>
              <img
                className='w-20 sm:w-24 aspect-3/4 object-cover bg-[#F0EBE1] shrink-0'
                src={productData.image[0]}
                alt={productData.name}
              />
              <div className='flex-1 min-w-0'>
                <p className='playfair text-sm sm:text-base font-medium text-[#1C1C1C] leading-snug mb-1'>{productData.name}</p>
                <div className='flex items-center gap-3 mt-2 flex-wrap'>
                  <p className='jost text-sm font-semibold text-[#1C1C1C]'>{currency}{productData.price}</p>
                  <span className='jost text-[10px] tracking-[0.2em] uppercase border border-[#E2D9CC] px-2.5 py-1 text-[#6B6560]'>{item.size}</span>
                </div>
              </div>
              <div className='flex items-center gap-3 sm:gap-5 shrink-0'>
                <div className='flex items-center border border-[#E2D9CC]'>
                  <button
                    onClick={() => item.quantity > 1 && updateQuantity(item._id, item.size, item.quantity - 1)}
                    className='jost w-8 h-8 flex items-center justify-center text-[#6B6560] hover:text-[#1C1C1C] transition-colors text-lg font-light'
                  >−</button>
                  <span className='jost w-8 h-8 flex items-center justify-center text-sm text-[#1C1C1C] border-x border-[#E2D9CC]'>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                    className='jost w-8 h-8 flex items-center justify-center text-[#6B6560] hover:text-[#1C1C1C] transition-colors text-lg font-light'
                  >+</button>
                </div>
                <button
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className='w-8 h-8 flex items-center justify-center hover:bg-[#F0EBE1] rounded-full transition-colors'
                >
                  <img className='w-4 opacity-40 hover:opacity-70 transition-opacity' src={assets.bin_icon} alt='Remove' />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {cartData.length === 0 && (
        <div className='flex flex-col items-center justify-center py-24 text-center'>
          <p className='playfair text-2xl text-[#3A3633] mb-2'>Your cart is empty</p>
          <p className='jost text-sm text-[#6B6560] font-light mb-6'>Add some items to get started</p>
          <button onClick={() => navigate('/collection')} className='jost text-[11px] tracking-[0.25em] uppercase border border-[#1C1C1C] text-[#1C1C1C] px-10 py-3 hover:bg-[#1C1C1C] hover:text-[#F9F6F0] transition-all duration-300'>
            Browse Collection
          </button>
        </div>
      )}

      {cartData.length > 0 && (
        <div className='flex justify-end my-16 sm:my-20'>
          <div className='w-full sm:w-[420px]'>
            <CartTotal />
            <div className='w-full text-right mt-6'>
              <button
                onClick={() => navigate('/place-order')}
                className='jost bg-[#1C1C1C] text-[#F9F6F0] text-[11px] tracking-[0.25em] uppercase font-medium py-4 px-10 hover:bg-[#B8956A] transition-colors duration-300 w-full sm:w-auto'
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
