import React from 'react'

const Title = ({text1, text2}) => {
  return (
    <div className='inline-flex flex-col items-center gap-2 mb-3'>
      <p className='playfair text-[#6B6560] text-lg tracking-wide font-normal'>
        {text1} <span className='text-[#1C1C1C] font-semibold italic'>{text2}</span>
      </p>
      <div className='flex items-center gap-2'>
        <span className='block w-10 h-px bg-[#B8956A]'></span>
        <span className='block w-1.5 h-1.5 rounded-full bg-[#B8956A]'></span>
        <span className='block w-10 h-px bg-[#B8956A]'></span>
      </div>
    </div>
  )
}

export default Title
