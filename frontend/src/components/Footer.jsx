import { assets } from '../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  const companyLinks = [
    { label: 'Home',           path: '/'           },
    { label: 'About Us',       path: '/about'      },
    { label: 'Collection',     path: '/collection' },
    { label: 'Privacy Policy', path: '/'           },
  ]

  const socialLinks = ['Instagram', 'Pinterest', 'Twitter']
  const legalLinks  = ['Terms', 'Privacy', 'Cookies']

  return (
    <footer className="bg-[#F0EBE1] border-t border-[#E2D9CC]">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-12 sm:gap-10 py-14 sm:py-16">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="Forever" />
          <p className="jost w-full md:w-4/5 text-[#6B6560] text-sm leading-relaxed font-light">
            Crafting timeless pieces for the modern wardrobe. We believe in quality, sustainability, and the art of dressing well every single day.
          </p>
          <div className="flex gap-4 mt-6">
            {socialLinks.map((s) => (
              <button key={s} className="jost text-[10px] tracking-[0.2em] uppercase text-[#B8956A] hover:text-[#1C1C1C] transition-colors duration-200">
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="jost text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1C1C1C] mb-5">Company</p>
          <ul className="flex flex-col gap-2.5">
            {companyLinks.map(({ label, path }) => (
              <li key={label}>
                <Link to={path} className="jost text-[#6B6560] text-sm font-light hover:text-[#B8956A] transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="jost text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1C1C1C] mb-5">Get In Touch</p>
          <ul className="flex flex-col gap-2.5">
            <li className="jost text-[#6B6560] text-sm font-light">+1 212-121-2345</li>
            <li className="jost text-[#6B6560] text-sm font-light">hello@forever.com</li>
            <li className="jost text-[#6B6560] text-sm font-light">Mon–Sat, 9am–6pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E2D9CC] py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="jost text-xs text-[#6B6560] font-light tracking-wide">© 2025 Forever. All rights reserved.</p>
        <div className="flex gap-6">
          {legalLinks.map((t) => (
            <button key={t} className="jost text-[10px] tracking-[0.2em] uppercase text-[#6B6560] hover:text-[#B8956A] transition-colors">
              {t}
            </button>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
