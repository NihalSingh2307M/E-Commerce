import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/Shop'
import { assets } from '../assets/frontend_assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const CATEGORIES    = ['Men', 'Women', 'Kids']
const SUB_CATEGORIES = ['Topwear', 'Bottomwear', 'Winterwear']

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext)
  const [showFilter,      setShowFilter]      = useState(false)
  const [filterProducts,  setFilterProducts]  = useState([])
  const [category,        setCategory]        = useState([])
  const [subCategory,     setSubCategory]     = useState([])
  const [sortType,        setSortType]        = useState('relevant')

  const toggleCategory = (e) => {
    const val = e.target.value
    setCategory((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    )
  }

  const toggleSubCategory = (e) => {
    const val = e.target.value
    setSubCategory((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    )
  }

  useEffect(() => {
    let copy = products.slice()
    if (showSearch && search) {
      copy = copy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0)    copy = copy.filter((item) => category.includes(item.category))
    if (subCategory.length > 0) copy = copy.filter((item) => subCategory.includes(item.subCategory))
    if (sortType === 'low-high') copy.sort((a, b) => a.price - b.price)
    if (sortType === 'high-low') copy.sort((a, b) => b.price - a.price)
    setFilterProducts(copy)
  }, [products, search, showSearch, category, subCategory, sortType])

  const filterLabel = 'jost text-xs font-light text-[#3A3633] tracking-wide cursor-pointer flex items-center gap-3 py-1 hover:text-[#B8956A] transition-colors'

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 border-t border-[#E2D9CC] pt-8">

      {/* Sidebar filters */}
      <aside className="min-w-56 sm:min-w-60">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 mb-4 sm:mb-6"
        >
          <p className="jost text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1C1C1C]">Filters</p>
          <img
            src={assets.dropdown_icon}
            className={`h-2.5 sm:hidden transition-transform duration-300 ${showFilter ? 'rotate-90' : ''}`}
            alt=""
          />
        </button>

        {/* Categories */}
        <div className={`border border-[#E2D9CC] px-5 py-4 mb-4 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="jost text-[10px] font-semibold tracking-[0.25em] uppercase text-[#1C1C1C] mb-4">Categories</p>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className={filterLabel}>
                <input className="w-3.5 h-3.5 cursor-pointer" type="checkbox" value={cat} onChange={toggleCategory} />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className={`border border-[#E2D9CC] px-5 py-4 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="jost text-[10px] font-semibold tracking-[0.25em] uppercase text-[#1C1C1C] mb-4">Type</p>
          <div className="flex flex-col gap-2">
            {SUB_CATEGORIES.map((sub) => (
              <label key={sub} className={filterLabel}>
                <input className="w-3.5 h-3.5 cursor-pointer" type="checkbox" value={sub} onChange={toggleSubCategory} />
                <span>{sub}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Product grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E2D9CC]">
          <div className="text-xl sm:text-2xl">
            <Title text1="All" text2="Collection" />
          </div>
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="jost border border-[#E2D9CC] bg-[#F9F6F0] text-[#3A3633] text-xs tracking-wide px-3 py-2 outline-none cursor-pointer"
          >
            <option value="relevant">Sort: Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {filterProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="playfair text-2xl text-[#3A3633] mb-2">No products found</p>
            <p className="jost text-sm text-[#6B6560] font-light">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 gap-y-6 sm:gap-y-8">
            {filterProducts.map((item) => (
              <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} />
            ))}
          </div>
        )}

        {filterProducts.length > 0 && (
          <p className="jost text-xs text-[#6B6560] mt-6 font-light">{filterProducts.length} products</p>
        )}
      </div>
    </div>
  )
}

export default Collection
