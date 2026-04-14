import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/Shop";
import ProductItem from "../components/ProductItem";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const gridRef = useRef(null);

  const toggleCategory = (val) => {
    setCategory((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  const toggleSubCategory = (val) => {
    setSubCategory((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  useEffect(() => {
    let productsCopy = products.slice();
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    switch (sortType) {
      case "low-high":
        productsCopy.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        productsCopy.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilterProducts(productsCopy);
  }, [products, search, showSearch, category, subCategory, sortType]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      const pills = filtersRef.current?.querySelectorAll(".filter-pill");
      if (pills?.length) {
        gsap.fromTo(
          pills,
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.07, delay: 0.3, ease: "back.out(1.7)" }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".product-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.04, ease: "power2.out" }
    );
  }, [filterProducts]);

  const activeFilterCount = category.length + subCategory.length;

  return (
    <div className="min-h-screen -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]" style={{ backgroundColor: "var(--ivory)" }}>
      {/* Header */}
      <div
        ref={headerRef}
        className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-14 pb-8 border-b border-(--ivory-border)"
      >
        <p className="text-[10px] tracking-[0.35em] uppercase mb-3 font-light text-(--charcoal-light)" >
          Discover
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold leading-none playfair">
              <span className="text-(--charcoal)">All </span>
              <span className="text-(--charcoal-light)">Collection</span>
            </h1>
            <p className="text-sm mt-3 font-light text-(--charcoal-light)">
              {filterProducts.length} items
            </p>
          </div>
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="text-sm px-5 py-2.5 rounded-full cursor-pointer transition-all duration-200 focus:outline-none bg-(--ivory-dark) border border-(--ivory-border) text-(--charcoal-mid)"
          >
            <option value="relevant">Sort: Relevant</option>
            <option value="low-high">Sort: Low to High</option>
            <option value="high-low">Sort: High to Low</option>
          </select>
        </div>

        <div className="mt-8 h-px bg-(--ivory-border) " />

        {/* Filter Pills */}
        <div ref={filtersRef} className="flex flex-wrap items-center gap-2 mt-6">
          <span className="text-[10px] tracking-[0.3em] uppercase mr-2 font-light bg-(--charcoal-light)" >Filter</span>
          <div className="w-px h-4 bg-(--ivory-border)" />
          {["Men", "Women", "Kids"].map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="filter-pill px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200"
              style={
                category.includes(cat)
                  ? { backgroundColor: "var(--charcoal)", color: "var(--ivory)", border: "1px solid var(--charcoal)" }
                  : { backgroundColor: "transparent", color: "var(--charcoal-mid)", border: "1px solid var(--ivory-border)" }
              }
            >
              {cat}
            </button>
          ))}
          <div className="w-px h-4 mx-1" style={{ backgroundColor: "var(--ivory-border)" }} />
          {["Topwear", "Bottomwear", "Winterwear"].map((sub) => (
            <button
              key={sub}
              onClick={() => toggleSubCategory(sub)}
              className="filter-pill px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200"
              style={
                subCategory.includes(sub)
                  ? { backgroundColor: "var(--gold)", color: "var(--ivory)", border: "1px solid var(--gold)" }
                  : { backgroundColor: "transparent", color: "var(--charcoal-mid)", border: "1px solid var(--ivory-border)" }
              }
            >
              {sub}
            </button>
          ))}
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setCategory([]); setSubCategory([]); }}
              className="filter-pill ml-2 px-3 py-1.5 rounded-full text-xs transition-all duration-200"
              style={{ color: "var(--charcoal-light)", border: "1px solid var(--ivory-border)" }}
            >
              Clear ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Product Grid — full width, no sidebar */}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-10">
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8"
        >
          {filterProducts.map((item, index) => (
            <div key={index} className="product-card">
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </div>
          ))}
        </div>

        {filterProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-6xl mb-4" style={{ color: "var(--ivory-border)" }}>∅</p>
            <p className="text-sm tracking-widest uppercase" style={{ color: "var(--charcoal-light)" }}>No items found</p>
            <button
              onClick={() => { setCategory([]); setSubCategory([]); }}
              className="mt-6 px-6 py-2 text-xs tracking-widest uppercase rounded-full transition-all duration-200"
              style={{ border: "1px solid var(--ivory-border)", color: "var(--charcoal-light)" }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
