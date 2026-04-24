import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/Shop';
import { assets } from '../assets/frontend_assets/assets';
import RelatableProducts from '../components/RelatableProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    const foundProduct = products.find((item) => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setImage(foundProduct.image[0]);
    } else {
      setProductData(false);
      setImage('');
    }
  }, [productId, products]);

  return productData ? (
    <div className='border-t border-[#E2D9CC] pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-8 sm:gap-14 flex-col sm:flex-row'>

        {/* Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-normal sm:w-[18%] w-full gap-2 sm:gap-2.5'>
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-[23%] sm:w-full shrink-0 cursor-pointer border-2 transition-all duration-200 object-cover aspect-square ${image === item ? 'border-gold' : 'border-transparent hover:border-[#E2D9CC]'}`}
                alt=''
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%] bg-[#F0EBE1]'>
            <img className='w-full h-full object-cover' src={image} alt={productData.name} />
          </div>
        </div>

        {/* Info */}
        <div className='flex-1'>
          <p className='jost text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-2'>{productData.category} / {productData.subCategory}</p>
          <h1 className='playfair font-medium text-2xl sm:text-3xl text-[#1C1C1C] leading-tight mb-3'>{productData.name}</h1>

          <div className='flex items-center gap-1.5 mb-4'>
            {[1,2,3,4].map(i => (
              <img key={i} src={assets.star_icon} alt='' className='w-3.5' />
            ))}
            <img src={assets.star_dull_icon} alt='' className='w-3.5 opacity-40' />
            <p className='jost text-xs text-[#6B6560] ml-1 font-light'>(122 reviews)</p>
          </div>

          <p className='playfair text-3xl sm:text-4xl font-medium text-[#1C1C1C] mb-5'>{currency}{productData.price}</p>

          <p className='jost text-sm text-[#6B6560] leading-relaxed md:w-4/5 font-light mb-7'>{productData.description}</p>

          <div className='mb-7'>
            <p className='jost text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1C1C1C] mb-3'>Select Size</p>
            <div className='flex flex-wrap gap-2'>
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`jost min-w-11 py-2 px-3 text-xs font-medium border transition-all duration-200 ${item === size
                    ? 'bg-[#1C1C1C] text-[#F9F6F0] border-[#1C1C1C]'
                    : 'bg-transparent text-[#3A3633] border-[#E2D9CC] hover:border-gold'}`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className='jost w-full sm:w-auto bg-[#1C1C1C] text-[#F9F6F0] px-12 py-3.5 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-gold transition-colors duration-300 active:scale-95'
          >
            Add to Cart
          </button>

          <div className='border-t border-[#E2D9CC] mt-8 pt-6'>
            <div className='flex flex-col gap-2'>
              {['100% Original Product', 'Cash on delivery available', 'Easy return within 7 days'].map((item, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <span className='w-1 h-1 rounded-full bg-gold shrink-0'></span>
                  <p className='jost text-xs text-[#6B6560] font-light tracking-wide'>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pass name + description so RelatableProducts can do semantic vector search */}
      <RelatableProducts
        category={productData.category}
        subCategory={productData.subCategory}
        productName={productData.name}
        productDescription={productData.description}
      />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product