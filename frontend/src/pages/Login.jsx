import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/Shop';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  const inputClass = 'jost w-full px-4 py-3 bg-transparent border border-[#E2D9CC] text-[#1C1C1C] placeholder-[#6B6560] text-sm font-light focus:border-[#B8956A] transition-colors duration-200 outline-none'

  return (
    <div className='min-h-[75vh] flex items-center justify-center py-16'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-10'>
          <p className='jost text-[10px] tracking-[0.35em] uppercase text-[#B8956A] font-medium mb-3'>Welcome</p>
          <h1 className='playfair text-3xl sm:text-4xl text-[#1C1C1C] font-normal'>{currentState}</h1>
          <div className='flex items-center justify-center gap-2 mt-3'>
            <span className='block w-8 h-px bg-[#B8956A]'></span>
            <span className='block w-1.5 h-1.5 rounded-full bg-[#B8956A]'></span>
            <span className='block w-8 h-px bg-[#B8956A]'></span>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 px-6 sm:px-0'>
          {currentState === 'Sign Up' && (
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type='text'
              className={inputClass}
              placeholder='Full Name'
              required
            />
          )}
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type='email'
            className={inputClass}
            placeholder='Email Address'
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type='password'
            className={inputClass}
            placeholder='Password'
            required
          />

          <div className='flex justify-between items-center mt-1'>
            <button type='button' className='jost text-xs text-[#6B6560] hover:text-[#B8956A] transition-colors font-light'>
              Forgot password?
            </button>
            {currentState === 'Login'
              ? <button type='button' onClick={() => setCurrentState('Sign Up')} className='jost text-xs text-[#6B6560] hover:text-[#B8956A] transition-colors font-light'>
                  Create account
                </button>
              : <button type='button' onClick={() => setCurrentState('Login')} className='jost text-xs text-[#6B6560] hover:text-[#B8956A] transition-colors font-light'>
                  Sign in instead
                </button>
            }
          </div>

          <button
            type='submit'
            className='jost mt-2 w-full bg-[#1C1C1C] text-[#F9F6F0] py-3.5 text-[11px] tracking-[0.3em] uppercase font-medium hover:bg-[#B8956A] transition-colors duration-300'
          >
            {currentState === 'Login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
