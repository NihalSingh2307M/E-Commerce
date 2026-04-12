import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {
  return (
    <div>
      <div className="text-center pt-10 pb-4 border-t border-[#E2D9CC]">
        <Title text1="Contact" text2="Us" />
      </div>

      <div className="my-10 sm:my-14 flex flex-col justify-center md:flex-row gap-10 sm:gap-16 mb-20 sm:mb-28">
        <div className="w-full md:max-w-[460px] overflow-hidden bg-[#F0EBE1]">
          <img className="w-full h-full object-cover" src={assets.contact_img} alt="Contact" />
        </div>

        <div className="flex flex-col justify-center gap-6 md:max-w-sm">
          <div>
            <p className="jost text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-medium mb-2">Visit Us</p>
            <p className="playfair text-xl text-[#1C1C1C] font-medium mb-3">Our Store</p>
            <p className="jost text-[#6B6560] text-sm font-light leading-relaxed">
              5678 Wills Station, Suite 350<br />
              Bandra, Mumbai, India
            </p>
          </div>

          <div className="border-t border-[#E2D9CC] pt-5">
            <p className="jost text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-medium mb-2">Get In Touch</p>
            <p className="jost text-[#6B6560] text-sm font-light leading-relaxed">
              Tel: +91 89768 76709<br />
              Email: admin@forever.com
            </p>
          </div>

          <div className="border-t border-[#E2D9CC] pt-5">
            <p className="playfair text-xl text-[#1C1C1C] font-medium mb-2">Careers at Forever</p>
            <p className="jost text-[#6B6560] text-sm font-light mb-5">We are always looking for talented, passionate people to join our team.</p>
            <button className="jost border border-[#1C1C1C] text-[#1C1C1C] text-[11px] tracking-[0.25em] uppercase px-8 py-3.5 hover:bg-[#1C1C1C] hover:text-[#F9F6F0] transition-all duration-300 font-medium">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      <NewsLetterBox />
    </div>
  )
}

export default Contact
