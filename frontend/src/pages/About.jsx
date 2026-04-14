import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-center pt-10 pb-4 border-t border-[#E2D9CC]'>
        <Title text1={'About'} text2={'Us'} />
      </div>

      <div className='my-10 sm:my-14 flex flex-col md:flex-row gap-10 sm:gap-16'>
        <div className='w-full md:max-w-[420px] bg-[#F0EBE1] overflow-hidden'>
          <img className='w-full h-full object-cover' src={assets.about_img} alt='About Forever' />
        </div>
        <div className='flex flex-col justify-center gap-5 md:w-1/2'>
          <p className='jost text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-medium'>Our Story</p>
          <p className='jost text-[#6B6560] text-sm sm:text-base leading-relaxed font-light'>
            Born from a passion for timeless style, Forever was created to bridge the gap between luxury fashion and everyday wearability. We believe great clothing should last — in quality, in design, and in how it makes you feel.
          </p>
          <p className='jost text-[#6B6560] text-sm sm:text-base leading-relaxed font-light'>
            Every piece in our collection is thoughtfully curated, responsibly sourced, and crafted to become a cherished part of your wardrobe for years to come.
          </p>
          <div className='border-l-2 border-[#B8956A] pl-5 mt-2'>
            <p className='playfair text-[#1C1C1C] text-lg font-medium italic'>Our Mission</p>
            <p className='jost text-[#6B6560] text-sm leading-relaxed font-light mt-2'>
              To empower individuals through beautiful, sustainable fashion that respects both people and planet — without compromising on elegance or accessibility.
            </p>
          </div>
        </div>
      </div>

      <div className='py-10 sm:py-14 border-t border-[#E2D9CC]'>
        <div className='text-center mb-10'>
          <p className='jost text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-medium mb-2'>Our Promise</p>
          <h2 className='playfair text-2xl sm:text-3xl text-[#1C1C1C]'>Why Choose <em>Forever</em></h2>
        </div>

        <div className='flex flex-col md:flex-row gap-0'>
          {[
            { title: 'Quality Assurance', desc: 'Every garment passes rigorous quality checks before reaching you. We partner only with ethical manufacturers who share our commitment to excellence and fair labour practices.' },
            { title: 'Effortless Convenience', desc: 'From discovery to delivery, we make your shopping experience seamless. Enjoy free shipping, easy returns, and a curated selection that makes finding your perfect piece simple.' },
            { title: 'Exceptional Support', desc: 'Our dedicated team is available 24/7 to assist you. Whether it\'s sizing advice, order tracking, or styling tips — we\'re always here to help you look your best.' },
          ].map(({ title, desc }, i) => (
            <div key={i} className='flex-1 border border-[#E2D9CC] px-8 sm:px-10 py-10 sm:py-14 flex flex-col gap-4 hover:bg-[#F0EBE1] transition-colors duration-300'>
              <div className='w-8 h-px bg-[#B8956A]'></div>
              <p className='playfair font-medium text-[#1C1C1C] text-lg'>{title}</p>
              <p className='jost text-[#6B6560] text-sm leading-relaxed font-light'>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <NewsLetterBox />
    </div>
  )
}

export default About
