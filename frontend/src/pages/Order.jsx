import React, { useContext } from 'react'
import { ShopContext } from '../context/Shop'
import Title from '../components/Title';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItems = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItems.push(item)
          })
        })
        setOrderData(allOrdersItems.reverse())
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  const statusColor = {
    'Order Placed': 'bg-[#B8956A]',
    'Packing': 'bg-yellow-500',
    'Shipped': 'bg-blue-500',
    'Out for delivery': 'bg-purple-500',
    'Delivered': 'bg-green-500',
  }

  return (
    <div className='border-t border-[#E2D9CC] pt-12 pb-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'My'} text2={'Orders'} />
      </div>

      {orderData.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-24 text-center'>
          <p className='playfair text-2xl text-[#3A3633] mb-2'>No orders yet</p>
          <p className='jost text-sm text-[#6B6560] font-light'>Your order history will appear here</p>
        </div>
      ) : (
        <div className='flex flex-col gap-0'>
          {orderData.map((item, index) => (
            <div key={index} className='py-5 sm:py-6 border-t border-[#E2D9CC] flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6'>
              <div className='flex items-start gap-5 sm:gap-6'>
                <img
                  className='w-16 sm:w-20 aspect-[3/4] object-cover bg-[#F0EBE1] shrink-0'
                  src={item.image[0]}
                  alt={item.name}
                />
                <div>
                  <p className='playfair font-medium text-[#1C1C1C] text-sm sm:text-base mb-1'>{item.name}</p>
                  <div className='flex items-center gap-3 sm:gap-4 mt-1 flex-wrap'>
                    <p className='jost text-sm font-semibold text-[#1C1C1C]'>{currency}{item.price}</p>
                    <p className='jost text-xs text-[#6B6560] font-light'>Qty: {item.quantity}</p>
                    <span className='jost text-[10px] tracking-[0.2em] uppercase border border-[#E2D9CC] px-2 py-0.5 text-[#6B6560]'>{item.size}</span>
                  </div>
                  <p className='jost text-xs text-[#6B6560] font-light mt-2'>
                    {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className='jost text-xs text-[#6B6560] font-light capitalize'>{item.paymentMethod}</p>
                </div>
              </div>

              <div className='flex items-center justify-between md:justify-end gap-6 md:min-w-[200px]'>
                <div className='flex items-center gap-2'>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor[item.status] || 'bg-[#B8956A]'}`}></span>
                  <p className='jost text-xs sm:text-sm text-[#3A3633]'>{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className='jost border border-[#E2D9CC] text-[#3A3633] text-[10px] tracking-[0.2em] uppercase px-4 py-2 hover:border-[#B8956A] hover:text-[#B8956A] transition-all duration-200 font-medium'
                >
                  Track
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Order
