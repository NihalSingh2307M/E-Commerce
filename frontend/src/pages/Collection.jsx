import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shop";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products,search,showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const[sortType,setSortType] = useState('relevant')

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

  useEffect(() =>{
    let productsCopy = products.slice();

    if(showSearch && search ){
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if(category.length>0){
      productsCopy = productsCopy.filter(item=>
        category.includes(item.category)
      );
    }
    if(subCategory.length>0){
      productsCopy = productsCopy.filter(item =>
        subCategory.includes(item.subCategory)
      );
    }
    switch(sortType){
      case 'low-high':
        productsCopy.sort((a,b) => a.price - b.price);
        break;
      case 'high-low':
      productsCopy.sort((a,b) => b.price - a.price);
      break;
      case'relevant':
      default:
      break;
    }
    setFilterProducts(productsCopy);
  },[products,search,showSearch,category,subCategory,sortType,])
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm-gap-10 border-t">
      {/*Filter Option */}

      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            alt=""
          />
        </p>
        {/* Category filter */}
        <div
          className={`border border-gray-300  pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Men"}
                onChange={toggleCategory}
              />
              Men
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Women"}
                onChange={toggleCategory}
              />
              Women
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Kids"}
                onChange={toggleCategory}
              />
              Kids
            </p>
          </div>
        </div>

        {/*Sub-cat filter */}
        <div
          className={`border border-gray-300  pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Type</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Topwear"}
                onChange={toggleSubCategory}
              />
              TopWear
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
              />
              BottomWear
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Winterwear"}
                onChange={toggleSubCategory}
              />
              WinterWear
            </p>
          </div>
        </div>
      </div>

      {/*Ui -Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"All"} text2={"All Collection"} />
          {/*Product Sort */}
          <select onChange={(e)=>setSortType(e.target.value)} className="border border-gray-300 text-sm px-2">
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by:Low to high</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/*Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 ">
          {filterProducts.map((items, index) => (
            <ProductItem
              key={index}
              id={items._id}
              image={items.image}
              name={items.name}
              price={items.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
