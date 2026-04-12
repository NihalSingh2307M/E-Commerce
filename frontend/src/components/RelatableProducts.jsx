import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/Shop'
import Title from './Title'
import ProductItem from './ProductItem'

const RelatableProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext)
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products
        .filter((item) => item.category === category && item.subCategory === subCategory)
        .slice(0, 5)
      setRelated(filtered)
    }
  }, [products, category, subCategory])

  return (
    <div className="my-16 sm:my-24">
      <div className="text-center text-2xl sm:text-3xl py-4 mb-6">
        <Title text1="Related" text2="Products" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 gap-y-6 sm:gap-y-8">
        {related.map((item) => (
          <ProductItem key={item._id} id={item._id} name={item.name} price={item.price} image={item.image} />
        ))}
      </div>
    </div>
  )
}

export default RelatableProducts
