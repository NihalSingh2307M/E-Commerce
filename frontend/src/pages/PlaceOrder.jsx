import React, { useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/Shop'
import { useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  })

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }
      switch (method) {
        case 'cod': {
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;
        }
        case 'stripe': {
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message)
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }))
  }

  const inputClass = 'jost w-full border border-[#E2D9CC] bg-[#F9F6F0] px-4 py-3 text-sm text-[#1C1C1C] placeholder-[#6B6560] font-light focus:border-[#B8956A] transition-colors duration-200 outline-none'

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-10 sm:gap-16 pt-8 sm:pt-14 min-h-[80vh] border-t border-[#E2D9CC]'>

      {/* Left - Delivery Info */}
      <div className='flex flex-col w-full sm:max-w-[480px] gap-4'>
        <div className='mb-2'>
          <p className='jost text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-medium mb-1'>Step 1</p>
          <div className='text-xl sm:text-2xl'>
            <Title text1={'Delivery'} text2={'Information'} />
          </div>
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className={inputClass} type='text' placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className={inputClass} type='text' placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className={inputClass} type='email' placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className={inputClass} type='text' placeholder='Street address' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className={inputClass} type='text' placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className={inputClass} type='text' placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className={inputClass} type='number' placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className={inputClass} type='text' placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className={inputClass} type='number' placeholder='Phone number' />
      </div>

      {/* Right - Summary + Payment */}
      <div className='flex flex-col gap-8 w-full sm:max-w-[380px]'>
        <div>
          <p className='jost text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-medium mb-1'>Step 2</p>
          <CartTotal />
        </div>

        <div>
          <p className='jost text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-medium mb-3'>Step 3 — Payment</p>
          <div className='text-xl mb-4'>
            <Title text1={'Payment'} text2={'Method'} />
          </div>

          <div className='flex flex-col gap-3'>
            <div
              onClick={() => setMethod('stripe')}
              className={`flex items-center gap-4 border p-3.5 px-4 cursor-pointer transition-all duration-200 ${method === 'stripe' ? 'border-[#B8956A] bg-[#F0EBE1]' : 'border-[#E2D9CC] hover:border-[#B8956A]'}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 transition-colors duration-200 ${method === 'stripe' ? 'border-[#B8956A] bg-[#B8956A]' : 'border-[#E2D9CC]'}`}></div>
              <img className='h-5' src={assets.stripe_logo} alt='Stripe' />
            </div>

            <div
              onClick={() => setMethod('cod')}
              className={`flex items-center gap-4 border p-3.5 px-4 cursor-pointer transition-all duration-200 ${method === 'cod' ? 'border-[#B8956A] bg-[#F0EBE1]' : 'border-[#E2D9CC] hover:border-[#B8956A]'}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 transition-colors duration-200 shrink-0 ${method === 'cod' ? 'border-[#B8956A] bg-[#B8956A]' : 'border-[#E2D9CC]'}`}></div>
              <p className='jost text-[#3A3633] text-xs tracking-[0.2em] uppercase font-medium'>Cash on Delivery</p>
            </div>
          </div>

          <button
            type='submit'
            className='jost mt-6 w-full bg-[#1C1C1C] text-[#F9F6F0] py-4 text-[11px] tracking-[0.3em] uppercase font-medium hover:bg-[#B8956A] transition-colors duration-300'
          >
            Place Order
          </button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
