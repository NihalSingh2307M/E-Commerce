import React, { useContext } from 'react'
import { ShopContext } from '../context/Shop'
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  return (
    <div className='w-full'>
      <div className='text-2xl mb-4'>
        <Title text1={'Cart'} text2={'Total'} />
      </div>

      <div className='flex flex-col gap-0 border border-[#E2D9CC]'>
        <div className='flex justify-between px-5 py-3.5 border-b border-[#E2D9CC]'>
          <p className='jost text-sm text-[#6B6560] font-light'>Subtotal</p>
          <p className='jost text-sm text-[#1C1C1C] font-medium'>{currency}{getCartAmount()}.00</p>
        </div>
        <div className='flex justify-between px-5 py-3.5 border-b border-[#E2D9CC]'>
          <p className='jost text-sm text-[#6B6560] font-light'>Shipping fee</p>
          <p className='jost text-sm text-[#1C1C1C] font-medium'>{currency}{delivery_fee}.00</p>
        </div>
        <div className='flex justify-between px-5 py-4 bg-[#F0EBE1]'>
          <p className='jost text-sm font-semibold text-[#1C1C1C] tracking-wide'>Total</p>
          <p className='jost text-sm font-semibold text-[#1C1C1C]'>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal

