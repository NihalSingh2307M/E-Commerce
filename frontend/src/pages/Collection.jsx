import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shop";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant')

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  useEffect(() => {
    let productsCopy = products.slice();
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }
    switch (sortType) {
      case 'low-high':
        productsCopy.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        productsCopy.sort((a, b) => b.price - a.price);
        break;
      case 'relevant':
      default:
        break;
    }
    setFilterProducts(productsCopy);
  }, [products, search, showSearch, category, subCategory, sortType])

  const filterLabel = 'jost text-xs font-light text-[#3A3633] tracking-wide cursor-pointer flex items-center gap-3 py-1 hover:text-[#B8956A] transition-colors'

  return (
    <div className='flex flex-col sm:flex-row gap-6 sm:gap-10 border-t border-[#E2D9CC] pt-8'>

      <div className='min-w-56 sm:min-w-60'>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className='flex items-center gap-2 mb-4 sm:mb-6'
        >
          <p className='jost text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1C1C1C]'>Filters</p>
          <img
            src={assets.dropdown_icon}
            className={`h-2.5 sm:hidden transition-transform duration-300 ${showFilter ? 'rotate-90' : ''}`}
            alt=''
          />
        </button>

        <div className={`border border-[#E2D9CC] px-5 py-4 mb-4 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='jost text-[10px] font-semibold tracking-[0.25em] uppercase text-[#1C1C1C] mb-4'>Categories</p>
          <div className='flex flex-col gap-2'>
            {['Men', 'Women', 'Kids'].map(cat => (
              <label key={cat} className={filterLabel}>
                <input className='w-3.5 h-3.5 cursor-pointer' type='checkbox' value={cat} onChange={toggleCategory} />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={`border border-[#E2D9CC] px-5 py-4 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='jost text-[10px] font-semibold tracking-[0.25em] uppercase text-[#1C1C1C] mb-4'>Type</p>
          <div className='flex flex-col gap-2'>
            {[['Topwear', 'Topwear'], ['Bottomwear', 'Bottomwear'], ['Winterwear', 'Winterwear']].map(([val, label]) => (
              <label key={val} className={filterLabel}>
                <input className='w-3.5 h-3.5 cursor-pointer' type='checkbox' value={val} onChange={toggleSubCategory} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className='flex-1'>
        <div className='flex justify-between items-center mb-6 pb-4 border-b border-[#E2D9CC]'>
          <div className='text-xl sm:text-2xl'>
            <Title text1={'All'} text2={'Collection'} />
          </div>
          <select
            onChange={(e) => setSortType(e.target.value)}
            className='jost border border-[#E2D9CC] bg-[#F9F6F0] text-[#3A3633] text-xs tracking-wide px-3 py-2 outline-none cursor-pointer'
          >
            <option value='relevant'>Sort: Relevant</option>
            <option value='low-high'>Price: Low to High</option>
            <option value='high-low'>Price: High to Low</option>
          </select>
        </div>

        {filterProducts.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <p className='playfair text-2xl text-[#3A3633] mb-2'>No products found</p>
            <p className='jost text-sm text-[#6B6560] font-light'>Try adjusting your filters</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 gap-y-6 sm:gap-y-8'>
            {filterProducts.map((items, index) => (
              <ProductItem key={index} id={items._id} image={items.image} name={items.name} price={items.price} />
            ))}
          </div>
        )}

        {filterProducts.length > 0 && (
          <p className='jost text-xs text-[#6B6560] mt-6 font-light'>{filterProducts.length} products</p>
        )}
      </div>
    </div>
  );
};

export default Collection;
