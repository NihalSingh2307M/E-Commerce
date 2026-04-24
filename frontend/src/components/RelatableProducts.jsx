import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/Shop'
import Title from './Title';
import ProductItem from './ProductItem';
import axios from 'axios';

const RelatableProducts = ({ category, subCategory, productName, productDescription }) => {
  const { products, backendUrl } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!productName || products.length === 0) return;

    const query = `${productName} ${productDescription || ''}`.trim();

    axios.post(backendUrl + '/api/search', {
      query,
      topK: 6,
      category, // optional filter — keeps results in same category
    }).then(res => {
      if (!res.data.success) return;
      const ids = res.data.results.map(r => r.id);
      // Map IDs back to full product objects (for image, sizes, etc.)
      const matched = ids
        .map(id => products.find(p => p._id === id))
        .filter(Boolean)  // remove any IDs not yet in local products list
        .slice(0, 5);
      setRelated(matched);
    }).catch(e => {
      console.warn('[related] vector search failed, falling back to category filter', e.message);
      // Fallback: original category-based filter
      const fallback = products
        .filter(item => item.category === category && item.subCategory === subCategory)
        .slice(0, 5);
      setRelated(fallback);
    });
  }, [productName, productDescription, products])

  return (
    <div className='my-16 sm:my-24'>
      <div className='text-center text-2xl sm:text-3xl py-4 mb-6'>
        <Title text1={'Related'} text2={'Products'} />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 gap-y-6 sm:gap-y-8'>
        {related.map((item, index) => (
          <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
        ))}
      </div>
    </div>
  )
}

export default RelatableProducts