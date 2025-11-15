import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/Shop'
import ProductItem from './ProductItem';
import Title from './Title';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0, 12));
    }, [products])
    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'Latest'} text2={'Collection'} />
                <p className='w-3/4 m-auto text-xm sm:text-sm md-text-base text-gray-600'>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid debitis error, obcaecati a magni beatae. Ipsam nobis perferendis, facilis voluptatum voluptates accusantium natus. Earum in reprehenderit id
                    dolorem aut explicabo!
                </p>
            </div>
            {/* renddering products
         */}
            <div className='grid grid-cols-2 sm-grid-cols-3 md:grid-cols-4 lg-grid-cols-5 gap-4 gap-y-6'>
                {
                    latestProducts.map((items, index) => (
                        <ProductItem key={index} id={items._id} image={items.image} name={items.name} price={items.price} />
                    ))
                }

            </div>
        </div>
    )
}

export default LatestCollection