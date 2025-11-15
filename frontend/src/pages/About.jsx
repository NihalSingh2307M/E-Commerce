import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 '>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis facere dolore voluptatum. Error vel hic, ipsum modi eaque sed consequatur esse non beatae nulla vitae, tempora laborum amet libero adipisci.</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non saepe eius voluptatibus repellat enim maiores, commodi quis rem eaque laborum quae voluptate, aut quia distinctio est, nulla iste tempore maxime?</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio qui minus doloremque exercitationem recusandae et! Quisquam ea, accusamus, ex inventore omnis quaerat sint eum maxime minima officiis totam placeat repellat?</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste numquam repellendus quia ut voluptate voluptates vitae natus vero, fugit quidem consectetur nulla reiciendis molestias quibusdam? Minus, inventore nobis? Nobis, a.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste numquam repellendus quia ut voluptate voluptates vitae natus vero, fugit quidem consectetur nulla reiciendis molestias quibusdam? Minus, inventore nobis? Nobis, a.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste numquam repellendus quia ut voluptate voluptates vitae natus vero, fugit quidem consectetur nulla reiciendis molestias quibusdam? Minus, inventore nobis? Nobis, a.</p>
        </div>

      </div>

      <NewsLetterBox/>

    </div>
  )
}

export default About