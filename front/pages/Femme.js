import { CartContext } from "@/lib/CartContext";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category"; // Ensure this import is here
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import toast from "react-hot-toast";
import Slider from "rc-slider"; // For the price slider
import "rc-slider/assets/index.css";

// Utility function to format price with a comma for thousands
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Femme({ allProducts }) {
  const { addProduct } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Apply filters to products
    let products = allProducts;

    if (selectedCategories.length > 0) {
      products = products.filter(product => selectedCategories.includes(product.title));
    }

    if (selectedBrand) {
      products = products.filter(product => product.brand === selectedBrand);
    }

    if (selectedSizes.length > 0) {
      products = products.filter(product => selectedSizes.includes(product.sizes));
    }

    if (selectedColors.length > 0) {
      products = products.filter(product => selectedColors.includes(product.colors));
    }

    products = products.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    setFilteredProducts(products);
  }, [selectedCategories, priceRange, selectedBrand, selectedSizes, selectedColors]);

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSelectedBrand('');
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  return (
    <div className="flex justify-center min-h-screen w-full">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen w-full">
          <Spinner />
        </div>
      ) : (
        <div className="mt-14 md:mt-6 w-full px-4 md:p-0 flex">
          <div className="w-1/4 p-4">
            <h2 className="text-lg font-bold mb-4">Filter</h2>
            <div>
              <h3 className="font-semibold">Category</h3>
              {["Short", "Pull", "Shoes","Robe","Jeans"].map(category => (
                <div key={category}>
                  <input
                    type="checkbox"
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => setSelectedCategories(prev => {
                      if (prev.includes(category)) {
                        return prev.filter(c => c !== category);
                      } else {
                        return [...prev, category];
                      }
                    })}
                  />
                  <label htmlFor={category} className="ml-2">{category}</label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Price</h3>
              <Slider
                range
                min={0}
                max={1000}
                value={priceRange}
                onChange={setPriceRange}
              />
              <p>{`DT. ${priceRange[0]} - DT. ${priceRange[1]}`}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Brand</h3>
              <div>
                <input
                  type="radio"
                  id="Dress_Up"
                  name="brand"
                  checked={selectedBrand === "Dress_Up"}
                  onChange={() => setSelectedBrand("Dress_Up")}
                />
                <label htmlFor="Dress_Up" className="ml-2">Dress_Up</label>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Size</h3>
              {["S", "M", "L", "XL"].map(size => (
                <div key={size}>
                  <input
                    type="checkbox"
                    id={size}
                    checked={selectedSizes.includes(size)}
                    onChange={() => setSelectedSizes(prev => {
                      if (prev.includes(size)) {
                        return prev.filter(s => s !== size);
                      } else {
                        return [...prev, size];
                      }
                    })}
                  />
                  <label htmlFor={size} className="ml-2">{size}</label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Color</h3>
              {["Noir", "Blanc", "Rose", "Maron", "Blue"].map(color => (
                <div key={color}>
                  <input
                    type="checkbox"
                    id={color}
                    checked={selectedColors.includes(color)}
                    onChange={() => setSelectedColors(prev => {
                      if (prev.includes(color)) {
                        return prev.filter(c => c !== color);
                      } else {
                        return [...prev, color];
                      }
                    })}
                  />
                  <label htmlFor={color} className="ml-2">{color}</label>
                </div>
              ))}
            </div>

            <button
              className="mt-4 p-2 bg-red-500 text-white rounded"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>

          <div className="w-3/4">
            {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-600">
                No matching products found.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 md:gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 xl:gap-x-8 px-2">
                {filteredProducts.map((product) => (
                  <div key={product._id}>
                    <div className="group block overflow-hidden border border-accent rounded-xl border-opacity-10">
                      <div className="">
                        <div className="relative md:h-[300px] h-[200px]">
                        <Link href={"/products/" + product._id}>
                          <img
                            src={product.images[0]}
                            alt=""
                            className="absolute inset-0 h-full w-full object-contain opacity-100 group-hover:opacity-0"
                          />
                          <img
                            src={product.images[1]}
                            alt=""
                            className="absolute inset-0 h-full w-full object-contain opacity-0 group-hover:opacity-100"
                          />
                          </Link>
                        </div>

                        <div className="relative p-3 border-t">
                          
                            <h3 className="text-md text-gray-700 ">
                              {product.title}
                            </h3>
                          

                            <div className="mt-1.5 flex items-center justify-between text-text">
                    <p className="tracking-wide text-black">DT. {formatPrice(product.price)}</p>


                      <button onClick={() => {addProduct(product._id);
                         toast.success('Item added to cart!!')}} type="button" class="flex items-center divide-x rounded-lg border bg-white text-center text-md font-medium text-secondary-700 shadow-sm hover:bg-gray-100">
                        <div class="flex items-center space-x-2 py-2.5 px-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>


                          <span>Add</span>
                        </div>
                        {/* <div class="py-2.5 px-3">18</div> */}
                      </button>

                    </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const allProducts = await Product.find({ gender: "Femme" }, null, { sort: { _id: 1 } }).populate('category');

  return {
    props: {
      allProducts: JSON.parse(JSON.stringify(allProducts)),
    },
  };
}
